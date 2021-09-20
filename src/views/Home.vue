<script setup lang="ts">
import { inject, ref } from 'vue'

defineProps<{
  msg: string
  myName: string
  counter: number
}>()

const emit = defineEmits(['add'])
const changeCounter = () => {
  emit('add', 1)
}
const name = ref<string>('Home 组件')

const str = inject('str') || 0
console.log(str)
</script>
<template>
  <div>
    {{ name }}
    <br />
    {{ counter }}
    <button @click="changeCounter">add</button>
    <p>my-name: {{ myName }}</p>
  </div>
</template>

<style scoped lang="less"></style>
