import { dof8, dof8Set } from "./dof8.ts";

export function degreesToRadians(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

export function fadeIn(t: number, duration: number): dof8 {
    return { alpha: (t / duration)};
}

export function fadeOut(t: number, duration: number, endPoint: number): dof8 {
    return {alpha: (1 - ((t - (endPoint - duration)) / duration))};
}

export function spin(t: number, start: dof8, end: dof8, duration: number): dof8 {
    const outOne = t / duration;
    const range: dof8 = {};
    if(start.X && end.X){
        range.X = (end.X - start.X);
    }
    if(start.Z && end.Z){
        range.Z = (end.Z - start.Z);
    }
    if(start.Z && end.Z){
        range.Z = (end.Z - start.Z);
    }
    const out: dof8 = {};
    if(range.X && start.X){
        out.X = (outOne * range.X) + start.X;
    }
    if(range.Y && start.Y){
        out.Y = (outOne * range.Y) + start.Y;
    }
    if(range.Z && start.Z){
        out.Z = (outOne * range.Z) + start.Z;
    }
    return out;
}

function wrapUpper(n: number): number{
    return n;
}
function wrapAlpha(n: number): number{
    return n;
}

function mergeLower(a: number, b: number): number{
    return a;
}
function mergeUpper(a: number, b: number): number{
    return a;
}
function mergeScale(a: number, b: number): number{
    return a;
}
function mergeAlpha(a: number, b: number): number{
    return a;
}

export function mergeDof8(a: dof8, b: dof8): dof8 {
    const output: dof8 = {};
    if (a.x) {
        if (b.x) {
            output.x = b.x + a.x
        } else {
            output.x = a.x
        }
    }
    if (a.y) {
        if (b.y) {
            output.y = b.y + a.y
        } else {
            output.y = a.y
        }
    }
    if (a.z) {
        if (b.z) {
            output.z = b.z + a.z
        } else {
            output.z = a.z
        }
    }
    if (a.X) {
        if (b.X) {
            output.X = b.X + a.X
        } else {
            output.X = a.X
        }
    }
    if (a.Y) {
        if (b.Y) {
            output.Y = b.Y + a.Y
        } else {
            output.Y = a.Y
        }
    }
    if (a.Z) {
        if (b.Z) {
            output.Z = b.Z + a.Z
        } else {
            output.Z = a.Z
        }
    }
    if (a.scale) {
        if (b.scale) {
            output.scale = b.scale + a.scale
        } else {
            output.scale = a.scale
        }
    }
    if (a.alpha) {
        if (b.alpha) {
            output.alpha = b.alpha + a.alpha
        } else {
            output.alpha = a.alpha
        }
    }
    return output;
}

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