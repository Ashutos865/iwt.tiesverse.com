"""
Generate square illustrated portraits for the dummy speakers.

Drawn rather than photographed on purpose: a stock photo of a real stranger on
a card headed "speaker" makes a claim about that person, while a drawing makes
none. These are flat-colour portraits in the artwork's ridge ink (#2F538B) over
its cream (#FAEDDC), so a card with a portrait still looks cut from the same
plate as the hero drawing. A real headshot replaces one with no layout change —
the card crops whatever it is given to a circle.

Everything is seeded from the speaker's own slug, so a given person always
draws the same face. A first attempt varied only build and a faint collar and
rendered as one silhouette repeated eight times; what actually reads at card
size is the FACE — skin and hair tone, hairstyle, glasses, beard — so that is
what varies here.
"""
import hashlib
import pathlib

INK = '#2F538B'      # artwork ridge ink — jacket, glasses
INK_2 = '#41659B'    # artwork's lighter hatching — shirt
CREAM = '#FAEDDC'    # artwork sky — background
# Square, because the card crops the portrait to a circle. A 4:5 frame threw
# away the corners and left the head at ~33% of the visible width, reading as a
# small face adrift in cream. Composed square, the head fills the circle.
W, H = 520, 520

# Warm mid-tones that stay legible against both the cream ground and the ink
# jacket. Not naturalistic — this is a drawing, and a limited palette keeps the
# eight cards reading as one set.
SKINS = ['#E8B98A', '#D9A273', '#C78B5E', '#B0714A', '#8E5636', '#EFC79C']
HAIRS = ['#1B2A45', '#2F2016', '#4A3220', '#141C2E', '#5A4632', '#0E1F3D']


def seeded(seed, salt):
    d = hashlib.sha256('{}:{}'.format(seed, salt).encode()).digest()
    return int.from_bytes(d[:4], 'big') / 0xFFFFFFFF


def portrait(name, feminine):
    def r(salt, lo, hi):
        return lo + seeded(name, salt) * (hi - lo)

    def pick(salt, seq):
        return seq[int(seeded(name, salt) * len(seq)) % len(seq)]

    skin = pick('skin', SKINS)
    hair = pick('hair', HAIRS)
    cx = W / 2
    # Sized so the head fills roughly half the circular crop, and centred a
    # little above the middle so the shoulders still read beneath it.
    head_r = r('head', 118, 130)
    head_cy = r('cy', 214, 226)
    jaw = head_r * r('jaw', 1.02, 1.16)          # chin length below centre
    glasses = seeded(name, 'glass') > 0.55
    beard = (not feminine) and seeded(name, 'beard') > 0.45
    long_hair = feminine and seeded(name, 'long') > 0.3

    sh_half = r('shoulder', 210, 246)
    sh_y = head_cy + jaw + r('shy', 62, 78)
    p = []

    # --- background: faint hatching, echoing the hero drawing ---
    p.append('<rect width="{}" height="{}" fill="{}"/>'.format(W, H, CREAM))
    for f in (0.26, 0.36, 0.46):
        p.append('<path d="M 0 {:.0f} L {} {:.0f}" stroke="{}" stroke-width="1.5" '
                 'opacity="0.10"/>'.format(H * f, W, H * f - 16, INK))
    p.append('<circle cx="{:.0f}" cy="{:.0f}" r="{:.0f}" fill="#FFFFFF" '
             'opacity="0.35"/>'.format(cx, head_cy, head_r * 1.42))

    # --- long hair sits BEHIND the shoulders ---
    if long_hair:
        spread = head_r * r('spread', 1.28, 1.52)
        drop = r('hdrop', 150, 210)
        p.append(
            '<path d="M {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'L {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'A {:.0f} {:.0f} 0 0 0 {:.0f} {:.0f} Z" fill="{}"/>'.format(
                cx - spread, head_cy,
                cx - spread, head_cy + drop, cx - spread * 0.8, head_cy + drop,
                cx - head_r * 0.75, head_cy + drop,
                cx + head_r * 0.75, head_cy + drop,
                cx + spread * 0.8, head_cy + drop, cx + spread, head_cy + drop,
                cx + spread, head_cy,
                spread, spread, cx - spread, head_cy, hair))

    # --- neck, then shoulders over it ---
    p.append('<path d="M {:.0f} {:.0f} h {:.0f} v {:.0f} h -{:.0f} Z" fill="{}"/>'.format(
        cx - head_r * 0.32, head_cy + jaw * 0.55, head_r * 0.64,
        head_r * r('neck', 0.62, 0.76), head_r * 0.64, skin))
    p.append('<path d="M {:.0f} {:.0f} h {:.0f} v {:.0f} h -{:.0f} Z" fill="#000000" '
             'opacity="0.12"/>'.format(cx - head_r * 0.32, head_cy + jaw * 0.72,
                                       head_r * 0.64, head_r * 0.20, head_r * 0.64))

    body_top = sh_y - r('drop', 26, 40)
    p.append(
        '<path d="M {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
        'L {:.0f} {} L {:.0f} {} L {:.0f} {:.0f} '
        'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} Z" fill="{}"/>'.format(
            cx - head_r * 0.55, body_top - 14,
            cx - sh_half * 0.66, body_top, cx - sh_half, sh_y - 20, cx - sh_half, sh_y,
            cx - sh_half - 8, H, cx + sh_half + 8, H, cx + sh_half, sh_y,
            cx + sh_half, sh_y - 20, cx + sh_half * 0.66, body_top,
            cx + head_r * 0.55, body_top - 14, INK))
    # shirt / collar V in the lighter blue
    p.append(
        '<path d="M {:.0f} {:.0f} L {:.0f} {:.0f} L {:.0f} {:.0f} L {:.0f} {:.0f} '
        'L {:.0f} {:.0f} L {:.0f} {:.0f} Z" fill="{}"/>'.format(
            cx - head_r * 0.42, body_top - 16, cx, body_top + head_r * 0.76,
            cx + head_r * 0.42, body_top - 16,
            cx + head_r * 0.17, body_top - 26, cx, body_top + head_r * 0.19,
            cx - head_r * 0.17, body_top - 26, INK_2))

    # --- face: an oval with a real jaw, not a circle ---
    p.append(
        '<path d="M {:.0f} {:.0f} A {:.0f} {:.0f} 0 0 1 {:.0f} {:.0f} '
        'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
        'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} Z" fill="{}"/>'.format(
            cx - head_r, head_cy - head_r * 0.28,
            head_r, head_r, cx + head_r, head_cy - head_r * 0.28,
            cx + head_r, head_cy + jaw * 0.62, cx + head_r * 0.52, head_cy + jaw,
            cx, head_cy + jaw,
            cx - head_r * 0.52, head_cy + jaw, cx - head_r, head_cy + jaw * 0.62,
            cx - head_r, head_cy - head_r * 0.28, skin))

    ey = head_cy - head_r * 0.06          # eye line
    ex = head_r * 0.40                    # eye offset from centre

    if beard:
        p.append(
            '<path d="M {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} Z" fill="{}" opacity="0.9"/>'.format(
                cx - head_r * 0.92, ey + head_r * 0.42,
                cx - head_r * 0.86, head_cy + jaw * 1.06,
                cx - head_r * 0.5, head_cy + jaw * 1.1, cx, head_cy + jaw * 1.1,
                cx + head_r * 0.5, head_cy + jaw * 1.1,
                cx + head_r * 0.86, head_cy + jaw * 1.06,
                cx + head_r * 0.92, ey + head_r * 0.42,
                cx + head_r * 0.6, ey + head_r * 0.88,
                cx - head_r * 0.6, ey + head_r * 0.88,
                cx - head_r * 0.92, ey + head_r * 0.42, hair))

    # brows, eyes, nose, mouth
    bw = head_r * 0.24
    by = ey - head_r * 0.20
    for s in (-1, 1):
        p.append('<path d="M {:.0f} {:.0f} Q {:.0f} {:.0f} {:.0f} {:.0f}" stroke="{}" '
                 'stroke-width="{:.1f}" fill="none" stroke-linecap="round"/>'.format(
                     cx + s * ex - bw, by, cx + s * ex, by - head_r * 0.09,
                     cx + s * ex + bw, by, hair, head_r * 0.075))
        p.append('<ellipse cx="{:.0f}" cy="{:.0f}" rx="{:.1f}" ry="{:.1f}" '
                 'fill="#1B2A45"/>'.format(cx + s * ex, ey, head_r * 0.112,
                                           head_r * r('eyeh', 0.075, 0.100)))
    p.append('<path d="M {:.0f} {:.0f} v {:.0f}" stroke="#000000" stroke-width="{:.1f}" '
             'opacity="0.20" fill="none" stroke-linecap="round"/>'.format(
                 cx, ey + head_r * 0.10, head_r * 0.26, head_r * 0.05))
    mw = head_r * r('mouth', 0.22, 0.32)
    p.append('<path d="M {:.0f} {:.0f} Q {:.0f} {:.0f} {:.0f} {:.0f}" stroke="#8E5636" '
             'stroke-width="{:.1f}" fill="none" stroke-linecap="round" opacity="0.85"/>'.format(
                 cx - mw, ey + head_r * 0.56, cx, ey + head_r * 0.68,
                 cx + mw, ey + head_r * 0.56, head_r * 0.062))

    if glasses:
        gr = head_r * 0.30
        for s in (-1, 1):
            p.append('<rect x="{:.0f}" y="{:.0f}" width="{:.0f}" height="{:.0f}" rx="{:.0f}" '
                     'fill="none" stroke="{}" stroke-width="{:.1f}"/>'.format(
                         cx + s * ex - gr, ey - gr * 0.82, gr * 2, gr * 1.64,
                         head_r * 0.09, INK, head_r * 0.062))
        p.append('<path d="M {:.0f} {:.0f} L {:.0f} {:.0f}" stroke="{}" '
                 'stroke-width="{:.1f}"/>'.format(cx - ex + gr, ey, cx + ex - gr, ey,
                                                  INK, head_r * 0.062))

    # --- hair on top, drawn last so it overlaps the forehead ---
    # Anchored so the fringe clears the brow, rather than by eye. Hand-tuned
    # offsets put the cap's lower edge across the eyes on every figure — eight
    # blindfolds — because each style's fringe hangs a different distance below
    # `top`. So solve it instead: take the style's own fringe depth and place
    # `top` high enough that the fringe lands a margin above the brow line.
    hr = head_r * r('hairr', 1.03, 1.10)
    style = seeded(name, 'style')
    fringe_depth = 0.78 if (long_hair or style > 0.62) else (0.70 if style > 0.28 else 0.62)
    brow_y = ey - head_r * 0.20
    top = brow_y - head_r * (fringe_depth + 0.12)
    if long_hair or style > 0.62:                       # full, framing the face
        p.append(
            '<path d="M {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} Z" fill="{}"/>'.format(
                cx - hr, top + head_r * 0.78,
                cx - hr, top - head_r * 0.30, cx + hr, top - head_r * 0.30,
                cx + hr, top + head_r * 0.78,
                cx + hr * 0.72, top + head_r * 0.30, cx + hr * 0.30, top + head_r * 0.42,
                cx, top + head_r * 0.42,
                cx - hr * 0.30, top + head_r * 0.42, cx - hr * 0.72, top + head_r * 0.30,
                cx - hr, top + head_r * 0.78, hair))
    elif style > 0.28:                                  # side parting
        p.append(
            '<path d="M {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} Z" fill="{}"/>'.format(
                cx - hr, top + head_r * 0.70,
                cx - hr, top - head_r * 0.26, cx + hr, top - head_r * 0.26,
                cx + hr, top + head_r * 0.62,
                cx + hr * 0.5, top + head_r * 0.26, cx - hr * 0.2, top + head_r * 0.52,
                cx - hr, top + head_r * 0.70, hair))
    else:                                               # close-cropped
        p.append(
            '<path d="M {:.0f} {:.0f} C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} '
            'C {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} {:.0f} Z" fill="{}"/>'.format(
                cx - hr * 0.97, top + head_r * 0.62,
                cx - hr * 0.9, top - head_r * 0.18, cx + hr * 0.9, top - head_r * 0.18,
                cx + hr * 0.97, top + head_r * 0.62,
                cx + hr * 0.6, top + head_r * 0.34, cx - hr * 0.6, top + head_r * 0.34,
                cx - hr * 0.97, top + head_r * 0.62, hair))

    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" width="{}" '
            'height="{}" role="img" aria-label="Illustrated portrait">{}</svg>'.format(
                W, H, W, H, ''.join(p)))


PEOPLE = [
    ('aarti-deshmukh', True), ('faisal-rehman', False),
    ('meera-krishnan', True), ('zubair-ahmed', False),
    ('kavita-menon', True), ('daniyal-hussain', False),
    ('rohan-bhatt', False), ('saira-qureshi', True),
]

for slug, fem in PEOPLE:
    path = pathlib.Path('{}.svg'.format(slug))
    path.write_text(portrait(slug, fem), encoding='utf-8')
    print('  {:26} {:5} bytes'.format(path.name, path.stat().st_size))
