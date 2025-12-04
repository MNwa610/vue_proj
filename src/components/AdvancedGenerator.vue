<template>
  <div class="advanced-generator">
    <div class="generator-section">
      <h3>Генерация по базовому цвету</h3>
      <div class="base-color-picker">
        <input type="color" v-model="baseColor" @change="generateFromBase" />
        <span>{{ baseColor }}</span>
      </div>

      <div class="palette-type-selector">
        <label>Тип палитры:</label>
        <select v-model="paletteType" @change="generateFromBase">
          <option value="analogous">Аналогичная</option>
          <option value="monochromatic">Монохромная</option>
          <option value="triad">Триада</option>
          <option value="complementary">Комплементарная</option>
        </select>
      </div>
    </div>

    <div class="generator-section">
      <h3>Генерация по настроению</h3>
      <div class="mood-buttons">
        <button
          v-for="mood in moods"
          :key="mood.value"
          class="mood-btn"
          :class="{ active: selectedMood === mood.value }"
          @click="generateByMood(mood.value)"
        >
          {{ mood.label }}
        </button>
      </div>
    </div>

    <div class="generated-palette">
      <ColorCard
        v-for="(color, index) in generatedColors"
        :key="`${color}-${index}`"
        :color="color"
        :format="format"
        @copy="handleCopy"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import ColorCard from './ColorCard.vue';
import { generateHarmoniousPalette, generateMoodPalette } from '@/utils/colorUtils';
import { saveCurrentPalette } from '@/utils/storageUtils';

const props = defineProps({
  format: {
    type: String,
    default: 'hex',
  },
});

const emit = defineEmits(['palette-generated']);

const baseColor = ref('#667eea');
const paletteType = ref('analogous');
const selectedMood = ref(null);
const generatedColors = ref([]);

const moods = [
  { value: 'calm', label: 'Спокойные' },
  { value: 'energetic', label: 'Энергичные' },
  { value: 'professional', label: 'Профессиональные' },
  { value: 'warm', label: 'Тёплые' },
  { value: 'cool', label: 'Холодные' },
];

const generateFromBase = () => {
  generatedColors.value = generateHarmoniousPalette(baseColor.value, paletteType.value, 5);
  emit('palette-generated', generatedColors.value);
  saveCurrentPalette(generatedColors.value);
};

const generateByMood = (mood) => {
  selectedMood.value = mood;
  generatedColors.value = generateMoodPalette(mood, 5);
  emit('palette-generated', generatedColors.value);
  saveCurrentPalette(generatedColors.value);
};

const handleCopy = (text) => {
  console.log('Скопировано:', text);
};

generateFromBase();
</script>

<style scoped>
.advanced-generator {
  padding: 24px;
}

.generator-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.generator-section h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
}

.base-color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.base-color-picker input[type="color"] {
  width: 60px;
  height: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.base-color-picker span {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 16px;
  font-weight: 600;
}

.palette-type-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-type-selector label {
  font-size: 14px;
  font-weight: 600;
}

.palette-type-selector select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.mood-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mood-btn {
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.mood-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.mood-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.generated-palette {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
</style>

