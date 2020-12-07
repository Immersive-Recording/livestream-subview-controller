import { dof8, dof8Set } from "./dof8.ts";

export function degreesToRadians(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

export function fadeIn(t: number, duration: number): dof8 {
    if (t <= duration) {
        return { alpha: (t / duration) };
    } else {
        return {};
    }
}

export function fadeOut(t: number, duration: number, endPoint: number): dof8 {
    if (t >= (endPoint - duration)) {
        return { alpha: (1 - ((t - (endPoint - duration)) / duration)) };
    } else {
        return {};
    }
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

function mergeLower(a: number | undefined, b: number | undefined): number | undefined{
    if(a){
        if(b){
            return b + a;
        } else {
            return a;
        }
    }
}
function mergeUpper(a: number | undefined, b: number | undefined): number | undefined {
    if (a) {
        if (b) {
            return b + a;
        } else {
            return a;
        }
    } else {
        return undefined;
    }
}
function mergeScale(a: number | undefined, b: number | undefined): number | undefined {
    if (a) {
        if (b) {
            return b + a;
        } else {
            return a;
        }
    } else {
        return undefined;
    }
}
function mergeAlpha(a: number | undefined, b: number | undefined): number | undefined {
    if (a) {
        if (b) {
            return b + a;
        } else {
            return a;
        }
    } else {
        return undefined;
    }
}

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