
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

export { Vector3Unwrap, CHBool }
