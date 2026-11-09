// Spaces, grouped by machine: a header per machine (this one first), each
// space as a row. The shown space has a bar on its left; a space with agents
// shows a lantern block on the right in its status color (pulsing while
// working). Click: show it. Right-click: Herdr's space menu. "+" starts a
// space on that machine.

import { div } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { spaces, machines, run, theme } from "herdr";
import { unit, root, sectionHeader, machineHeader, iconButton, contextMenu, statusColor } from "./kit.js";

export default class Spaces {
  init() {}

  row(u, t, s) {
    const color = s.status ? statusColor(t, s.status) : null;
    return h_flex()
      .id(`sp-${s.id}`)
      .flex_none()
      .h(u(22))
      .ml(u(10))
      .mr(u(8))
      .pr(u(6))
      .gap(u(8))
      .items_center()
      .bg(s.active ? t.selected : "#00000000")
      .hover((st) => st.bg(s.active ? t.selected : t.hover))
      .on_click(() => run("space.select", { id: s.id }))
      .on_mouse_down("right", (_e, cx) => {
        cx.stop_propagation();
        contextMenu("space", { id: s.id });
      })
      .child(div().flex_none().w(u(3)).h_full().bg(s.active ? t.working : "#00000000"))
      .child(div().flex_1().min_w(0).truncate().text_color(s.active ? t.foreground : t.muted).child(s.name))
      .when(Boolean(s.branch) && !s.named, (el) => el.child(div().flex_none().max_w(u(70)).truncate().text_color(t.dim).child(s.branch)))
      .when(Boolean(color), (el) =>
        el.child(
          div()
            .flex_none()
            .w(u(6))
            .h(u(12))
            .bg(color)
            .when(s.status === "working", (b) => b.loop("opacity", { from: 0.35, to: 1, period: 1100 }))
            .when(s.status === "blocked", (b) => b.loop("opacity", { from: 0.2, to: 1, period: 500 })),
        ),
      );
  }

  render(_cx) {
    const u = unit();
    const t = theme();
    const all = spaces();
    const groups = [];
    const seen = new Set();
    for (const m of machines()) {
      const name = m.name ?? null;
      seen.add(name);
      groups.push({ name, layout: m.layout, members: all.filter((s) => (s.machine ?? null) === name) });
    }
    for (const s of all) if (!seen.has(s.machine ?? null)) { seen.add(s.machine ?? null); groups.push({ name: s.machine, layout: "ready", members: all.filter((x) => x.machine === s.machine) }); }

    const list = v_flex().id("ryokan-spaces").flex_1().min_h(0).overflow_y_scroll().pb(u(6));
    for (const g of groups) {
      const count = div().flex_none().text_color(t.dim).child(g.layout === "ready" ? String(g.members.length) : g.layout === "loading" ? "…" : "offline");
      const add = iconButton(u, t, `sp-add-${g.name ?? "local"}`, "plus", () => run("space.new", { machine: g.name ?? "" }), "New space here");
      list.child(machineHeader(u, t, `mh-${g.name ?? "local"}`, g.name, h_flex().gap(u(6)).items_center().child(count).child(add), g.name ? t.accent : t.working));
      for (const s of g.members) list.child(this.row(u, t, s));
    }

    return root(
      u,
      v_flex()
        .size_full()
        .pt(u(4))
        .child(sectionHeader(u, t, "間", "SPACES", iconButton(u, t, "sp-add", "plus", () => run("space.new"), "New space")))
        .child(list),
    );
  }
}
