/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;

import * as h from "./animation-helpers.ts";
import { dof8, dof8Set } from "./dof8.ts";
import { delay } from "./delay.ts";
import * as settings from "./THREE-SETTINGS.ts";
import { offset as offsetPrime } from "./offset.ts";

export const offset = offsetPrime;

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

    if (t <= (1000 * 10) + (settings.freq * 2)) {
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

    if (t <= (1000 * 7) + (settings.freq * 2)) {
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

    if (t <= (1000 * 10) + (settings.freq * 2)) {
        const tSub = h.timeSubset(t, 0, (1000 * 120));
        r.s0 = { ...r.s0, ...h.spin(tSub, start180, end180) };
        return h.offsetMerge(r, offset);
    }
    return false
}
export function mcUp(t: number): dof8Set | false {
  const r: dof8Set = {};

  if (t <= (500) + (settings.freq * 2)) {
    r.p0 = { ...r.p0, ...h.fadeIn(t, 500) };
    return r;
  }
  return false;
}
export function mcDown(t: number): dof8Set | false {
  const r: dof8Set = {};

  if (t <= (500) + (settings.freq * 2)) {
    r.p0 = { ...r.p0, ...h.fadeOut(t, 500, 500) };
    return r;
  }
  return false;
}

export async function animationLoop(
  channel: RTCDataChannel | null,
  frameGenerator: (t: number) => dof8Set | false,
): Promise<void> {
  if (!channel) {
    return;
  }
  await delay((0.1 * 1000))
  let t = 0;
  let frame = frameGenerator(t);
  try {
    while (frame) {
      channel.send(JSON.stringify([1, frame]));
      await delay(settings.freq);
      t += settings.freq;
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