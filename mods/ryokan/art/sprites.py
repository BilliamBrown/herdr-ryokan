#!/usr/bin/env python3
"""Ryokan's pixel art: agent avatars (img/avatar-*.svg) and tinted icons (icons/*.svg).

Each sprite is ASCII rows, one letter per pixel, drawn as 1x1 <rect>s with
crispEdges so GPUI scales them as hard pixels. Run from anywhere:

    python3 mods/ryokan/art/sprites.py [out dir, default: the mod folder]
"""
import os
import sys

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PALETTE = {
    "W": "#f2eee4",  # paper white
    "K": "#1b1c2a",  # sumi ink
    "R": "#e24b3a",  # shu vermilion
    "O": "#ff9e64",  # persimmon
    "Y": "#e8c15a",  # kin gold
    "G": "#7fb069",  # matcha
    "g": "#4f7a46",  # pine
    "B": "#7aa2f7",  # ai indigo (light)
    "b": "#3d5a99",  # indigo
    "P": "#f2a7c3",  # sakura pink
    "p": "#d9789c",  # deep pink
    "N": "#8a5a3a",  # wood
    "n": "#5a3a24",  # dark wood
    "S": "#a9b1d6",  # silver
    "D": "#565f89",  # stone grey
    "T": "#5fd1c7",  # teal
    "M": "#bb9af7",  # wisteria
}

# 16 x 16 each. "." is transparent (the scene shows through).
SPRITES = {
    "neko": [  # maneki-neko, the beckoning cat
        "..W..........W..",
        ".WWW........WWW.",
        ".WWWWWWWWWWWWWW.",
        ".WWWWWWWWWWWWWW.",
        ".WWKWWWWWWWWKWW.",
        ".WWWWWWPPWWWWWW.",
        ".WWWWWWWWWWWWWW.",
        "..WWRRRRRRRRWW..",
        "..WWWWWWWWWWWWWW",
        ".WWWWWWWWWWWWWWW",
        ".WWWWYYYYYYWWW..",
        ".WWWWYKKKKYWWW..",
        ".WWWWYYYYYYWWW..",
        "..WWWWWWWWWWWW..",
        "...WWWWWWWWWW...",
        "...WW......WW...",
    ],
    "daruma": [
        "......RRRR......",
        "....RRRRRRRR....",
        "...RRRRRRRRRR...",
        "..RRRRYYYYRRRR..",
        "..RRWWWWWWWWRR..",
        ".RRWWWWWWWWWWRR.",
        ".RRWKKWWWWKKWRR.",
        ".RRWKKWWWWKKWRR.",
        ".RRWWWWWWWWWWRR.",
        ".RRRWWWKKWWWRRR.",
        ".RRRRWWWWWWRRRR.",
        ".RRRRRRYYRRRRRR.",
        ".RRRRRYYYYRRRRR.",
        "..RRRRRRRRRRRR..",
        "..RRRRRRRRRRRR..",
        "...RRRRRRRRRR...",
    ],
    "koi": [
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        ".O......OOOO....",
        ".OO...OOOOOOOO..",
        ".OOO.OOWWOOOOOO.",
        ".OOOOOWWWOOOOKO.",
        ".OOOOOOWWOOOOOO.",
        ".OOO.OOOOWWOOO..",
        ".OO...OOOOOOO...",
        ".O......OOO.....",
    ],
    "onigiri": [
        ".......WW.......",
        "......WWWW......",
        ".....WWWWWW.....",
        "....WWWWWWWW....",
        "...WWWWWWWWWW...",
        "...WWWKWWKWWW...",
        "..WWWWWWWWWWWW..",
        "..WWWWWPPWWWWW..",
        ".WWWWWWWWWWWWWW.",
        ".WWWWWWWWWWWWWW.",
        "WWWWWKKKKKKWWWWW",
        "WWWWWKKKKKKWWWWW",
        "WWWWWKKKKKKWWWWW",
        ".....KKKKKK.....",
        "................",
        "................",
    ],
    "kitsune": [  # fox mask
        ".W............W.",
        ".WW..........WW.",
        ".WWW........WWW.",
        ".WWWW......WWWW.",
        ".WWWWWWWWWWWWWW.",
        ".WWRWWWWWWWWRWW.",
        ".WWWKKWWWWKKWWW.",
        "..WWWKWWWWKWWW..",
        "..WWWWWWWWWWWW..",
        "...WWRWWWWRWW...",
        "...WWWWWWWWWW...",
        "....WWWKKWWW....",
        ".....WWWWWW.....",
        "......WWWW......",
        ".......WW.......",
        "................",
    ],
    "chochin": [  # paper lantern
        "......nnnn......",
        ".......nn.......",
        "....NNNNNNNN....",
        "...RRRRRRRRRR...",
        "..RRRRRRRRRRRR..",
        ".RRRRRRRRRRRRRR.",
        ".RRRRKKKKKKRRRR.",
        ".RRRRKRRRRKRRRR.",
        ".RRRRKKKKKKRRRR.",
        ".RRRRRRRRRRRRRR.",
        "..RRRRRRRRRRRR..",
        "...RRRRRRRRRR...",
        "....NNNNNNNN....",
        ".......nn.......",
        "......YYYY......",
        ".......YY.......",
    ],
    "fuji": [
        "...........YYY..",
        "..........YYYYY.",
        "..........YYYYY.",
        "......WW...YYY..",
        ".....WWWW.......",
        "....WWWWWW......",
        "...WWbWWbWW.....",
        "...bbbbbbbb.....",
        "..bbbbbbbbbb....",
        ".bbbbbbbbbbbb...",
        "bbbbbbbbbbbbbb..",
        "bbbbbbbbbbbbbbb.",
        "................",
        "................",
        "................",
        "................",
    ],
    "torii": [
        "................",
        "RRRRRRRRRRRRRRRR",
        ".RRRRRRRRRRRRRR.",
        "...RR......RR...",
        "..RRRRRRRRRRRR..",
        "...RR......RR...",
        "...RR......RR...",
        "...RR......RR...",
        "...RR......RR...",
        "...RR......RR...",
        "...RR......RR...",
        "...RR......RR...",
        "...RR......RR...",
        "..RRRR....RRRR..",
        "................",
        "................",
    ],
    "kappa": [
        ".....YYYYYY.....",
        "....GGGGGGGG....",
        "...GGGGGGGGGG...",
        "...GGKGGGGKGG...",
        "...GGGGGGGGGG...",
        "....GGYYYYGG....",
        ".....GGGGGG.....",
        "...GGGGGGGGGG...",
        "..GGGNNNNNNGGG..",
        "..GGGNnNNnNGGG..",
        "..GGGNNNNNNGGG..",
        "...GGGGGGGGGG...",
        "....GG....GG....",
        "................",
        "................",
        "................",
    ],
    "sakura": [
        "....PP....PP....",
        "...PPPP..PPPP...",
        "...PPPPPPPPPP...",
        "....PPPPPPPP....",
        ".PPPPPPYYPPPPPP.",
        "PPPPPPYYYYPPPPPP",
        "PPPPPPYYYYPPPPPP",
        ".PPPPPPYYPPPPPP.",
        "...PPPPPPPPPP...",
        "...PPPPP.PPPP...",
        "....PPP...PPP...",
        ".....P.....P....",
        "................",
        "................",
        "................",
        "................",
    ],
    "matcha": [  # a tea bowl
        "................",
        "......W.W.......",
        ".....W.W........",
        "................",
        "..DDDDDDDDDDDD..",
        ".DDGGGGGGGGGGDD.",
        ".DDDDDDDDDDDDDD.",
        ".DDDDDDDDDDDDDD.",
        "..DDDDDDDDDDDD..",
        "...DDDDDDDDDD...",
        "....DDDDDDDD....",
        "......DDDD......",
        "................",
        "................",
        "................",
        "................",
    ],
    "tanuki": [
        "................",
        "..NN........NN..",
        ".NNNN......NNNN.",
        ".NNNNNNNNNNNNNN.",
        ".NNNNNNNNNNNNNN.",
        ".NnnKnNNNNnKnnN.",
        ".NnnnnNNNNnnnnN.",
        ".NNNNNNWWNNNNNN.",
        "..NNNNWKKWNNNN..",
        "...NNNWWWWNNN...",
        "...NNNNNNNNNN...",
        "..NNWWWWWWWWNN..",
        "..NNWWWWWWWWNN..",
        "...NNWWWWWWNN...",
        "....NN....NN....",
        "................",
    ],
}

# Which ground each one stands on.
GROUND = {"koi": "water", "kappa": "water"}

# The scene: 28 x 22 cells. Sky, a few stars, a moon, then the ground.
SCENE_W, SCENE_H = 28, 22
SKY = "#1c2040"
STAR = "#3c4a7a"
STAR_BRIGHT = "#8a98c8"
MOON = "#e8c15a"
STARS = [(2, 2), (9, 1), (15, 4), (24, 3), (5, 8), (26, 9), (12, 12), (20, 1), (1, 14), (25, 15)]
BRIGHT = {(9, 1), (24, 3), (12, 12)}
MOON_PX = [(21, 1), (22, 1), (21, 2), (20, 2), (20, 3), (21, 3), (22, 4), (21, 4)]
GROUNDS = {
    "dusk": {"rows": ["#3b2a5a", "#5a3f7a", "#3b2a5a"], "dots": "#7a5a9a", "dot_cols": (3, 9, 14, 20, 26)},
    "water": {"rows": ["#2a4c7a", "#22406a", "#1c355a"], "dots": "#7aa2f7", "dot_cols": (1, 5, 8, 12, 16, 19, 23, 26)},
}


def rect(x, y, c, w=1, h=1):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"/>'


def scene_svg(name, rows):
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SCENE_W} {SCENE_H}" shape-rendering="crispEdges">']
    out.append(rect(0, 0, SKY, SCENE_W, SCENE_H))
    for (x, y) in STARS:
        out.append(rect(x, y, STAR_BRIGHT if (x, y) in BRIGHT else STAR))
    for (x, y) in MOON_PX:
        out.append(rect(x, y, MOON))
    g = GROUNDS[GROUND.get(name, "dusk")]
    base = SCENE_H - len(g["rows"])
    for i, c in enumerate(g["rows"]):
        out.append(rect(0, base + i, c, SCENE_W, 1))
    for x in g["dot_cols"]:
        out.append(rect(x, base, g["dots"]))
    # The sprite stands on the ground, centered.
    ox, oy = (SCENE_W - 16) // 2, base - 16
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch != ".":
                out.append(rect(ox + x, oy + y, PALETTE[ch]))
    out.append("</svg>")
    return "\n".join(out)


# Tinted icons (one color, drawn with currentColor so svg() colors them). 12 x 12.
ICONS = {
    "shoji": [  # a sliding paper screen
        "############",
        "#..#..#..#.#",
        "#..#..#..#.#",
        "############",
        "#..#..#..#.#",
        "#..#..#..#.#",
        "############",
        "#..#..#..#.#",
        "#..#..#..#.#",
        "############",
        "............",
        "............",
    ],
    "monitor": [
        "............",
        "############",
        "#..........#",
        "#..........#",
        "#..........#",
        "#..........#",
        "#..........#",
        "############",
        ".....##.....",
        ".....##.....",
        "...######...",
        "............",
    ],
    "server": [
        "............",
        "############",
        "#........#.#",
        "############",
        "............",
        "############",
        "#........#.#",
        "############",
        "............",
        "############",
        "#........#.#",
        "############",
    ],
    "plus": [
        "............",
        "............",
        ".....##.....",
        ".....##.....",
        ".....##.....",
        "..########..",
        "..########..",
        ".....##.....",
        ".....##.....",
        ".....##.....",
        "............",
        "............",
    ],
    "lantern": [
        ".....##.....",
        "....####....",
        "..########..",
        ".##########.",
        ".##########.",
        ".##########.",
        ".##########.",
        ".##########.",
        "..########..",
        "....####....",
        ".....##.....",
        ".....##.....",
    ],
    "guest": [  # a person
        "....####....",
        "...######...",
        "...######...",
        "....####....",
        ".....##.....",
        "..########..",
        ".##########.",
        ".##########.",
        ".##.####.##.",
        ".##.####.##.",
        "....#..#....",
        "....#..#....",
    ],
    "zzz": [
        "............",
        ".......####.",
        "........##..",
        ".......##...",
        ".......####.",
        "............",
        "..#####.....",
        ".....##.....",
        "....##......",
        "...##.......",
        "..#####.....",
        "............",
    ],
    "bang": [
        "............",
        ".....##.....",
        ".....##.....",
        ".....##.....",
        ".....##.....",
        ".....##.....",
        ".....##.....",
        "............",
        "............",
        ".....##.....",
        ".....##.....",
        "............",
    ],
    "check": [
        "............",
        "............",
        "..........#.",
        ".........##.",
        "........##..",
        ".......##...",
        ".##...##....",
        "..##.##.....",
        "...###......",
        "....#.......",
        "............",
        "............",
    ],
}


def icon_svg(rows):
    out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" shape-rendering="crispEdges">']
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch == "#":
                out.append(f'<rect x="{x}" y="{y}" width="1" height="1"/>')
    out.append("</svg>")
    return "\n".join(out)


def main():
    img = os.path.join(OUT, "img")
    icons = os.path.join(OUT, "icons")
    os.makedirs(img, exist_ok=True)
    os.makedirs(icons, exist_ok=True)
    for name, rows in SPRITES.items():
        assert len(rows) == 16 and all(len(r) == 16 for r in rows), name
        with open(os.path.join(img, f"avatar-{name}.svg"), "w") as f:
            f.write(scene_svg(name, rows))
    for name, rows in ICONS.items():
        assert len(rows) == 12 and all(len(r) == 12 for r in rows), name
        with open(os.path.join(icons, f"{name}.svg"), "w") as f:
            f.write(icon_svg(rows))
    print(f"{len(SPRITES)} avatars, {len(ICONS)} icons -> {OUT}")


if __name__ == "__main__":
    main()
