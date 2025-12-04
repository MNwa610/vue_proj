<template>
  <div class="palette-library">
    <div class="library-header">
      <h3>Библиотека палитр</h3>
      <button class="btn btn-primary" @click="showSaveDialog = true">
         Сохранить текущую палитру
      </button>
    </div>

    <div class="library-controls">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Поиск по названию или тегам..."
        class="search-input"
      />
      <select v-model="filterTag" class="filter-select">
        <option value="">Все теги</option>
        <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </div>

    <div v-if="filteredPalettes.length === 0" class="empty-state">
      <p>Нет сохранённых палитр</p>
    </div>

    <div v-else class="palettes-grid">
      <div
        v-for="palette in filteredPalettes"
        :key="palette.id"
        class="palette-item"
      >
        <div class="palette-item-header">
          <h4>{{ palette.name }}</h4>
          <div class="palette-actions">
            <button @click="editPalette(palette)" title="Редактировать">Редактировать</button>
            <button @click="deletePalette(palette.id)" title="Удалить">Удалить</button>
          </div>
        </div>
        <div class="palette-colors">
          <div
            v-for="(color, index) in palette.colors"
            :key="index"
            class="mini-color"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>
        <div class="palette-meta">
          <span class="tags" v-if="palette.tags && palette.tags.length">
            <span v-for="tag in palette.tags" :key="tag" class="tag">{{ tag }}</span>
          </span>
          <span class="date">{{ formatDate(palette.createdAt) }}</span>
        </div>
        <button class="btn btn-small" @click="loadPalette(palette)">
          Загрузить
        </button>
      </div>
    </div>

    <div v-if="showSaveDialog" class="modal-overlay" @click="showSaveDialog = false">
      <div class="modal" @click.stop>
        <h4>Сохранить палитру</h4>
        <div class="form-group">
          <label>Название:</label>
          <input type="text" v-model="newPaletteName" placeholder="Моя палитра" />
        </div>
        <div class="form-group">
          <label>Теги (через запятую):</label>
          <input type="text" v-model="newPaletteTags" placeholder="веб, дизайн, яркая" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="saveCurrentPalette">Сохранить</button>
          <button class="btn btn-secondary" @click="showSaveDialog = false">Отмена</button>
        </div>
      </div>
    </div>

    <div v-if="editingPalette" class="modal-overlay" @click="editingPalette = null">
      <div class="modal" @click.stop>
        <h4>Редактировать палитру</h4>
        <div class="form-group">
          <label>Название:</label>
          <input type="text" v-model="editingPalette.name" />
        </div>
        <div class="form-group">
          <label>Теги:</label>
          <input type="text" v-model="editingPaletteTags" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="updatePalette">Сохранить</button>
          <button class="btn btn-secondary" @click="editingPalette = null">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  getSavedPalettes,
  savePalette,
  deletePalette as deletePaletteStorage,
  updatePalette as updatePaletteStorage,
} from '@/utils/storageUtils';

const props = defineProps({
  currentColors: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['load-palette']);

const palettes = ref(getSavedPalettes());
const searchQuery = ref('');
const filterTag = ref('');
const showSaveDialog = ref(false);
const editingPalette = ref(null);
const newPaletteName = ref('');
const newPaletteTags = ref('');

const allTags = computed(() => {
  const tags = new Set();
  palettes.value.forEach(p => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});

const filteredPalettes = computed(() => {
  let filtered = palettes.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  if (filterTag.value) {
    filtered = filtered.filter(p =>
      p.tags && p.tags.includes(filterTag.value)
    );
  }

  return filtered;
});

const editingPaletteTags = computed({
  get: () => editingPalette.value?.tags?.join(', ') || '',
  set: (value) => {
    if (editingPalette.value) {
      editingPalette.value.tags = value.split(',').map(t => t.trim()).filter(t => t);
    }
  },
});

const saveCurrentPalette = () => {
  if (!newPaletteName.value.trim()) {
    alert('Введите название палитры');
    return;
  }

  const tags = newPaletteTags.value.split(',').map(t => t.trim()).filter(t => t);
  const palette = {
    name: newPaletteName.value,
    colors: [...props.currentColors],
    tags: tags,
  };

  savePalette(palette);
  palettes.value = getSavedPalettes();
  showSaveDialog.value = false;
  newPaletteName.value = '';
  newPaletteTags.value = '';
};

const loadPalette = (palette) => {
  emit('load-palette', palette.colors);
};

const deletePalette = (id) => {
  if (confirm('Удалить эту палитру?')) {
    palettes.value = deletePaletteStorage(id);
  }
};

const editPalette = (palette) => {
  editingPalette.value = { ...palette };
};

const updatePalette = () => {
  if (!editingPalette.value.name.trim()) {
    alert('Введите название палитры');
    return;
  }

  palettes.value = updatePaletteStorage(editingPalette.value.id, {
    name: editingPalette.value.name,
    tags: editingPalette.value.tags,
  });
  editingPalette.value = null;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

<style scoped>
.palette-library {
  padding: 24px;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.library-header h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.library-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input,
.filter-select {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #4a90e2;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.palette-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.palette-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.palette-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.palette-item-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.palette-actions {
  display: flex;
  gap: 8px;
}

.palette-actions button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.palette-actions button:hover {
  background: #f0f0f0;
}

.palette-colors {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  height: 60px;
}

.mini-color {
  flex: 1;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.palette-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  color: #666;
}

.tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  background: #e7f3ff;
  color: #4a90e2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.date {
  color: #999;
}

.btn-small {
  width: 100%;
  padding: 8px;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90vw;
}

.modal h4 {
  margin: 0 0 20px 0;
  font-size: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>

