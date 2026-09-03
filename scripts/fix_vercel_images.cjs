const fs = require('fs');

let html = fs.readFileSync('standalone.html', 'utf8');

// Ensure all assets point to relative './assets/...'
html = html.replaceAll("'/assets/", "'./assets/");
html = html.replaceAll('"/assets/', '"./assets/');
html = html.replaceAll('url("/assets/', 'url("./assets/');
html = html.replaceAll("url('/assets/", "url('./assets/");

fs.writeFileSync('standalone.html', html, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Images fixed for Vercel!');
