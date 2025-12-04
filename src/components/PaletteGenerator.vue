<template>
  <div class="palette-generator">
    <div class="controls">
      <div class="control-group">
        <label>Количество цветов:</label>
        <select v-model="colorCount" @change="generatePalette">
          <option :value="3">3</option>
          <option :value="5">5</option>
          <option :value="7">7</option>
        </select>
      </div>

      <button class="btn btn-primary" @click="generatePalette">
         Случайная палитра
      </button>
    </div>

    <div class="palette-display">
      <ColorCard
        v-for="(color, index) in displayColors"
        :key="`${color}-${index}`"
        :color="color"
        :format="props.format"
        :is-pinned="pinnedColors.includes(color)"
        @copy="handleCopy"
        @toggle-pin="togglePin"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ColorCard from './ColorCard.vue';
import { generateRandomPalette } from '@/utils/colorUtils';
import { saveCurrentPalette } from '@/utils/storageUtils';

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
  format: {
    type: String,
    default: 'hex',
  },
});

const emit = defineEmits(['update:colors']);

const colorCount = ref(5);
const pinnedColors = ref([]);

const displayColors = computed(() => {
  return props.colors.length > 0 ? props.colors : [];
});

const generatePalette = () => {
  const result = [...pinnedColors.value];
  const needed = colorCount.value - result.length;
  
  if (needed > 0) {
    const additional = generateRandomPalette(needed);
    result.push(...additional);
  }
  
  const finalPalette = result.slice(0, colorCount.value);
  emit('update:colors', finalPalette);
  saveCurrentPalette(finalPalette);
};

const handleCopy = (text) => {
  console.log('Скопировано:', text);
};

const togglePin = (color) => {
  const index = pinnedColors.value.indexOf(color);
  if (index > -1) {
    pinnedColors.value.splice(index, 1);
  } else {
    pinnedColors.value.push(color);
  }
};

watch(() => props.colors, (newColors) => {
  if (newColors.length > 0) {
    saveCurrentPalette(newColors);
  }
}, { deep: true });

onMounted(() => {
  if (props.colors.length === 0) {
    const initialPalette = generateRandomPalette(colorCount.value);
    emit('update:colors', initialPalette);
    saveCurrentPalette(initialPalette);
  }
});
</script>

<style scoped>
.palette-generator {
  padding: 24px;
}

.controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.control-group select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.control-group select:hover {
  border-color: #999;
}

.control-group select:focus {
  outline: none;
  border-color: #4a90e2;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.palette-display {
  display: flex;
  gap: 12px;
  min-height: 200px;
}
</style>

