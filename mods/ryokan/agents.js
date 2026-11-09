// Agents as pixel guest cards, grouped by machine. Each card: a pixel
// avatar in a night scene (bobbing while the agent works, a "z" while idle,
// a blinking "!" when it needs you, a check when done), a status box
// 「作 WORK ▮▮▯」, the space's name, the agent's title and its tab.
// Click: focus its pane (peek at a sub-agent without one). Right-click:
// Herdr's pane menu. Agent order (cmd-] / cmd-[) follows the cards.

import { div, image } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { agents, spaces, panes, run, theme, setAgentOrder } from "herdr";
import { unit, root, icon, sectionHeader, machineHeader, pixelBox, contextMenu, statusColor, STATUS } from "./kit.js";
import { assign, avatarPath } from "./avatars.js";

const BAR = ["▮▯▯", "▮▮▯", "▮▮▮", "▯▮▮", "▯▯▮", "▯▯▯"];

export default class Agents {
  init() {}

  badge(u, t, a) {
    const s = STATUS[a.status] ?? STATUS.idle;
    const c = statusColor(t, a.status);
    const parts = [div().child(s.kanji), div().child(s.word)];
    if (a.status === "working") parts.push(div().frames(BAR, 220));
    return pixelBox(u, c, parts, { bg: a.status === "working" ? c + "1f" : undefined });
  }

  avatar(u, t, a, face) {
    const w = u(98), h = u(77);
    let pic = image(avatarPath(face)).absolute().left(0).top(0).w(w).h(h);
    if (a.status === "working") pic = pic.loop("top", { from: 0, to: u(-3), period: 650 });
    const mark = (name, color, blink) =>
      div()
        .absolute()
        .right(u(3))
        .top(u(3))
        .w(u(14))
        .h(u(14))
        .flex()
        .items_center()
        .justify_center()
        .bg(t.canvas)
        .border(u(1))
        .border_color(color)
        .when(blink, (el) => el.loop("opacity", { from: 0.2, to: 1, period: 500 }))
        .child(icon(name, u(10), color));
    return div()
      .relative()
      .flex_none()
      .w(w)
      .h(h)
      .border(u(1))
      .border_color(t.input)
      .child(pic)
      .when(a.status === "idle", (el) => el.child(mark("zzz", t.muted, false)))
      .when(a.status === "blocked", (el) => el.child(mark("bang", t.blocked, true)))
      .when(a.status === "done", (el) => el.child(mark("check", t.done, false)));
  }

  card(u, t, a, face, listed) {
    const space = spaces().find((s) => s.id === a.space);
    const title = (a.title ?? "").trim();
    const program = a.program?.name ?? "agent";
    const frame = a.focused ? t.accent : a.status === "working" ? t.working : a.status === "blocked" ? t.blocked : t.border;
    const open = () => (listed ? run("pane.focus", { pane: a.pane }) : run("terminal.peek", { terminal: a.address }));
    return h_flex()
      .id(`ag-${a.address}`)
      .flex_none()
      .mx(u(10))
      .p(u(6))
      .gap(u(8))
      .items_start()
      .bg(t.raised)
      .border(u(1))
      .border_color(frame)
      .hover((s) => s.bg(t.hover))
      .on_click(open)
      .on_mouse_down("right", (_e, cx) => {
        cx.stop_propagation();
        contextMenu("pane", { pane: a.pane, terminal: a.address });
      })
      .child(this.avatar(u, t, a, face))
      .child(
        v_flex()
          .flex_1()
          .min_w(0)
          .gap(u(5))
          .child(h_flex().gap(u(6)).items_center().child(this.badge(u, t, a)).when(a.pinned, (el) => el.child(div().text_color(t.dim).child("留"))))
          .child(div().w_full().truncate().text_color(t.foreground).font_weight(700).text_size(u(13)).child(space?.name ?? a.space_name ?? program))
          .child(div().w_full().truncate().text_color(t.muted).child(title && title !== program ? title : program))
          .child(h_flex().gap(u(6)).text_color(t.dim).child(div().truncate().child(`tab ${a.tab_name}`)).when(Boolean(space?.branch), (el) => el.child(div().truncate().child(`· ${space.branch}`)))),
      );
  }

  render(_cx) {
    const u = unit();
    const t = theme();
    const list = agents();
    const listed = new Set(panes().map((p) => p.pane));
    const faces = assign(list.map((a) => a.address));
    const byMachine = new Map();
    for (const a of list) {
      const m = spaces().find((s) => s.id === a.space)?.machine ?? null;
      if (!byMachine.has(m)) byMachine.set(m, []);
      byMachine.get(m).push(a);
    }
    // Local first, then machines by name; inside, needs-you first, then working, done, idle.
    const rank = { blocked: 0, working: 1, done: 2, idle: 3 };
    const groups = [...byMachine.entries()].sort((x, y) => (x[0] === null ? -1 : y[0] === null ? 1 : x[0].localeCompare(y[0])));
    const order = [];
    const body = v_flex().id("ryokan-agents").flex_1().min_h(0).overflow_y_scroll().gap(u(6)).pb(u(8));
    for (const [m, members] of groups) {
      members.sort((x, y) => (x.pinned === y.pinned ? (rank[x.status] ?? 9) - (rank[y.status] ?? 9) || y.seq - x.seq : x.pinned ? -1 : 1));
      const busy = members.filter((a) => a.status === "working" || a.status === "blocked").length;
      body.child(machineHeader(u, t, `ah-${m ?? "local"}`, m, div().text_color(t.dim).child(`${busy}/${members.length}`), m ? t.accent : t.working));
      for (const a of members) {
        order.push(a.address);
        body.child(this.card(u, t, a, faces.get(a.address), listed.has(a.pane)));
      }
    }
    setAgentOrder(order);
    const busy = list.filter((a) => a.status === "working").length;
    const needs = list.filter((a) => a.status === "blocked").length;
    const right = h_flex()
      .gap(u(8))
      .when(needs > 0, (el) => el.child(div().text_color(t.blocked).child(`${needs} NEEDS YOU`)))
      .child(div().text_color(busy ? t.working : t.dim).child(`${busy} BUSY`));
    return root(
      u,
      v_flex()
        .size_full()
        .pt(u(4))
        .child(sectionHeader(u, t, "客", "AGENTS", right))
        .when(list.length === 0, (el) => el.child(div().px(u(12)).pt(u(8)).text_color(t.dim).child("No guests yet. Start an agent from the + menu.")))
        .child(body),
    );
  }
}
