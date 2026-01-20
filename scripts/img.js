// scripts/img.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const INPUT_DIR = path.resolve(__dirname, "../src/images_raw");
const OUTPUT_DIR = path.resolve(__dirname, "../src/images");

// 対象拡張子
const TARGET_EXTS = new Set([".jpg", ".jpeg", ".png"]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function outPathFor(inputPath) {
  const rel = path.relative(INPUT_DIR, inputPath);
  return path.join(OUTPUT_DIR, rel);
}

function isUpToDate(input, outputs) {
  if (!outputs.every(fs.existsSync)) return false;
  const inTime = fs.statSync(input).mtimeMs;
  return outputs.every((p) => fs.statSync(p).mtimeMs >= inTime);
}

async function optimizeOne(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!TARGET_EXTS.has(ext)) return { skipped: true };

  const baseOut = outPathFor(filePath);
  const webpOut = baseOut.replace(ext, ".webp");

  ensureDir(path.dirname(baseOut));

  // 更新チェック（元形式 + webp 両方）
  if (isUpToDate(filePath, [baseOut, webpOut])) {
    return { skipped: true };
  }

  const img = sharp(filePath);

  // ---- 元形式（jpg/png） ----
  if (ext === ".png") {
    await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(baseOut);
  } else {
    await img.jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(baseOut);
  }

  // ---- WebP ----
  await img
    .webp({
      quality: 75,
      effort: 4, // 圧縮効率（0-6）
    })
    .toFile(webpOut);

  return { skipped: false };
}

(async () => {
  ensureDir(INPUT_DIR);
  ensureDir(OUTPUT_DIR);

  const files = walk(INPUT_DIR);
  if (files.length === 0) {
    console.log("[img] No files in src/images_raw");
    return;
  }

  let done = 0;
  let skipped = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!TARGET_EXTS.has(ext)) continue;

    try {
      const res = await optimizeOne(file);
      if (res.skipped) skipped++;
      else done++;
    } catch (e) {
      console.error("[img] Failed:", file);
      console.error(e);
      process.exitCode = 1;
    }
  }

  console.log(`[img] optimized: ${done}, skipped: ${skipped}`);
})();
