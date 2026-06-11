<template>
  <div class="slidev-layout default">
    <slot name="default" />
    <div class="grid grid-cols-2 gap-8 mt-4">
      <div>
        <slot name="left" />
      </div>
      <div>
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
