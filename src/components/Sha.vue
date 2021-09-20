<script setup lang="ts">
import {
  hmacSha1,
  hmacSha256,
  hmacSha384,
  hmacSha512,
  sha1,
  sha256,
  sha384,
  sha512
} from '@/utils/crypto'
import { ref } from 'vue'

const title = 'Hash'
const options = [
  'SHA1',
  'SHA256',
  'SHA384',
  'SHA512',
  'HMAC-SHA1',
  'HMAC-SHA256',
  'HMAC-SHA384',
  'HMAC-SHA512'
]

const curOption = ref(options[0])
const key = ref('')
const input = ref('')
const result = ref('')

const calc = async () => {
  // alert(input.value + curOption.value)
  // alert(window.crypto.subtle)
  // console.log(window.crypto.subtle)

  if (input.value.trim() === '') return
  switch (curOption.value) {
    case 'SHA1':
      result.value = await sha1(input.value)
      break
    case 'SHA256':
      result.value = await sha256(input.value)
      break
    case 'SHA384':
      result.value = await sha384(input.value)
      break
    case 'SHA512':
      result.value = await sha512(input.value)
      break
    case 'HMAC-SHA1':
      result.value = await hmacSha1(key.value, input.value)
      break
    case 'HMAC-SHA256':
      result.value = await hmacSha256(key.value, input.value)
      break
    case 'HMAC-SHA384':
      result.value = await hmacSha384(key.value, input.value)
      break
    case 'HMAC-SHA512':
      result.value = await hmacSha512(key.value, input.value)
      break
    default:
      break
  }
}

const copy = async () => {
  await navigator.clipboard.writeText(result.value)
}

const clear = () => {
  input.value = ''
  key.value = ''
  result.value = ''
}
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-textarea v-model:value="input" placeholder="" :rows="10" @change="result = ''" />
    <a-input v-model:value="key" placeholder="秘钥(非必填)">
      <template #addonBefore>
        <a-select v-model:value="curOption" style="width: 150px" @change="calc">
          <a-select-option v-for="item of options" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </template>
    </a-input>
    <a-input v-model:value="result" placeholder="Hash值"></a-input>
    <a-button type="primary" style="margin-right: 6px" @click="calc">计算</a-button>
    <a-button type="primary" style="margin-right: 6px" @click="copy">复制</a-button>
    <a-button type="primary" style="margin-right: 6px" @click="clear">清空</a-button>
  </div>
</template>

<style scoped lang="less">
.container {
  & > * {
    margin-bottom: 16px;
  }
}
</style>
