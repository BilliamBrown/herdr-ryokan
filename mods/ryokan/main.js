// Ryokan: a pixel-art sidebar for Herdr's main layout, in two roles.
// The layout gives each copy props { role }:
//   spaces   spaces grouped by machine, with status lanterns
//   agents   agents as pixel guest cards with Japanese avatars
// Everything else (tabs, pane headers, Files, Changes, the status bar) is
// Herdr's own, themed by themes/ryokan.json.

import { View, div } from "gpui-kit";
import { props } from "herdr";
import Spaces from "./spaces.js";
import Agents from "./agents.js";

const ROLES = { spaces: Spaces, agents: Agents };

export default class Ryokan extends View {
  init(p, cx) {
    const pr = props() ?? p ?? {};
    const R = ROLES[pr.role];
    this.role = R ? new R() : null;
    this.role?.init?.(pr, cx);
  }

  render(cx) {
    if (!this.role) return div().p(10).child(`ryokan: no role "${props()?.role}" (use spaces or agents)`);
    return this.role.render(cx);
  }
}
