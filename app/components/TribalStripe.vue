<template>
  <svg
    class="w-full block"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern
        :id="pid"
        x="0" y="0"
        width="24" height="24"
        patternUnits="userSpaceOnUse"
      >
        <!-- outer diamond: gold -->
        <polygon points="12,1 23,12 12,23 1,12" fill="#C8960C"/>
        <!-- inner diamond: red -->
        <polygon points="12,5 19,12 12,19 5,12" fill="#8B1A1A"/>
        <!-- centre dot: gold -->
        <circle cx="12" cy="12" r="2" fill="#C8960C"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${pid})`"/>
  </svg>
</template>

<script lang="ts" setup>
defineProps({ height: { type: Number, default: 24 } })
const id  = useId()
const pid = `tp-${id}`
</script>
