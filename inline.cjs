const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

// Find CSS file
const cssMatch = html.match(/href="\.\/assets\/(index-[^"]+\.css)"/);
if (cssMatch) {
  const cssFile = cssMatch[1];
  const cssContent = fs.readFileSync(path.join(distPath, 'assets', cssFile), 'utf8');
  html = html.replace(/<link rel="stylesheet"[^>]+>/, () => `<style>${cssContent}</style>`);
  console.log('Inlined CSS:', cssFile);
} else {
  console.log('No CSS match found');
}

// Find JS file
const jsMatch = html.match(/src="\.\/assets\/(index-[^"]+\.js)"/);
if (jsMatch) {
  const jsFile = jsMatch[1];
  const jsContent = fs.readFileSync(path.join(distPath, 'assets', jsFile), 'utf8');
  html = html.replace(/<script type="module"[^>]+><\/script>/, () => `<script type="module">${jsContent}</script>`);
  console.log('Inlined JS:', jsFile);
} else {
  console.log('No JS match found');
}

fs.writeFileSync(path.join(distPath, 'index.single.html'), html, 'utf8');
console.log('Single HTML generated successfully!');

const androidAssetPath = path.join(__dirname, 'android-app', 'assets', 'index.html');
fs.writeFileSync(androidAssetPath, html, 'utf8');
console.log('Copied single HTML asset to android-app assets.');

