<template>
  <div class="export-panel">
    <h3>Экспорт палитры</h3>

    <div v-if="colors.length === 0" class="warning">
      Нет цветов для экспорта
    </div>

    <div v-else>
      <div class="export-format-selector">
        <label>Формат экспорта:</label>
        <select v-model="selectedFormat">
          <option value="css-vars">CSS Variables</option>
          <option value="scss">SCSS Variables</option>
          <option value="tailwind">Tailwind Config</option>
          <option value="css">CSS Classes</option>
        </select>
      </div>

      <div class="export-preview">
        <pre>{{ exportCode }}</pre>
      </div>

      <div class="export-actions">
        <button class="btn btn-primary" @click="copyToClipboard">
           Копировать код
        </button>
        <button class="btn btn-secondary" @click="downloadFile">
           Скачать файл
        </button>
      </div>

      <div v-if="showCopyNotification" class="notification">
        Код скопирован в буфер обмена!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  exportAsCSSVariables,
  exportAsSCSSVariables,
  exportAsTailwindConfig,
  exportAsCSSCode,
  copyToClipboard as copyText,
} from '@/utils/exportUtils';

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
});

const selectedFormat = ref('css-vars');
const showCopyNotification = ref(false);

const exportCode = computed(() => {
  switch (selectedFormat.value) {
    case 'css-vars':
      return `:root {\n${exportAsCSSVariables(props.colors)}\n}`;
    case 'scss':
      return exportAsSCSSVariables(props.colors);
    case 'tailwind':
      return exportAsTailwindConfig(props.colors);
    case 'css':
      return exportAsCSSCode(props.colors);
    default:
      return '';
  }
});

const copyToClipboard = async () => {
  try {
    await copyText(exportCode.value);
    showCopyNotification.value = true;
    setTimeout(() => {
      showCopyNotification.value = false;
    }, 2000);
  } catch (err) {
    console.error('Ошибка копирования:', err);
    alert('Не удалось скопировать код');
  }
};

const downloadFile = () => {
  const extension = selectedFormat.value === 'tailwind' ? 'json' : 'css';
  const filename = `palette.${extension}`;
  const blob = new Blob([exportCode.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.export-panel {
  padding: 24px;
}

.export-panel h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.warning {
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  color: #856404;
}

.export-format-selector {
  margin-bottom: 20px;
}

.export-format-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.export-format-selector select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.export-format-selector select:focus {
  outline: none;
  border-color: #4a90e2;
}

.export-preview {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow: auto;
}

.export-preview pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.export-actions {
  display: flex;
  gap: 12px;
}

.notification {
  margin-top: 16px;
  padding: 12px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  color: #155724;
  text-align: center;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

