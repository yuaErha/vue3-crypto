<script setup lang="ts">
import { computed, toRef } from 'vue'
const props = defineProps<{ result: string }>()
const ret = toRef(props, 'result')
// console.log(message)

const ret16LowerCase = computed(() => ret.value.substring(8, 24).toLocaleLowerCase())
const ret16UpperCase = computed(() => ret.value.substring(8, 24).toLocaleUpperCase())
const ret32LowerCase = computed(() => ret.value.toLocaleLowerCase())
const ret32UpperCase = computed(() => ret.value.toLocaleUpperCase())
const copy = async (str: string) => {
  await navigator.clipboard.writeText(str)
}
</script>

<template>
  <a-input-search
    :value="ret32UpperCase"
    addon-before="32位大写："
    enter-button="复制"
    style="margin-top: 16px"
    @search="copy(ret32UpperCase)"
  />
  <a-input-search
    :value="ret32LowerCase"
    addon-before="32位小写："
    enter-button="复制"
    style="margin-top: 16px"
    @search="copy(ret32LowerCase)"
  />
  <a-input-search
    :value="ret16UpperCase"
    addon-before="16位大写："
    enter-button="复制"
    style="margin-top: 16px"
    @search="copy(ret16UpperCase)"
  />
  <a-input-search
    :value="ret16LowerCase"
    addon-before="16位小写："
    enter-button="复制"
    style="margin-top: 16px"
    @search="copy(ret16LowerCase)"
  />
</template>

<style scoped lang="less"></style>
