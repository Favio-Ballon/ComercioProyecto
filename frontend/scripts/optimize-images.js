import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "../public");
const SRC_ASSETS_DIR = path.join(__dirname, "../src/assets");

// Image optimization settings
const OPTIMIZATION_SETTINGS = {
  webp: {
    quality: 80,
    effort: 6,
  },
  jpeg: {
    quality: 80,
    progressive: true,
  },
  png: {
    quality: 80,
    compressionLevel: 9,
  },
};

async function optimizeImage(inputPath, outputPath, format) {
  try {
    let sharpInstance = sharp(inputPath);

    switch (format) {
      case "webp":
        await sharpInstance.webp(OPTIMIZATION_SETTINGS.webp).toFile(outputPath);
        break;
      case "jpeg":
        await sharpInstance.jpeg(OPTIMIZATION_SETTINGS.jpeg).toFile(outputPath);
        break;
      case "png":
        await sharpInstance.png(OPTIMIZATION_SETTINGS.png).toFile(outputPath);
        break;
    }

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = (
      ((originalSize - optimizedSize) / originalSize) *
      100
    ).toFixed(1);

    console.log(`✅ Optimized: ${path.basename(inputPath)}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`   Savings: ${savings}%`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();

      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        const fileName = path.basename(file, ext);
        const outputPath = path.join(dirPath, `${fileName}-optimized${ext}`);

        let format = "webp";
        if (ext === ".jpg" || ext === ".jpeg") format = "jpeg";
        if (ext === ".png") format = "png";

        await optimizeImage(filePath, outputPath, format);
      }
    }
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");

  // Process public directory
  console.log("📁 Processing public directory...");
  await processDirectory(PUBLIC_DIR);

  // Process src/assets directory
  console.log("\n📁 Processing src/assets directory...");
  await processDirectory(SRC_ASSETS_DIR);

  console.log("\n✅ Image optimization complete!");
  console.log("💡 Consider replacing original images with optimized versions.");
}

main().catch(console.error);
