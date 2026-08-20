#!/usr/bin/env python3
"""
Build the 1200x630 card that WhatsApp, LinkedIn and X show when the site is
shared.

Generated rather than hand-designed so it can be regenerated when the date or
venue changes, and so the artwork, logo and type come from the same sources the
site itself uses.

1200x630 because that is the size every major platform crops toward; anything
smaller is upscaled and anything a different shape is cropped unpredictably.
"""
import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'client' / 'public'

W, H = 1200, 630
TEAL_700 = (17, 126, 123)
TEAL_400 = (31, 179, 170)
INK = (39, 39, 39)          # the brand's #272727
INK_MUTED = (91, 91, 91)
PAPER = (255, 255, 255)


def load_font(names, size):
    """First available of `names`, else PIL's default at that size."""
    for name in names:
        for base in (r'C:\Windows\Fonts', '/usr/share/fonts/truetype/dejavu'):
            path = pathlib.Path(base) / name
            if path.exists():
                try:
                    return ImageFont.truetype(str(path), size)
                except OSError:
                    pass
    return ImageFont.load_default()


# One sans across the card, matching the site. Google Sans is a webfont with
# no local file to load here, so these are the closest system faces; the card
# is an image, so what matters is that it reads as the same family, not that
# the bytes match.
SANS_BOLD = ['segoeuib.ttf', 'arialbd.ttf', 'DejaVuSans-Bold.ttf']
SANS = ['segoeui.ttf', 'arial.ttf', 'DejaVuSans.ttf']


def main():
    card = Image.new('RGB', (W, H), PAPER)

    # The valley drawing along the bottom, at its own proportions and faded, so
    # the type above it stays the strongest thing in the frame.
    art_path = PUBLIC / 'brand' / 'hero-valley.webp'
    if art_path.exists():
        art = Image.open(art_path).convert('RGB')
        art = art.resize((W, round(art.height * W / art.width)), Image.LANCZOS)
        band_h = min(art.height, 300)
        band = art.crop((0, art.height - band_h, W, art.height))
        faded = Image.blend(Image.new('RGB', band.size, PAPER), band, 0.55)
        card.paste(faded, (0, H - band_h))

    draw = ImageDraw.Draw(card)

    # Logo, top left.
    logo_path = PUBLIC / 'brand' / 'iwt-logo.png'
    if logo_path.exists():
        logo = Image.open(logo_path).convert('RGBA')
        target_h = 62
        logo = logo.resize((round(logo.width * target_h / logo.height), target_h), Image.LANCZOS)
        card.paste(logo, (64, 56), logo)

    # Title. Two lines, set large — this is the only text most people will read
    # at preview size, where the card renders about 350px wide in a chat list.
    title_font = load_font(SANS_BOLD, 74)
    draw.text((64, 196), 'INDUS WATERS TREATY', font=title_font, fill=INK)
    draw.text((64, 288), 'DIALOGUE', font=title_font, fill=TEAL_700)

    # Rule.
    draw.rectangle([64, 396, 168, 401], fill=TEAL_400)

    # Particulars.
    meta_font = load_font(SANS_BOLD, 30)
    draw.text((64, 428), '19 SEPTEMBER 2026', font=meta_font, fill=INK)
    venue_font = load_font(SANS, 27)
    draw.text((64, 468), 'Bharat Mandapam, New Delhi', font=venue_font, fill=INK_MUTED)

    org_font = load_font(SANS, 22)
    draw.text((64, 540), 'Convened by Tiesverse Foundation', font=org_font, fill=INK_MUTED)

    # JPEG, not PNG. WhatsApp and LinkedIn fetch this synchronously while
    # building the preview and skip images that are slow to arrive; on this
    # content (flat paper and line art) quality 88 is visually identical to the
    # PNG at a fifth of the bytes.
    out = PUBLIC / 'brand' / 'share-card.jpg'
    card.save(out, 'JPEG', quality=88, optimize=True, progressive=True)
    print('{}  {}x{}  {} bytes'.format(out.name, W, H, out.stat().st_size))


if __name__ == '__main__':
    main()
