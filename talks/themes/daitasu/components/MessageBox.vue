<template>
  <div class="message-box">
    <slot />
  </div>
</template>

<style scoped>
.message-box {
  margin-top: 3rem;
  max-width: 66%;
  margin-left: auto;
  margin-right: auto;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  background: #fde3f0;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: center;
}
</style>
