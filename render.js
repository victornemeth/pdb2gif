const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { execSync } = require("child_process");

const pdbFile = process.argv[2];
const baseName = path.basename(pdbFile, ".pdb");
const inputPath = `/data/pdbs/${pdbFile}`;
const outputDir = "/data/output";

(async () => {
  const pdbData = fs.readFileSync(inputPath, "utf-8");
  const encoded = encodeURIComponent(pdbData);
  const url = `file:///app/viewer.html?pdb=${encoded}`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 500 });
  await page.goto(url);
  await page.waitForFunction(() => window.viewerReady === true);

  const steps = 90;
  const angle = 360 / steps;
  const delay = 50; // ms per frame

  for (let i = 0; i < steps; i++) {
    await page.evaluate((angle) => {
      window.rotateY(angle);
    }, angle);
    const framePath = `${outputDir}/${baseName}_${String(i).padStart(3, "0")}.png`;
    await page.screenshot({ path: framePath });
    await new Promise((res) => setTimeout(res, delay)); // slight pause
  }

  await browser.close();

// Generate GIF (lower frame rate to reduce size)
  const gifPath = `${outputDir}/${baseName}.gif`;
  const gifCmd = `ffmpeg -y -i ${outputDir}/${baseName}_%03d.png -vf "fps=10,scale=320:-1:flags=lanczos" -loop 0 ${gifPath}`;
  execSync(gifCmd, { stdio: "inherit" });

  // Optional cleanup
  for (let i = 0; i < steps; i++) {
    fs.unlinkSync(`${outputDir}/${baseName}_${String(i).padStart(3, "0")}.png`);
  }

  console.log(`✔️ Saved: ${gifPath}`);
})();
