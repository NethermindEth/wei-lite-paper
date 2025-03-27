#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDirPath = path.join(__dirname, 'mermaid-diagrams');
const outputDirPath = path.join(__dirname, 'docs/public/mermaid-svg');

// Ensure output directory exists
if (!fs.existsSync(outputDirPath)) {
  fs.mkdirSync(outputDirPath, { recursive: true });
}

// Theme configurations
const themes = [
  { 
    name: 'light',
    theme: 'default',
    bg: '#ffffff',
    textColor: '#333333',
    lineColor: '#333333',
    tertiaryColor: '#f5f5f5'
  },
  { 
    name: 'dark',
    theme: 'dark',
    bg: '#1e1e1e',
    textColor: '#f8f8f2',
    lineColor: '#f8f8f2',
    tertiaryColor: '#2E3440'
  }
];

async function renderMermaidToSvg(mermaidCode, outputBasePath, filename) {
  const browser = await puppeteer.launch();
  
  // Generate each theme version
  for (const themeConfig of themes) {
    const page = await browser.newPage();
    const outputPath = `${outputBasePath}-${themeConfig.name}.svg`;
    
    // Setup the page with Mermaid
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
          <script>
            mermaid.initialize({
              startOnLoad: true,
              theme: '${themeConfig.theme}',
              securityLevel: 'loose',
              themeVariables: {
                primaryColor: '#7C3AED',
                primaryTextColor: '${themeConfig.textColor}',
                primaryBorderColor: '#7C3AED',
                lineColor: '${themeConfig.lineColor}',
                secondaryColor: '#6D28D9',
                tertiaryColor: '${themeConfig.tertiaryColor}',
                
                // Text colors
                textColor: '${themeConfig.textColor}',
                
                // Node colors
                nodeBorder: '${themeConfig.lineColor}',
                clusterBkg: '${themeConfig.tertiaryColor}',
                clusterBorder: '${themeConfig.lineColor}',
                
                // Edge colors
                edgeLabelBackground: '${themeConfig.name === 'dark' ? '#2E3440' : '#f5f5f5'}',
                
                // Graph colors
                titleColor: '${themeConfig.textColor}',
                
                // Contrast colors
                darkTextColor: '${themeConfig.name === 'dark' ? '#f8f8f2' : '#333333'}',
                
                // Additional specific colors for dark mode
                mainBkg: '${themeConfig.name === 'dark' ? '#252526' : '#ffffff'}',
                errorBkgColor: '${themeConfig.name === 'dark' ? '#660000' : '#fdd'}',
                errorTextColor: '${themeConfig.name === 'dark' ? '#ffffff' : '#333333'}'
              }
            });
          </script>
          <style>
            body { background-color: ${themeConfig.bg}; margin: 0; }
            .mermaid { background-color: ${themeConfig.bg}; }
            
            /* Additional style overrides to ensure text visibility in dark mode */
            .${themeConfig.name === 'dark' ? 'dark' : 'light'}-mode .messageText,
            .${themeConfig.name === 'dark' ? 'dark' : 'light'}-mode .loopText,
            .${themeConfig.name === 'dark' ? 'dark' : 'light'}-mode text.actor,
            .${themeConfig.name === 'dark' ? 'dark' : 'light'}-mode .labelText,
            .${themeConfig.name === 'dark' ? 'dark' : 'light'}-mode .labelText tspan {
              fill: ${themeConfig.textColor} !important;
            }
            
            .${themeConfig.name === 'dark' ? 'dark' : 'light'}-mode .sequenceNumber {
              fill: ${themeConfig.name === 'dark' ? '#000000' : '#ffffff'} !important;
            }
          </style>
        </head>
        <body class="${themeConfig.name}-mode">
          <div class="mermaid">
            ${mermaidCode}
          </div>
        </body>
      </html>
    `);
    
    // Wait for Mermaid to render
    await page.waitForFunction('document.querySelector(".mermaid svg")');
    
    // Get the SVG content
    const svgCode = await page.evaluate((themeConfig) => {
      const svg = document.querySelector('.mermaid svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Force color changes on specific SVG elements for dark mode
      if (themeConfig.name === 'dark') {
        // Select all text elements and set their fill to the text color
        const textElements = svg.querySelectorAll('text');
        textElements.forEach(textEl => {
          if (!textEl.getAttribute('class') || 
              !textEl.getAttribute('class').includes('sequenceNumber')) {
            textEl.setAttribute('fill', themeConfig.textColor);
          }
        });
        
        // Select all path, line, and rect stroke elements and set their stroke color
        const strokeElements = svg.querySelectorAll('path, line, rect:not(.actor), polygon');
        strokeElements.forEach(el => {
          const currentStroke = el.getAttribute('stroke');
          if (currentStroke && currentStroke !== 'none' && 
              !currentStroke.startsWith('#7C3AED') && 
              !currentStroke.startsWith('#6D28D9')) {
            el.setAttribute('stroke', themeConfig.lineColor);
          }
        });
      }
      
      return svg.outerHTML;
    }, themeConfig);
    
    // Save the SVG to file
    fs.writeFileSync(outputPath, svgCode);
    
    await page.close();
    console.log(`✅ Generated (${themeConfig.name}): ${outputPath}`);
  }
  
  await browser.close();
}

// Process all .mmd files in the source directory
async function processMermaidFiles() {
  const files = fs.readdirSync(sourceDirPath);
  
  const mermaidFiles = files.filter(file => file.endsWith('.mmd'));
  
  for (const file of mermaidFiles) {
    const filePath = path.join(sourceDirPath, file);
    const outputFileBasePath = path.join(outputDirPath, file.replace('.mmd', ''));
    
    const mermaidCode = fs.readFileSync(filePath, 'utf-8');
    await renderMermaidToSvg(mermaidCode, outputFileBasePath, file);
  }
}

// If a specific file is provided as an argument, process only that file
async function main() {
  if (process.argv.length > 2) {
    const specifiedFile = process.argv[2];
    const filePath = path.join(sourceDirPath, specifiedFile);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    
    const outputFileBasePath = path.join(outputDirPath, specifiedFile.replace('.mmd', ''));
    const mermaidCode = fs.readFileSync(filePath, 'utf-8');
    await renderMermaidToSvg(mermaidCode, outputFileBasePath, specifiedFile);
  } else {
    // Process all .mmd files
    await processMermaidFiles();
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 