<!--
  全スライド共通のグローバル層。右下に「一覧へ」戻る導線を出す。
  - 本文の邪魔にならないよう既定は薄く、hover でくっきり
  - export/PDF (isPrintMode) では非表示 → OGP 画像や PDF を汚さない
  - フルスクリーン登壇中も非表示 → 投影画面に出さない
  リンク先はサイトルート（talks.daitasu.work のデッキ一覧）。
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

const { isPrintMode } = useNav()

const isFullscreen = ref(false)
const sync = () => { isFullscreen.value = !!document.fullscreenElement }
onMounted(() => document.addEventListener('fullscreenchange', sync))
onUnmounted(() => document.removeEventListener('fullscreenchange', sync))
</script>

<template>
  <a
    v-if="!isPrintMode && !isFullscreen"
    class="back-to-index"
    href="/"
    title="スライド一覧へ戻る"
  >
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
    <span>一覧へ</span>
  </a>
</template>

<style scoped>
.back-to-index {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  font-size: 12px;
  font-weight: 600;
  color: #4a90d9;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(74, 144, 217, 0.35);
  border-radius: 999px;
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 16px -8px rgba(30, 64, 128, 0.4);
  opacity: 0.32;
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.back-to-index:hover {
  opacity: 1;
  transform: translateY(-2px);
}
</style>
