

export function exportAsCSSVariables(colors, prefix = 'color') {
  return colors.map((color, index) => {
    return `  --${prefix}-${index + 1}: ${color};`;
  }).join('\n');
}

export function exportAsSCSSVariables(colors, prefix = 'color') {
  return colors.map((color, index) => {
    return `$${prefix}-${index + 1}: ${color};`;
  }).join('\n');
}

export function exportAsTailwindConfig(colors) {
  const colorMap = colors.reduce((acc, color, index) => {
    acc[`color${index + 1}`] = color;
    return acc;
  }, {});
  
  return JSON.stringify({
    theme: {
      extend: {
        colors: colorMap,
      },
    },
  }, null, 2);
}

export function exportAsCSSCode(colors) {
  return colors.map((color, index) => {
    return `.color-${index + 1} {\n  color: ${color};\n}`;
  }).join('\n\n');
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

