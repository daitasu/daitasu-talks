<template>
  <div class="message-box">
    <svg class="message-box__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.2 22 20.2 H2 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <line x1="12" y1="9.5" x2="12" y2="14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <circle cx="12" cy="17.4" r="1.15" fill="currentColor" />
    </svg>
    <div class="message-box__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.message-box {
  margin: 2.5rem auto 0;
  max-width: 80%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: var(--dt-text);
  background: color-mix(in srgb, var(--dt-accent) 9%, transparent);
  border: 1px solid color-mix(in srgb, var(--dt-accent) 26%, transparent);
  border-left: 4px solid var(--dt-accent);
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
}

.message-box__icon {
  flex: none;
  width: 26px;
  height: 26px;
  color: var(--dt-accent);
}

.message-box__body {
  font-weight: 600;
  font-size: 1.15rem;
  line-height: 1.6;
  text-align: left;
}
</style>
