import { writeFileSync } from 'node:fs'
import {
  DEFAULT_CONFIG, LiteralType, ObjectProperty, ObjectType, SchemaGenerator, UnionType,
  createFormatter, createParser, createProgram, derefType, ts,
} from 'ts-json-schema-generator'

// The built-in mapped-type parser loses inherited types with additionalProperties
// enabled, and strips annotations such as @asType and @minimum through utility types.
// Reuse the original properties so validation matches the source interfaces.
class UtilityTypeParser {
  constructor(program) {
    this.program = program
  }

  supportsNode(node) {
    return ts.isTypeAliasDeclaration(node)
      && ['Omit', 'Partial', 'Required'].includes(node.name.text)
      && this.program.isSourceFileDefaultLibrary(node.getSourceFile())
  }

  createType(node, context) {
    const [source, keys] = context.getArguments()
    const object = derefType(source)
    if (!(object instanceof ObjectType)) {
      throw new Error('Schema generation supports Omit, Partial and Required of object interfaces')
    }

    const omitted = new Set()
    if (node.name.text === 'Omit') {
      const keyType = derefType(keys)
      const literals = keyType instanceof UnionType ? keyType.getFlattenedTypes(derefType) : [keyType]
      if (literals.some(key => !(key instanceof LiteralType))) {
        throw new Error('Schema generation supports Omit with literal keys')
      }
      literals.forEach(key => omitted.add(String(key.getValue())))
    }
    const properties = new Map()
    const collect = type => {
      const base = derefType(type)
      if (!(base instanceof ObjectType)) {
        throw new Error('Utility types require object interfaces throughout the inheritance chain')
      }
      base.getBaseTypes().forEach(collect)
      base.getProperties().forEach(property => properties.set(property.getName(), property))
    }
    collect(object)

    return new ObjectType(
      `${node.name.text}<${source.getId()}${keys ? ',' + keys.getId() : ''}>`,
      [],
      [...properties.values()]
        .filter(property => !omitted.has(property.getName()))
        .map(property => node.name.text === 'Omit' ? property : new ObjectProperty(
          property.getName(), property.getType(), node.name.text === 'Required',
        )),
      object.getAdditionalProperties(),
    )
  }
}

export function generateSchema(path = './src/types/events.ts') {
  const config = { ...DEFAULT_CONFIG, path, skipTypeCheck: true, additionalProperties: true, extraTags: ['additionalProperties'] }
  const program = createProgram(config)
  const parser = createParser(program, config, chain => chain.addNodeParser(new UtilityTypeParser(program)))
  return new SchemaGenerator(program, parser, createFormatter(config), config).createSchema()
}

if (import.meta.main) {
  const schema = generateSchema()
  const sort = value => {
    if (Array.isArray(value)) return value.map(sort)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]))
    }
    return value
  }
  writeFileSync('./src/types/types.json', JSON.stringify(sort(schema), null, 2))
}
