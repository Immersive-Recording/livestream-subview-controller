/**
 * 8 Degrees of Freedom interface.
 * lowercase: positional.
 * uppercase: rotational (in radians).
 * scale: scale.
 * alpha: opacity. (0: transparent, 1: opaque)
 */
export interface dof8 {
    x?: number,
    y?: number,
    z?: number,
    X?: number,
    Y?: number,
    Z?: number,
    scale?: number,
    alpha?: number,
}

/**
 * Object Name -> dof8 set
 * Used for sending state updates.
 */
export type dof8Set = Record<string, dof8>;