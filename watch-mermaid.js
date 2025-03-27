#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDirPath = path.join(__dirname, 'mermaid-diagrams');

// Create source directory if it doesn't exist
if (!fs.existsSync(sourceDirPath)) {
  fs.mkdirSync(sourceDirPath, { recursive: true });
}

// Compile all diagrams initially
console.log('📊 Compiling all Mermaid diagrams...');
const initialCompile = spawn('node', ['compile-mermaid.js'], { stdio: 'inherit' });

initialCompile.on('close', code => {
  if (code !== 0) {
    console.error('❌ Initial compilation failed');
  } else {
    console.log('✅ Initial compilation complete');
  }
  
  // Start watching for changes
  console.log('👀 Watching for changes in', sourceDirPath);
  
  fs.watch(sourceDirPath, (eventType, filename) => {
    if (filename && filename.endsWith('.mmd')) {
      console.log(`🔄 File ${filename} changed, recompiling...`);
      
      // Compile just the changed file
      const compile = spawn('node', ['compile-mermaid.js', filename], { stdio: 'inherit' });
      
      compile.on('close', code => {
        if (code !== 0) {
          console.error(`❌ Failed to compile ${filename}`);
        } else {
          console.log(`✅ Recompiled ${filename}`);
        }
      });
    }
  });
});

console.log('🚀 Mermaid compiler started. Press Ctrl+C to stop.'); 