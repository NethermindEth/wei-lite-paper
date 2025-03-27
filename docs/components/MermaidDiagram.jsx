import React, { useEffect, useState } from 'react';

export function MermaidDiagram({ name, caption, width = '100%', className = '' }) {
  const [theme, setTheme] = useState('light');
  
  // Function to detect the current theme
  const detectTheme = () => {
    // Check if we have a theme preference from Vocs
    const colorScheme = document.documentElement.getAttribute('data-color-scheme');
    
    if (colorScheme === 'dark') {
      setTheme('dark');
    } else if (colorScheme === 'light') {
      setTheme('light');
    } else {
      // If 'auto', check preferred color scheme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  };
  
  useEffect(() => {
    // Initial theme detection
    detectTheme();
    
    // Set up event listeners for theme changes
    const colorSchemeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-color-scheme') {
          detectTheme();
        }
      });
    });
    
    colorSchemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-scheme']
    });
    
    // Listen for system theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      detectTheme();
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up observers and listeners
    return () => {
      colorSchemeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // The name parameter should be the basename of the .mmd file without extension
  // For example, if the file is "flowchart.mmd", name should be "flowchart"
  
  return (
    <figure className={`mermaid-figure ${className}`} style={{ textAlign: 'center', margin: '2rem 0' }}>
      <img 
        src={`/mermaid-svg/${name}-${theme}.svg`} 
        alt={caption || `${name} diagram`}
        style={{ 
          maxWidth: width,
          height: 'auto',
          margin: '0 auto'
        }}
        className="mermaid-svg"
        key={`${name}-${theme}`} // Force re-render when theme changes
      />
      {caption && (
        <figcaption style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.9em',
          fontStyle: 'italic',
          color: 'var(--vocs-c-text-2)'
        }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
} 