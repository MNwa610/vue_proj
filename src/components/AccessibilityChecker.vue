<template>
  <div class="accessibility-checker">
    <h3>Проверка доступности (WCAG)</h3>
    
    <div v-if="colors.length < 2" class="warning">
      Нужно минимум 2 цвета для проверки контрастности
    </div>

    <div v-else class="contrast-grid">
      <div class="contrast-header">
        <div class="header-cell">Цвет 1</div>
        <div class="header-cell">Цвет 2</div>
        <div class="header-cell">Контраст</div>
        <div class="header-cell">WCAG AA</div>
        <div class="header-cell">WCAG AAA</div>
      </div>

      <div
        v-for="(pair, index) in colorPairs"
        :key="index"
        class="contrast-row"
      >
        <div class="color-cell">
          <div
            class="color-swatch"
            :style="{ backgroundColor: pair.color1 }"
          ></div>
          <span>{{ pair.color1 }}</span>
        </div>
        <div class="color-cell">
          <div
            class="color-swatch"
            :style="{ backgroundColor: pair.color2 }"
          ></div>
          <span>{{ pair.color2 }}</span>
        </div>
        <div class="ratio-cell">
          <strong>{{ pair.ratio }}:1</strong>
        </div>
        <div class="status-cell">
          <span
            class="badge"
            :class="{
              'pass': pair.wcag.AA.normal,
              'fail': !pair.wcag.AA.normal
            }"
          >
            {{ pair.wcag.AA.normal ? 'AA' : 'AA' }}
          </span>
        </div>
        <div class="status-cell">
          <span
            class="badge"
            :class="{
              'pass': pair.wcag.AAA.normal,
              'fail': !pair.wcag.AAA.normal
            }"
          >
            {{ pair.wcag.AAA.normal ? 'AAA' : 'AAA' }}
          </span>
        </div>
      </div>
    </div>

    <div class="accessibility-info">
      <h4>Рекомендации:</h4>
      <ul>
        <li><strong>WCAG AA:</strong> Минимальный контраст 4.5:1 для обычного текста, 3:1 для крупного</li>
        <li><strong>WCAG AAA:</strong> Улучшенный контраст 7:1 для обычного текста, 4.5:1 для крупного</li>
        <li>Для лучшей доступности используйте цвета с контрастом не менее 4.5:1</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { checkWCAG } from '@/utils/colorUtils';

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
});

const colorPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < props.colors.length; i++) {
    for (let j = i + 1; j < props.colors.length; j++) {
      const wcag = checkWCAG(props.colors[i], props.colors[j]);
      pairs.push({
        color1: props.colors[i],
        color2: props.colors[j],
        ratio: wcag.ratio,
        wcag: wcag,
      });
    }
  }
  return pairs;
});
</script>

<style scoped>
.accessibility-checker {
  padding: 24px;
}

.accessibility-checker h3 {
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

.contrast-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto auto;
  gap: 12px;
  margin-bottom: 24px;
}

.contrast-header {
  display: contents;
  font-weight: 600;
}

.header-cell {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.contrast-row {
  display: contents;
}

.color-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid #e0e0e0;
}

.ratio-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge.pass {
  background: #d4edda;
  color: #155724;
}

.badge.fail {
  background: #f8d7da;
  color: #721c24;
}

.accessibility-info {
  padding: 20px;
  background: #e7f3ff;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
}

.accessibility-info h4 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
}

.accessibility-info ul {
  margin: 0;
  padding-left: 20px;
}

.accessibility-info li {
  margin-bottom: 8px;
  line-height: 1.6;
}
</style>

