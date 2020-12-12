/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;

import * as h from "./animation-helpers.ts";
import { dof8, dof8Set } from "./dof8.ts";
function delay(ms: number): Promise<void> {
  return new Promise((res): number =>
    setTimeout((): void => {
      res();
    }, ms)
  );
}

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

export async function animationLoop(
  channel: RTCDataChannel | null,
  frameGenerator: (t: number) => dof8Set | false,
): Promise<void> {
  if (!channel) {
    return;
  }
  let t = 0;
  let frame = frameGenerator(t);
  try {
    while (frame) {
      channel.send(JSON.stringify([1, frame]));
      await delay(freq);
      t += freq;
      frame = frameGenerator(t);
    }
    channel.send(JSON.stringify([1, {
      s0: {
        alpha: 0,
      },
    }]));
  } catch (e) {
    console.log(e);
    // Only log if not a websocket error.
  }
  return;
}