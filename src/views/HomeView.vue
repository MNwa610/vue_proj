<template>
  <div class="home-view">
    <h1>Генератор цветовых палитр</h1>
    <p class="subtitle">Создавайте гармоничные цветовые схемы для ваших проектов</p>

    <section class="section">
      <div class="section-header">
        <h2>Генерация палитры</h2>
        <div class="format-selector">
          <label>Формат:</label>
          <select v-model="format">
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
      </div>
      
      <div class="generation-tabs">
        <button
          class="gen-tab"
          :class="{ active: generationMode === 'basic' }"
          @click="generationMode = 'basic'"
        >
          Случайная
        </button>
        <button
          class="gen-tab"
          :class="{ active: generationMode === 'advanced' }"
          @click="generationMode = 'advanced'"
        >
          Продвинутая
        </button>
      </div>

      <div v-if="generationMode === 'basic'" class="generation-content">
        <PaletteGenerator
          v-model:colors="currentColors"
          :format="format"
          @update:colors="handleColorsUpdate"
        />
      </div>

      <div v-if="generationMode === 'advanced'" class="generation-content">
        <AdvancedGenerator
          :format="format"
          @palette-generated="handlePaletteGenerated"
        />
      </div>
    </section>

    <section v-if="currentColors.length > 0" class="section">
      <h2>Текущая палитра</h2>
      <div class="current-palette-display">
        <ColorCard
          v-for="(color, index) in currentColors"
          :key="`${color}-${index}`"
          :color="color"
          :format="format"
          @copy="handleCopy"
        />
      </div>
    </section>

    <section v-if="currentColors.length > 0" class="section">
      <h2>Превью палитры</h2>
      <PalettePreview :colors="currentColors" />
    </section>

    <section v-if="currentColors.length > 0" class="section">
      <h2>Дополнительные инструменты</h2>
      
      <div class="tools-tabs">
        <button
          class="tool-tab"
          :class="{ active: activeTool === 'accessibility' }"
          @click="activeTool = 'accessibility'"
        >
          Доступность
        </button>
        <button
          class="tool-tab"
          :class="{ active: activeTool === 'library' }"
          @click="activeTool = 'library'"
        >
          Библиотека
        </button>
        <button
          class="tool-tab"
          :class="{ active: activeTool === 'export' }"
          @click="activeTool = 'export'"
        >
          Экспорт
        </button>
      </div>

      <div class="tool-content">
        <div v-if="activeTool === 'accessibility'">
          <AccessibilityChecker :colors="currentColors" />
        </div>

        <div v-if="activeTool === 'library'">
          <PaletteLibrary
            :current-colors="currentColors"
            @load-palette="handleLoadPalette"
          />
        </div>

        <div v-if="activeTool === 'export'">
          <ExportPanel :colors="currentColors" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PaletteGenerator from '@/components/PaletteGenerator.vue';
import AdvancedGenerator from '@/components/AdvancedGenerator.vue';
import ColorCard from '@/components/ColorCard.vue';
import PalettePreview from '@/components/PalettePreview.vue';
import AccessibilityChecker from '@/components/AccessibilityChecker.vue';
import PaletteLibrary from '@/components/PaletteLibrary.vue';
import ExportPanel from '@/components/ExportPanel.vue';
import { getCurrentPalette, saveCurrentPalette } from '@/utils/storageUtils';
import { generateRandomPalette } from '@/utils/colorUtils';

const currentColors = ref([]);
const generationMode = ref('basic');
const activeTool = ref('accessibility');
const format = ref('hex');

const handleColorsUpdate = (colors) => {
  currentColors.value = colors;
};

const handlePaletteGenerated = (colors) => {
  currentColors.value = colors;
  saveCurrentPalette(colors);
};

const handleLoadPalette = (colors) => {
  currentColors.value = colors;
  activeTool.value = 'accessibility';
};

const handleCopy = (text) => {
  console.log('Скопировано:', text);
};

onMounted(() => {
  const saved = getCurrentPalette();
  if (saved && saved.length > 0) {
    currentColors.value = saved;
  } else {
    currentColors.value = generateRandomPalette(5);
  }
});
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.home-view h1 {
  text-align: center;
  font-size: 36px;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 18px;
  margin: 0 0 48px 0;
}

.section {
  margin-bottom: 48px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 12px;
}

.section h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.format-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.format-selector label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.format-selector select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.format-selector select:focus {
  outline: none;
  border-color: #4a90e2;
}

.generation-tabs,
.tools-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
}

.gen-tab,
.tool-tab {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.gen-tab:hover,
.tool-tab:hover {
  color: #667eea;
}

.gen-tab.active,
.tool-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.generation-content,
.tool-content {
  min-height: 200px;
}

.current-palette-display {
  display: flex;
  gap: 12px;
  min-height: 200px;
}
</style>
