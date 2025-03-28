#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

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

// Generate hash for a file
function hashFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('md5').update(fileContent).digest('hex');
  } catch (error) {
    console.error(`Error hashing file ${filePath}:`, error.message);
    return null;
  }
}

// Function to check if a specific file needs to be updated
function needsUpdate(sourceFile, targetBaseName) {
  // Get the hash of the source file
  const sourceHash = hashFile(sourceFile);
  if (!sourceHash) return true; // If we can't hash, assume update is needed
  
  // Check each theme
  for (const theme of themes) {
    const svgFilePath = path.join(outputDirPath, `${targetBaseName}-${theme.name}.svg`);
    
    // If the SVG file doesn't exist, it needs update
    if (!fs.existsSync(svgFilePath)) {
      return true;
    }
    
    // Look for a hash file associated with this SVG
    const hashFilePath = path.join(outputDirPath, `${targetBaseName}-${theme.name}.hash`);
    
    // If hash file doesn't exist or doesn't match, update is needed
    if (!fs.existsSync(hashFilePath)) {
      return true;
    }
    
    const savedHash = fs.readFileSync(hashFilePath, 'utf-8').trim();
    if (savedHash !== sourceHash) {
      return true;
    }
  }
  
  return false;
}

// Function to check if any files need updating
function getFilesToUpdate(fileArg = null) {
  if (fileArg) {
    // Check a specific file
    const filePath = path.join(sourceDirPath, fileArg);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    
    const baseName = fileArg.replace('.mmd', '');
    if (needsUpdate(filePath, baseName)) {
      return [{ 
        path: filePath, 
        baseName,
        hash: hashFile(filePath),
        origName: fileArg
      }];
    }
    return [];
  } else {
    // Check all files
    const files = fs.readdirSync(sourceDirPath);
    const mermaidFiles = files.filter(file => file.endsWith('.mmd'));
    
    return mermaidFiles
      .map(file => {
        const filePath = path.join(sourceDirPath, file);
        const baseName = file.replace('.mmd', '');
        const fileHash = hashFile(filePath);
        
        return { 
          path: filePath, 
          baseName, 
          hash: fileHash,
          needsUpdate: needsUpdate(filePath, baseName),
          origName: file
        };
      })
      .filter(file => file.needsUpdate);
  }
}

// Main function
async function main() {
  // Get the file argument if provided
  const fileArg = process.argv.length > 2 ? process.argv[2] : null;
  
  // Check if any files need updating
  const filesToUpdate = getFilesToUpdate(fileArg);
  
  if (filesToUpdate.length === 0) {
    console.log('✅ All Mermaid SVG files are up to date!');
    process.exit(0);
  }
  
  console.log(`🔄 Found ${filesToUpdate.length} Mermaid file(s) that need updating`);
  
  // Dynamically import puppeteer only if needed
  console.log('📦 Importing puppeteer...');
  const puppeteer = await import('puppeteer');
  
  // Process each file that needs updating
  for (const file of filesToUpdate) {
    console.log(`🔄 Processing ${file.origName || path.basename(file.path)}...`);
    const mermaidCode = fs.readFileSync(file.path, 'utf-8');
    const outputBasePath = path.join(outputDirPath, file.baseName);
    await renderMermaidToSvg(puppeteer.default, mermaidCode, outputBasePath, file);
  }
  
  console.log('✅ All Mermaid SVG files have been updated!');
}

// Render mermaid diagram to SVG function
async function renderMermaidToSvg(puppeteer, mermaidCode, outputBasePath, fileInfo) {
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
    
    // Save the hash file
    const hashFilePath = `${outputBasePath}-${themeConfig.name}.hash`;
    fs.writeFileSync(hashFilePath, fileInfo.hash);
    
    await page.close();
    console.log(`✅ Generated (${themeConfig.name}): ${outputPath}`);
  }
  
  await browser.close();
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 