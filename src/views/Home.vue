<script setup lang="ts">
import { ref } from 'vue'
const hello = ref('我是Home组件')
</script>
<template>
  <div>
    {{ hello }}
  </div>
</template>

<style lang="less" scoped></style>
