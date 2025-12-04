
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}


export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}


export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}


export function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export function generateRandomPalette(count = 5) {
  return Array.from({ length: count }, () => generateRandomColor());
}

export function generateHarmoniousPalette(baseColor, type = 'analogous', count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return generateRandomPalette(count);

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [baseColor];

  switch (type) {
    case 'analogous': {
      for (let i = 1; i < count; i++) {
        const newH = (hsl.h + (i * 30)) % 360;
        const newRgb = hslToRgb(newH, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    case 'monochromatic': {
      for (let i = 1; i < count; i++) {
        const newL = Math.max(10, Math.min(90, hsl.l + (i % 2 === 0 ? 15 : -15) * (i / 2)));
        const newRgb = hslToRgb(hsl.h, hsl.s, newL);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    case 'triad': {
      const step = 120;
      for (let i = 1; i < count; i++) {
        const newH = (hsl.h + (i * step)) % 360;
        const newRgb = hslToRgb(newH, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    case 'complementary': {
      for (let i = 1; i < count; i++) {
        const newH = (hsl.h + (i * 180)) % 360;
        const newRgb = hslToRgb(newH, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;
    }
    default:
      return generateRandomPalette(count);
  }

  return colors.slice(0, count);
}


export function generateMoodPalette(mood, count = 5) {
  const moodColors = {
    calm: { h: 200, s: 40, l: 60 },     
    energetic: { h: 0, s: 80, l: 50 },
    professional: { h: 220, s: 30, l: 50 }, 
    warm: { h: 30, s: 60, l: 55 },      
    cool: { h: 180, s: 50, l: 55 },     
  };

  const base = moodColors[mood] || moodColors.calm;
  const colors = [];

  for (let i = 0; i < count; i++) {
    const variation = (i - Math.floor(count / 2)) * 20;
    const newH = (base.h + variation) % 360;
    const newS = Math.max(20, Math.min(80, base.s + (i % 2 === 0 ? 10 : -10)));
    const newL = Math.max(30, Math.min(70, base.l + (i % 3 === 0 ? 15 : -15)));
    const rgb = hslToRgb(newH, newS, newL);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  return colors;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
export function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkWCAG(color1, color2) {
  const ratio = getContrastRatio(color1, color2);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: {
      normal: ratio >= 4.5,
      large: ratio >= 3,
    },
    AAA: {
      normal: ratio >= 7,
      large: ratio >= 4.5,
    },
  };
}

export function isLightColor(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return false;
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5;
}

