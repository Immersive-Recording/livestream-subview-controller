import { dof8, dof8Set } from "./dof8.ts";

/**
 * A float that should be between 0 and 1.
 * Where 0 is the start of the animation and 1 is the end.
 */
export declare type timeFloat = number;

/**
 * Converts degrees to radians (what THREE.js uses)
 * @param degrees degrees input
 */
export function degreesToRadians(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

/**
 * Converts degrees to radians (what THREE.js uses)
 * Alias for degreesToRadians function.
 * @param degrees  degrees input
 */
export function d2r(degrees: number): number {
    return degreesToRadians(degrees);
}

/**
 * Preforms a fade from transparent to opaque.
 * Shorthand for fading in a object at start of animation.
 * @param t animation timestamp in ms
 * @param duration duration in ms
 */
export function fadeIn(t: number, duration: number): dof8 {
    const tSub = timeSubset(t, 0, duration);
    const alpha = linearChange(tSub, 0, 1);
    return { alpha };
}

/**
 * Preforms a fade from opaque to transparent.
 * Shorthand for fading out a object at the end of animation.
 * @param t animation timestamp in ms
 * @param duration duration in ms
 * @param endPoint the time the animation should end at
 */
export function fadeOut(t: number, duration: number, endPoint: number): dof8 {
    const tSub = timeSubset(t, (endPoint - duration), endPoint);
    const alpha = linearChange(tSub, 1, 0);
    return { alpha };
}

/**
 * Converts timecode to a float.
 * @param t timecode int
 * @param startT timecode for 0
 * @param endT timecode for 1
 */
export function timeSubset(t: number, startT: number, endT: number): timeFloat{
    const range = endT - startT;
    return (t - startT) / range;
}

/**
 * Linear change function.
 * 
 * Partially because I'm bad at math and forget the equation snippet.
 * @param t timeFloat
 * @param start Starting Value
 * @param end Ending Value
 */
export function linearChange(t: timeFloat, start: number, end: number): number {
    return (t * (end - start)) + start;
}

/**
 * Spins a object from the starting configuration to the ending configuration.
 * Both starting and ending dof8 values must be set for the output to include them.
 * @param t timeFloat
 * @param start starting set of dof8 values
 * @param end ending set of dof8 values
 */
export function spin(t: timeFloat, start: dof8, end: dof8): dof8 {
    const out: dof8 = {};
    if (start.X != undefined && end.X != undefined) {
        out.X = linearChange(t, start.X, end.X);
    }
    if (start.Y != undefined && end.Y != undefined) {
        out.Y = linearChange(t, start.Y, end.Y);
    }
    if (start.Z != undefined && end.Z != undefined) {
        out.Z = linearChange(t, start.Z, end.Z);
    }
    return out;
}

function wrapUpper(n: number): number{
    return n;
}
function wrapAlpha(n: number): number{
    return n;
}

function mergeLower(a: number | undefined, b: number | undefined): number | undefined{
    if(a != undefined){
        if(b != undefined){
            return b + a;
        } else {
            return a;
        }
    }
}
function mergeUpper(a: number | undefined, b: number | undefined): number | undefined {
    if (a != undefined) {
        if (b != undefined) {
            return b + a;
        } else {
            return a;
        }
    } else {
        return undefined;
    }
}
function mergeScale(a: number | undefined, b: number | undefined): number | undefined {
    if (a != undefined) {
        if (b != undefined) {
            return b + a;
        } else {
            return a;
        }
    } else {
        return undefined;
    }
}
function mergeAlpha(a: number | undefined, b: number | undefined): number | undefined {
    if (a != undefined) {
        if (b != undefined) {
            return b + a;
        } else {
            return a;
        }
    } else {
        return undefined;
    }
}

/**
 * Merges (adds) values of two dof8 records.
 * If only one object has data, it will be copied.
 * @param a first dof8 object
 * @param b second dof8 object
 */
export function mergeDof8(a: dof8, b: dof8): dof8 {
    const output: dof8 = {};
    output.x = mergeLower(a.x, b.x);
    output.y = mergeLower(a.y, b.y);
    output.z = mergeLower(a.z, b.z);
    output.X = mergeUpper(a.X, b.X);
    output.Y = mergeUpper(a.Y, b.Y);
    output.Z = mergeUpper(a.Z, b.Z);
    output.scale = mergeScale(a.scale, b.scale);
    output.alpha = mergeAlpha(a.alpha, b.alpha);
    return output;
}

/**
 * Merges two dof8Sets using the mergeDof8 function.
 * If only one object has data, it will be copied.
 * @param input dof8Set to merge
 * @param offset dof8Set to merge
 */
export function offsetMerge(input: dof8Set, offset: dof8Set): dof8Set {
    const output: dof8Set = {};
    for (const r in input) {
        if (offset[r]) {
            output[r] = mergeDof8(input[r], offset[r]);
        } else {
            output[r] = input[r];
        }
    }
    return output;
}