const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const srcPath = path.join(__dirname, '..', 'src', 'sld_visualizer.html');
const outPath = path.join(__dirname, '..', 'public', 'index.html');
const pluginsDir = path.join(__dirname, 'plugins');

const html = fs.readFileSync(srcPath, 'utf8');

// Extract <script> content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('No <script> found'); process.exit(1); }

let js = scriptMatch[1];

// Load plugins if available (plugins/ is local-only)
if (fs.existsSync(pluginsDir)) {
  const plugins = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js')).sort();
  for (const file of plugins) {
    const plugin = require(path.join(pluginsDir, file));
    if (typeof plugin.transform === 'function') {
      js = plugin.transform(js);
      console.log(`Plugin loaded: ${file}`);
    }
  }
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
