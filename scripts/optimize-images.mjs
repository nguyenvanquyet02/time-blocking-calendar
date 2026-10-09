import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const input = "src/assets/fresh-yellow-daisy-single-flower-close-up-beauty-generated-by-ai.jpg";
const outputDir = "public/images/hero";

await fs.mkdir(outputDir, { recursive: true });

const widths = [400, 800, 1200, 1600];

for (const width of widths) {
    // JPEG
    await sharp(input)
        .resize(width)
        .jpeg({
            quality: 80,
        })
        .toFile(path.join(outputDir, `hero2-${width}.jpg`));

    // WebP
    await sharp(input)
        .resize(width)
        .webp({
            quality: 80,
        })
        .toFile(path.join(outputDir, `hero2-${width}.webp`));

    // AVIF
    await sharp(input)
        .resize(width)
        .avif({
            quality: 60,
        })
        .toFile(path.join(outputDir, `hero2-${width}.avif`));
}