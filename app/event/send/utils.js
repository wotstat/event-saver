
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

function S2MS(val) {
    return Number.parseInt(val * 1000)
}

export { Vector3Unwrap, CHBool, S2MS }
