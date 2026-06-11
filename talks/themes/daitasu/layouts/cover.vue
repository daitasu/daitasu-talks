<template>
  <div class="slidev-layout cover">
    <div class="cover-title">
      <slot name="default" />
    </div>
    <div class="cover-footer">
      <slot name="footer" />
    </div>
    <img
      v-if="dinoVisible"
      :src="dinoSrc"
      class="dino-img"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dino: { type: [Boolean, String], default: true },
})

const dinoVisible = computed(() => props.dino !== false && props.dino !== 'false')
const dinoSrc = computed(() => typeof props.dino === 'string' && props.dino !== 'true' ? props.dino : '/assets/title_dino.svg')
</script>

<style scoped>
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cover-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cover-footer {
  position: absolute;
  bottom: 2.5rem;
  left: 4rem;
}

.dino-img {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 14rem;
  opacity: 1;
  pointer-events: none;
}
</style>
