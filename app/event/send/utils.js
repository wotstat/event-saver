
function Vector3Unwrap(name, vector) {
    return {
        [`${name}_x`]: vector.x,
        [`${name}_y`]: vector.y,
        [`${name}_z`]: vector.z,
    }
}

export { Vector3Unwrap }
