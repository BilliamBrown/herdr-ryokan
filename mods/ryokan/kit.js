// Ryokan's drawing kit: the pixel font, whole-pixel sizes, section and
// machine headers, pixel boxes and status words, shared by both roles.
//
// Pixels: PixelMplus12 is a 12 px bitmap-style font. `unit()` gives u(n):
// n design px divided by the app zoom, so text set at u(12) always lands on
// 12 logical px (24 device px on a Retina screen) and stays crisp.

import { div, svg } from "gpui-kit";
import { h_flex } from "gpui-base";
import { settings, theme, openOverlay } from "herdr";

export const FONT = "PixelMplus12";
export const ASSETS = "mods/ryokan";

export function unit() {
  const z = Number(settings()?.zoom) || 1;
  return (n) => n / z;
}

/** The root of a role: pixel font, 12 px, the theme's text color. */
export function root(u, el) {
  const t = theme();
  return el.font_family(FONT).text_size(u(12)).line_height(`${u(14)}px`).text_color(t.foreground);
}

/** A tinted pixel icon; without a color it takes the text color around it. */
export function icon(name, size, color) {
  const el = svg(`${ASSETS}/icons/${name}.svg`).flex_none().w(size).h(size);
  return color ? el.text_color(color) : el;
}

/** Status → word, kanji and theme color. */
export const STATUS = {
  working: { word: "WORK", kanji: "作", color: "working" },
  blocked: { word: "NEEDS YOU", kanji: "要", color: "blocked" },
  done: { word: "DONE", kanji: "済", color: "done" },
  idle: { word: "IDLE", kanji: "休", color: "idle" },
};

export function statusColor(t, status) {
  return t[STATUS[status]?.color ?? "idle"] ?? t.idle;
}

/** A section's title row: 「間 SPACES」 with something on the right. */
export function sectionHeader(u, t, kanji, label, right) {
  return h_flex()
    .flex_none()
    .h(u(26))
    .px(u(12))
    .gap(u(8))
    .items_center()
    .child(icon("shoji", u(12), t.dim))
    .child(div().text_color(t.dim).child(kanji))
    .child(div().text_color(t.muted).child(label))
    .child(div().flex_1())
    .when(Boolean(right), (el) => el.child(right));
}

/** A machine's row: icon, NAME, a dashed rule, then its count and controls. */
export function machineHeader(u, t, id, name, right, color) {
  const c = color ?? t.working;
  return h_flex()
    .id(id)
    .flex_none()
    .h(u(24))
    .px(u(12))
    .gap(u(6))
    .items_center()
    .child(icon(name ? "server" : "monitor", u(12), c))
    .child(div().flex_none().text_color(c).child((name ?? "this machine").toUpperCase()))
    .child(div().flex_1().h(2).mx(u(2)).border_t(2).border_dashed().border_color(t.input))
    .when(Boolean(right), (el) => el.child(right));
}

/** A one-pixel box around text, in a color: [ WORK ▮▮▯ ]. */
export function pixelBox(u, color, content, o = {}) {
  return h_flex()
    .flex_none()
    .h(u(16))
    .px(u(4))
    .gap(u(4))
    .items_center()
    .border(u(1))
    .border_color(color)
    .text_color(color)
    .when(Boolean(o.bg), (el) => el.bg(o.bg))
    .when(Boolean(o.id), (el) => el.id(o.id))
    .children(Array.isArray(content) ? content : [content]);
}

/** A small square button: "+" and friends. */
export function iconButton(u, t, id, name, onClick, tooltip) {
  let b = div()
    .id(id)
    .flex_none()
    .w(u(16))
    .h(u(16))
    .flex()
    .items_center()
    .justify_center()
    .text_color(t.dim)
    .hover((s) => s.text_color(t.foreground).bg(t.hover))
    .on_mouse_down("left", (_e, cx) => cx.stop_propagation())
    .on_click((_e, cx) => {
      cx.stop_propagation();
      onClick(_e, cx);
    })
    .child(icon(name, u(10), undefined));
  if (tooltip) b = b.tooltip(tooltip);
  return b;
}

/** Herdr's own context menu (the shipped `menu` mod) for a space, tab or pane. */
export function contextMenu(tab, target) {
  openOverlay({ mod: "menu", kind: "popup", width: 200, height: 260, props: { tab, target } });
}
