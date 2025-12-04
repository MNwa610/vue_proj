<template>
  <div
    class="color-card"
    :class="{ 'pinned': isPinned, 'light': isLight }"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <div class="color-info">
      <div class="color-value" v-if="format === 'hex'">{{ color }}</div>
      <div class="color-value" v-else>{{ rgbString }}</div>
      <button
        class="pin-btn"
        @click.stop="togglePin"
        :title="isPinned ? 'Открепить' : 'Закрепить'"
      >
        {{ isPinned ? 'Закреплено' : 'Закрепить' }}
      </button>
    </div>
    <div v-if="showNotification" class="notification">Скопировано!</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { hexToRgb, isLightColor } from '@/utils/colorUtils';

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'hex',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['copy', 'toggle-pin']);

const showNotification = ref(false);

const rgb = computed(() => hexToRgb(props.color));
const rgbString = computed(() => {
  if (!rgb.value) return '';
  return `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`;
});

const isLight = computed(() => isLightColor(props.color));

const handleClick = async () => {
  const text = props.format === 'hex' ? props.color : rgbString.value;
  try {
    await navigator.clipboard.writeText(text);
    showNotification.value = true;
    emit('copy', text);
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
};

const togglePin = () => {
  emit('toggle-pin', props.color);
};
</script>

<style scoped>
.color-card {
  position: relative;
  flex: 1;
  min-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.color-card.pinned {
  border: 3px solid currentColor;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.color-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
}

.color-card.light .color-info {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.color-value {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 600;
  user-select: all;
}

.pin-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.pin-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.color-card.light .pin-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  animation: fadeInOut 2s;
  pointer-events: none;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>

