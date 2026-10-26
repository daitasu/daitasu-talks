<template>
  <a :href="href" target="_blank" class="gh-card">
    <svg class="gh-card__mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.7-4.04-1.56-4.04-1.56-.55-1.35-1.34-1.71-1.34-1.71-1.09-.72.08-.71.08-.71 1.2.08 1.83 1.2 1.83 1.2 1.07 1.77 2.81 1.26 3.5.96.11-.75.42-1.26.76-1.55-2.67-.29-5.47-1.29-5.47-5.75 0-1.27.47-2.31 1.24-3.12-.12-.29-.54-1.48.12-3.08 0 0 1.01-.32 3.3 1.19.96-.26 1.98-.39 3-.39s2.04.13 3 .39c2.29-1.51 3.3-1.19 3.3-1.19.66 1.6.24 2.79.12 3.08.77.81 1.24 1.85 1.24 3.12 0 4.47-2.81 5.45-5.49 5.74.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.22.68.83.56A11.51 11.51 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
    </svg>
    <div class="gh-card__body">
      <div class="gh-card__repo"><span class="gh-card__owner">{{ owner }} /</span> {{ repo }}</div>
      <div v-if="desc" class="gh-card__desc">{{ desc }}</div>
      <div class="gh-card__url">github.com/{{ owner }}/{{ repo }}</div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  owner: { type: String, required: true },
  repo: { type: String, required: true },
  desc: { type: String, default: '' },
})

const href = computed(() => `https://github.com/${props.owner}/${props.repo}`)
</script>

<style scoped>
.gh-card {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 38rem;
  padding: 1.4rem 1.8rem;
  border-radius: 14px;
  border: 1px solid #d0d7de;
  background: #fff;
  box-shadow: 0 8px 24px -12px rgba(15, 23, 42, 0.25);
  text-decoration: none;
  color: inherit;
}
.gh-card__mark { flex: none; width: 52px; height: 52px; color: #24292f; }
.gh-card__body { text-align: left; }
.gh-card__repo { font-size: 1.5rem; font-weight: 700; color: #0969da; line-height: 1.3; }
.gh-card__owner { font-weight: 400; color: #57606a; }
.gh-card__desc { font-size: 1rem; color: #57606a; margin-top: 0.3rem; }
.gh-card__url { font-size: 0.85rem; color: #8b949e; margin-top: 0.5rem; }
</style>
