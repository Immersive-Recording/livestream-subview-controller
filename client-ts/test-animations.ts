import * as h from "./animation-helpers.ts";
import { dof8, dof8Set } from "./dof8.ts";
import { delay } from "https://deno.land/std@0.79.0/async/mod.ts";
import { WebSocket } from 'https://deno.land/std@0.77.0/ws/mod.ts';

export const freq = 1000 / 60;

export const offset: dof8Set = {
    s0: {
        alpha: 0
    },
    s1: {
        Y: h.degreesToRadians(-90)
    }
}

const start180: dof8 = {
    Y: 0
}
const end180: dof8 = {
    Y: h.degreesToRadians(180)
}

export function song10Gen(t: number): dof8Set | false {
    const r: dof8Set = {}
    r.s0 = { ...r.s0, ...h.fadeIn(t, 500) };
    if (r.s0?.alpha && r.s0.alpha >= 1) {
        r.s0 = { ...r.s0, ...h.fadeOut(t, 500, (1000 * 10)) };
    }

    if (t <= (1000 * 10) + (freq * 2)) {
        const tSub = h.timeSubset(t, 0, (1000 * 10));
        r.s0 = { ...r.s0, ...h.spin(tSub, start180, end180) };
        return h.offsetMerge(r, offset);
    }
    return false
}

export function communion7Gen(t: number): dof8Set | false {
    const r: dof8Set = {}
    r.s0 = { ...r.s0, ...h.fadeIn(t, 250) };
    if (r.s0?.alpha && r.s0.alpha >= 1) {
        r.s0 = { ...r.s0, ...h.fadeOut(t, 250, (1000 * 7)) };
    }

    if (t <= (1000 * 7) + (freq * 2)) {
        const tSub = h.timeSubset(t, 0, (1000 * 7));
        r.s0 = { ...r.s0, ...h.spin(tSub, start180, end180) };
        return h.offsetMerge(r, offset);
    }
    return false
}

export function after120Gen(t: number): dof8Set | false {
    const r: dof8Set = {}
    r.s0 = { ...r.s0, ...h.fadeIn(t, 500) };
    if (r.s0?.alpha && r.s0.alpha >= 1) {
        r.s0 = { ...r.s0, ...h.fadeOut(t, 500, (1000 * 120)) };
    }

    if (t <= (1000 * 10) + (freq * 2)) {
        const tSub = h.timeSubset(t, 0, (1000 * 120));
        r.s0 = { ...r.s0, ...h.spin(tSub, start180, end180) };
        return h.offsetMerge(r, offset);
    }
    return false
}

export async function animationLoop(socket: WebSocket | null, frameGenerator: (t: number)=>dof8Set|false): Promise<void> {
    if (!socket){
        return;
    }
    let t = 0;
    let frame = frameGenerator(t);
    try {
        while (frame) {
            socket.send(JSON.stringify(frame));
            await delay(freq);
            t += freq;
            frame = frameGenerator(t);
        }
        socket.send(JSON.stringify({
            s0: {
                alpha: 0
            }
        }));
    } catch(e) {
        if (!(e instanceof Deno.errors.ConnectionReset))
            console.log(e)
            // Only log if not a websocket error.
    }
    return;
}