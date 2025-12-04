<template>
  <div class="palette-preview">
    <div class="preview-controls">
      <label>
        <input type="checkbox" v-model="darkMode" />
        Тёмный фон
      </label>
    </div>

    <div class="mockup" :class="{ 'dark': darkMode }">
      <div class="mockup-header" :style="{ backgroundColor: colors[0] || '#667eea' }">
        <h1 :style="{ color: getTextColor(colors[0]) }">
          Заголовок страницы
        </h1>
      </div>

      <div class="mockup-content">
        <div class="mockup-card" :style="{ backgroundColor: colors[1] || '#f0f0f0', borderColor: colors[0] }">
          <h2 :style="{ color: getTextColor(colors[1]) }">
            Карточка контента
          </h2>
          <p :style="{ color: getTextColor(colors[1], 0.8) }">
            Это пример того, как ваша палитра выглядит в реальном интерфейсе.
          </p>
        </div>

        <button
          class="mockup-button"
          :style="{
            backgroundColor: colors[2] || '#667eea',
            color: getTextColor(colors[2])
          }"
        >
          Кнопка действия
        </button>

        <div class="mockup-footer" :style="{ backgroundColor: colors[3] || '#333' }">
          <p :style="{ color: getTextColor(colors[3]) }">
            Футер страницы
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { isLightColor } from '@/utils/colorUtils';

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
});

const darkMode = ref(false);

const getTextColor = (bgColor, opacity = 1) => {
  if (!bgColor) return darkMode.value ? 'rgba(255, 255, 255, ' + opacity + ')' : 'rgba(0, 0, 0, ' + opacity + ')';
  const isLight = isLightColor(bgColor);
  return isLight
    ? `rgba(0, 0, 0, ${opacity})`
    : `rgba(255, 255, 255, ${opacity})`;
};
</script>

<style scoped>
.palette-preview {
  padding: 24px;
}

.preview-controls {
  margin-bottom: 16px;
}

.preview-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.preview-controls input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.mockup {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: background 0.3s;
}

.mockup.dark {
  background: #1a1a1a;
}

.mockup-header {
  padding: 32px;
  text-align: center;
}

.mockup-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.mockup-content {
  padding: 24px;
}

.mockup-card {
  padding: 24px;
  border-radius: 8px;
  border: 2px solid;
  margin-bottom: 16px;
}

.mockup-card h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

.mockup-card p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.mockup-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.mockup-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mockup-footer {
  margin-top: 24px;
  padding: 16px;
  text-align: center;
  border-radius: 8px;
}

.mockup-footer p {
  margin: 0;
  font-size: 14px;
}
</style>

