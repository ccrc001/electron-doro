<template>
    <svg
      aria-hidden="true"
      class="svg-icon"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <use :xlink:href="symbolId" />
    </svg>
  </template>
  <script setup lang="ts">
  import { computed } from "vue";
  
  const props = defineProps({
     prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 18,
    },
  });
  const symbolId = computed(() => `#${props.prefix}-${props.name}`);
  </script>
  
  <style scoped>
  .svg-icon {
    fill: currentColor;
    vertical-align: middle;
    overflow: hidden;
    width: 30px;
    height: 30px;
  }
  </style>
  
  