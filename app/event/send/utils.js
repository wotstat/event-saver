
function Vector3Unwrap(name, vector) {
    return {
        [`${name}_x`]: vector.x,
        [`${name}_y`]: vector.y,
        [`${name}_z`]: vector.z,
    }
}

function CHBool(val) {
    return val ? 1 : 0
}

function CHArray(val) {
    return JSON.stringify(val).replace(/"/g, '\'')
}

function S2MS(val) {
    return Number.parseInt(val * 1000)
}

function TupleStringToArray(val) {
    return val.replace(/[\(\)]/g, '').split(',').map(Number)
}

function ArrayAverage(val) {
    return val.reduce((a, b) => a + b, 0) / val.length
}

export { Vector3Unwrap, CHBool, S2MS, CHArray, TupleStringToArray, ArrayAverage }
