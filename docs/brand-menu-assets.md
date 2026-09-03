# Brand-menu artwork

- Hikvision: existing `/assets/brands/hikvision.png`.
- Dahua: existing `/assets/brands/dahua.svg`.
- Paradox: supplied `paradox-logo-png-transparent.png`, copied unchanged. Its transparent square margins are handled by CSS, not by modifying the logo.
- Tiandy: supplied `b43b5c34bde4aab3182a8c73c31798.png@95Q.webp`, copied unchanged. The green wordmark is defined by the alpha channel.
- Arrowhead: built-in image-editing tool output, saved as `/assets/brands/arrowhead-menu.png`. Inspected for complete emblem and correct spelling before use.

Final Arrowhead edit prompt:

> Edit ONLY the Arrowhead Alarm Products logo from the two recent images (the dark square with the blue and white emblem and words). Ignore the plain green image. Website brand-logo cleanup: preserve the exact angular A emblem, blue colour, the two lines of text 'Arrowhead' and 'Alarm Products', original letter shapes, spacing and proportions. Sharpen edges and remove JPEG fuzz. Replace the dark square background with clean white and change the white parts of the emblem and the white lettering to very dark charcoal, retaining the blue. Produce a compact wide horizontal logo, tightly framed around the full emblem and wordmark with only a small even white margin. No redesign, extra text, shadow, gradient or large blank space. Clear professional flat artwork readable at menu size.

The shared BrandMenuLink keeps the existing brand filter destinations and supplies a visible text label. Logo images use empty alternative text to avoid duplicate screen-reader announcements.
