
const STORAGE_KEY = 'colorPaletteApp';

export function savePalette(palette) {
  const saved = getSavedPalettes();
  saved.push({
    ...palette,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function getSavedPalettes() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function deletePalette(id) {
  const saved = getSavedPalettes();
  const filtered = saved.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function updatePalette(id, updates) {
  const saved = getSavedPalettes();
  const index = saved.findIndex(p => p.id === id);
  if (index !== -1) {
    saved[index] = { ...saved[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }
  return saved;
}

export function saveCurrentPalette(colors) {
  localStorage.setItem(`${STORAGE_KEY}_current`, JSON.stringify(colors));
}

export function getCurrentPalette() {
  const data = localStorage.getItem(`${STORAGE_KEY}_current`);
  return data ? JSON.parse(data) : null;
}

