<template>
  <div class="demo-frame">
    <div class="demo-frame__bar">
      <span class="demo-frame__dot" />
      <span class="demo-frame__dot" />
      <span class="demo-frame__dot" />
      <div class="demo-frame__url">
        <span class="demo-frame__live">● LIVE</span>
        {{ label || displayUrl }}
      </div>
    </div>
    <iframe
      :src="src"
      :style="{ height }"
      class="demo-frame__view"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  height: { type: String, default: "400px" },
  label: { type: String, default: "" },
});

const displayUrl = computed(() =>
  props.src.replace(/^https?:\/\//, "").replace(/\/$/, ""),
);
</script>

<style scoped>
.demo-frame {
  border-radius: 16px;
  overflow: hidden;
  background: #0b0d12;
  box-shadow:
    0 28px 70px -28px rgba(30, 64, 128, 0.5),
    0 10px 28px -14px rgba(15, 23, 42, 0.22),
    0 0 0 1px rgba(74, 144, 217, 0.14);
}

.demo-frame__bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 7px;
  background: linear-gradient(180deg, #f4f6fa, #e8edf4);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.demo-frame__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cfd6e0;
}
.demo-frame__dot:nth-child(1) { background: #ff5f57; }
.demo-frame__dot:nth-child(2) { background: #febc2e; }
.demo-frame__dot:nth-child(3) { background: #28c840; }

.demo-frame__url {
  margin-left: 8px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 8px;
  color: #64748b;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  background: #ffffff;
  border-radius: 999px;
  padding: 4px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.demo-frame__live {
  color: #16a34a;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex: none;
}

.demo-frame__view {
  display: block;
  width: 100%;
  border: 0;
  background: #0b0d12;
}
</style>
