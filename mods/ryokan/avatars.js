// Which pixel guest stands for which agent. Every agent gets one of the
// twelve avatars in img/, chosen from a hash of its terminal address so it
// keeps the same face across restarts, and no two agents on screen share one
// while there are faces left.

import { ASSETS } from "./kit.js";

export const AVATARS = ["neko", "daruma", "koi", "onigiri", "kitsune", "chochin", "fuji", "torii", "kappa", "sakura", "matcha", "tanuki"];

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** address → avatar name, for the agents listed now (sorted by address so the
 *  result doesn't depend on list order). */
export function assign(addresses) {
  const out = new Map();
  const used = new Set();
  for (const a of [...addresses].sort()) {
    let i = hash(a) % AVATARS.length;
    for (let k = 0; k < AVATARS.length && used.has(AVATARS[i]); k++) i = (i + 1) % AVATARS.length;
    used.add(AVATARS[i]);
    out.set(a, AVATARS[i]);
  }
  return out;
}

export function avatarPath(name) {
  return `${ASSETS}/img/avatar-${name}.svg`;
}
