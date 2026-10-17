"""Render the Whoa Jobs social banners (Patient Optics).

uv run --no-project --with pillow python deploy/branding/banners/render.py

One drawing, laid out per format: the headline on the left, a survey plate on the right where
the Jumelles mark, solid as in the logo, looks up and to the right at a patch of the field and
finds a few marks in orange. Every count in
the captions is counted from the drawing itself.
"""

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent
CANVAS_FONTS = Path.home() / '.claude/skills/canvas-design/canvas-fonts'
DM_SANS = Path.home() / 'Library/Fonts/DMSans[opsz,wght].ttf'

SS = 4  # supersampling
DENSITY = 2  # exported at 2x

PAPER = (250, 248, 245)
INK = (22, 19, 15)
ORANGE = (242, 84, 27)

HEADLINE = 'Stop refreshing job boards.'
SUB = 'Work-study and full-time offers from every board, in one dashboard.'


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


class Theme:
    def __init__(self, ground, ink):
        self.ground, self.ink = ground, ink
        self.mid = mix(ground, ink, 0.62)
        self.faint = mix(ground, ink, 0.32)
        self.hair = mix(ground, ink, 0.22)
        self.fog = mix(ground, ink, 0.13)


LIGHT = Theme(PAPER, INK)
DARK = Theme((20, 18, 15), PAPER)

_fonts: dict = {}


def font(kind, size):
    key = (kind, size)
    if key not in _fonts:
        if kind == 'mono':
            f = ImageFont.truetype(str(CANVAS_FONTS / 'DMMono-Regular.ttf'), round(size * SS))
        else:
            f = ImageFont.truetype(str(DM_SANS), round(size * SS))
            # Axis order in the file is opsz, wght
            f.set_variation_by_axes([min(40, max(9, size)), 600 if kind == 'display' else 400])
        _fonts[key] = f
    return _fonts[key]


class Canvas:
    def __init__(self, w, h, theme):
        self.w, self.h, self.t = w, h, theme
        self.img = Image.new('RGB', (w * SS, h * SS), theme.ground)
        self.d = ImageDraw.Draw(self.img)

    @staticmethod
    def p(v):
        return round(v * SS)

    def line(self, x1, y1, x2, y2, color, w=0.75):
        self.d.line([(self.p(x1), self.p(y1)), (self.p(x2), self.p(y2))], fill=color,
                    width=max(1, self.p(w)))

    def circle(self, cx, cy, r, fill=None, outline=None, w=0.75):
        box = [self.p(cx - r), self.p(cy - r), self.p(cx + r), self.p(cy + r)]
        self.d.ellipse(box, fill=fill, outline=outline, width=max(1, self.p(w)) if outline else 0)

    def width(self, s, kind, size, tracking=0.0):
        return self.d.textlength(s, font=font(kind, size)) / SS + tracking * max(0, len(s) - 1)

    def text(self, x, y, s, kind, size, fill, tracking=0.0, align='left'):
        """Baseline-anchored text with tracking in px. Returns the x where it ends."""
        w = self.width(s, kind, size, tracking)
        x = {'left': x, 'right': x - w, 'center': x - w / 2}[align]
        if not tracking:
            self.d.text((self.p(x), self.p(y)), s, font=font(kind, size), fill=fill, anchor='ls')
            return x + w
        cx = x
        for ch in s:
            self.d.text((self.p(cx), self.p(y)), ch, font=font(kind, size), fill=fill, anchor='ls')
            cx += self.width(ch, kind, size) + tracking
        return x + w

    def mono(self, x, y, s, size, fill=None, align='left'):
        return self.text(x, y, s.upper(), 'mono', size, fill or self.t.mid,
                         tracking=size * 0.16, align=align)

    def headline(self, x, y, lines, size, leading=1.0):
        # Tight tracking as on the landing (about -0.04em)
        for i, ln in enumerate(lines):
            self.text(x, y + i * size * leading, ln, 'display', size, self.t.ink,
                      tracking=-0.04 * size)

    def symbol(self, cx, cy, size, color):
        """The Jumelles mark, from its 256u construction."""
        u = size / 256
        for ox in (-46, 46):
            self.circle(cx + ox * u, cy, 62 * u, fill=color)
        for ox in (-34, 58):
            self.circle(cx + ox * u, cy - 12 * u, 22 * u, fill=self.t.ground)

    def lockup(self, x, cy, height):
        """Symbol and name, spaced like the master lockup (gap = one pupil)."""
        sym_w = height * 216 / 124
        self.symbol(x + sym_w / 2, cy, height * 256 / 124, self.t.ink)
        size = height * 1.26
        self.text(x + sym_w + height * 44 / 124, cy + height * 0.31, 'whoa jobs', 'display',
                  size, self.t.ink, tracking=-0.025 * size)

    def corners(self, x0, y0, x1, y1, arm=10, w=1.1):
        for cx, cy, sx, sy in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
            self.line(cx, cy, cx + arm * sx, cy, self.t.ink, w)
            self.line(cx, cy, cx, cy + arm * sy, self.t.ink, w)

    def save(self, path):
        out = self.img.resize((self.w * DENSITY, self.h * DENSITY), Image.LANCZOS)
        out.save(path, optimize=True)


def plate(c, x0, y0, x1, y1, lens_cx, lens_cy, r, step, seed=1655, finds=9, captions=True,
          ruler=True, cap_size=7.5):
    """A survey plate: hairline frame, corners, ruler, field of marks, the mark and its finds."""
    t = c.t
    c.line(x0, y0, x1, y0, t.hair)
    c.line(x0, y1, x1, y1, t.hair)
    c.line(x0, y0, x0, y1, t.hair)
    c.line(x1, y0, x1, y1, t.hair)
    c.corners(x0, y0, x1, y1, arm=min(10, (y1 - y0) / 8))

    if ruler:
        for k in range(0, int(x1 - x0) + 1, 8):
            if 14 <= k <= x1 - x0 - 14:
                major = k % 80 == 0
                c.line(x0 + k, y0, x0 + k, y0 + (6 if major else 3), t.faint if major else t.hair, 0.6)

    # The mark itself, solid as in the logo, a little left of centre so its gaze has room
    r *= 0.78  # the mark is solid now: smaller than the lens it replaces, or it shouts
    u = r / 62
    mx, my = lens_cx - 0.5 * r, lens_cy + 0.18 * r
    eyes = [(mx - 46 * u, my), (mx + 46 * u, my)]
    # Where it looks: up and to the right, along the pupils' offset (+12, -12)
    gaze = (mx + 2.55 * r, my - 1.15 * r)
    gaze = (min(gaze[0], x1 - 1.0 * r), max(gaze[1], y0 + 0.75 * r))
    focus = 0.7 * r

    def near_mark(px, py):
        return any(math.dist((px, py), e) <= r + max(5.0, 22 * u) for e in eyes)

    rnd = random.Random(seed)
    field = []
    jitter = step * 0.36
    pad = max(10, step * 1.4)
    y = y0 + pad + (8 if ruler else 0)
    while y < y1 - pad:
        x = x0 + pad
        while x < x1 - pad:
            px, py = x + rnd.uniform(-jitter, jitter), y + rnd.uniform(-jitter, jitter)
            if not near_mark(px, py):
                field.append((px, py))
            x += step
        y += step

    dot = max(0.7, step * 0.1)
    looked = [i for i, p in enumerate(field) if math.dist(p, gaze) <= focus]
    weights = [math.exp(-math.dist(field[i], gaze) / (0.35 * r)) for i in looked]
    found = set()
    while len(found) < min(finds, len(looked)):
        found.add(rnd.choices(looked, weights=weights)[0])
    looked_set = set(looked)
    for i, (px, py) in enumerate(field):
        if i in found:
            continue
        if i in looked_set:
            c.circle(px, py, dot * 1.3, fill=t.ink)
        else:
            c.circle(px, py, dot, fill=t.fog)
    for i in found:
        c.circle(*field[i], dot * 2.2, fill=ORANGE)

    c.symbol(mx, my, r * 256 / 62, t.ink)

    total = len(field)
    if captions:
        cy = y1 + cap_size * 2.2
        c.mono(x0, cy, 'Fig. 1, survey', cap_size, t.faint)
        c.mono(x1, cy, f'N = {total:,}'.replace(',', ' ') + f' · {len(looked)} in view · {len(found)} found',
               cap_size, t.faint, align='right')
    return total, len(looked), len(found)


def fit(c, lines, max_w, size):
    while max(c.width(ln, 'display', size, -0.04 * size) for ln in lines) > max_w:
        size -= 1
    return size


def sub_lines(c, text, max_w, size):
    words, lines, cur = text.split(), [], ''
    for w in words:
        nxt = f'{cur} {w}'.strip()
        if cur and c.width(nxt, 'body', size) > max_w:
            lines.append(cur)
            cur = w
        else:
            cur = nxt
    return lines + [cur]


# ---------- formats ----------


def github_readme(theme, name):
    W, H = 1280, 320
    c = Canvas(W, H, theme)
    c.lockup(56, 62, 22)
    lines = ['Stop refreshing', 'job boards.']
    size = fit(c, lines, 520, 64)
    c.headline(52, 168, lines, size, 0.98)
    c.mono(56, 270, 'Work-study · full-time · one dashboard', 9.5)
    plate(c, 640, 32, 1232, 272, 952, 140, 74, 9, cap_size=7)
    c.save(HERE / name)


def github_social(theme, name):
    W, H = 1280, 640
    c = Canvas(W, H, theme)
    c.lockup(88, 104, 30)
    lines = ['Stop refreshing', 'job boards.']
    size = fit(c, lines, 520, 96)
    c.headline(82, 300, lines, size, 0.98)
    for i, ln in enumerate(sub_lines(c, SUB, 440, 21)):
        c.text(88, 438 + i * 30, ln, 'body', 21, theme.mid)
    c.mono(88, 552, 'Work-study · full-time · one dashboard', 9.5, theme.faint)
    plate(c, 680, 72, 1200, 540, 960, 268, 110, 12, cap_size=8)
    c.save(HERE / name)


def open_graph(theme, name):
    W, H = 1200, 630
    c = Canvas(W, H, theme)
    c.lockup(80, 100, 30)
    lines = ['Stop refreshing', 'job boards.']
    size = fit(c, lines, 500, 92)
    c.headline(74, 292, lines, size, 0.98)
    for i, ln in enumerate(sub_lines(c, SUB, 420, 21)):
        c.text(80, 426 + i * 30, ln, 'body', 21, theme.mid)
    plate(c, 640, 72, 1128, 534, 888, 264, 104, 12, cap_size=8)
    c.save(HERE / name)


def x_header(theme, name):
    # The avatar covers the bottom-left corner and phones crop top and bottom: keep the middle
    W, H = 1500, 500
    c = Canvas(W, H, theme)
    lines = ['Stop refreshing', 'job boards.']
    size = fit(c, lines, 560, 92)
    c.headline(112, 200, lines, size, 0.98)
    for i, ln in enumerate(sub_lines(c, SUB, 470, 20)):
        c.text(118, 356 + i * 29, ln, 'body', 20, theme.mid)
    plate(c, 820, 72, 1404, 404, 1124, 226, 96, 11, cap_size=8)
    c.save(HERE / name)


def linkedin_company(theme, name):
    # The page logo overlaps the bottom-left corner
    W, H = 1128, 191
    c = Canvas(W, H, theme)
    c.lockup(48, 44, 16)
    size = fit(c, [HEADLINE], 470, 40)
    c.headline(44, 112, [HEADLINE], size)
    c.mono(48, 140, 'Work-study · full-time · one dashboard', 8)
    plate(c, 600, 18, 1092, 160, 862, 86, 42, 7, finds=7, ruler=False, cap_size=6.5)
    c.save(HERE / name)


def linkedin_profile(theme, name):
    # The profile photo covers most of the bottom-left third
    W, H = 1584, 396
    c = Canvas(W, H, theme)
    c.lockup(480, 92, 20)
    lines = ['Stop refreshing', 'job boards.']
    size = fit(c, lines, 440, 70)
    c.headline(476, 198, lines, size, 0.98)
    c.mono(480, 310, 'Work-study · full-time · one dashboard', 9)
    plate(c, 1000, 44, 1536, 330, 1272, 176, 86, 10, cap_size=7.5)
    c.save(HERE / name)


if __name__ == '__main__':
    github_readme(LIGHT, 'github-readme-light.png')
    github_readme(DARK, 'github-readme-dark.png')
    github_social(LIGHT, 'github-social-preview.png')
    open_graph(LIGHT, 'open-graph.png')
    x_header(LIGHT, 'x-header.png')
    linkedin_company(LIGHT, 'linkedin-company-cover.png')
    linkedin_profile(LIGHT, 'linkedin-profile-cover.png')
