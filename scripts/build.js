const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const srcPath = path.join(__dirname, '..', 'src', 'sld_visualizer.html');
const outPath = path.join(__dirname, '..', 'public', 'index.html');
const trackingPath = path.join(__dirname, 'tracking.js');

const html = fs.readFileSync(srcPath, 'utf8');

// Extract <script> content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('No <script> found'); process.exit(1); }

let js = scriptMatch[1];

// Optionally inject tracking (tracking.js is gitignored and independent)
if (fs.existsSync(trackingPath)) {
  const { injectTracking } = require(trackingPath);
  js = injectTracking(js);
  console.log('Tracking injected from scripts/tracking.js');
} else {
  console.log('No tracking.js found — building without analytics');
}

// Obfuscate
const obfuscated = JavaScriptObfuscator.obfuscate(js, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.7,
  renameGlobals: false,  // keep DOM event handler names working
  selfDefending: false,
  identifierNamesGenerator: 'hexadecimal'
});

// Rebuild HTML with obfuscated JS
const newHtml = html.replace(
  /<script>[\s\S]*?<\/script>/,
  '<script>' + obfuscated.getObfuscatedCode() + '</script>'
);

// Ensure output directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true });

// Write to public/
fs.writeFileSync(outPath, newHtml);
console.log('Build complete:', outPath);
console.log('Original JS:', (js.length / 1024).toFixed(1), 'KB');
console.log('Obfuscated:', (obfuscated.getObfuscatedCode().length / 1024).toFixed(1), 'KB');
