<script setup lang="ts">
import { buf2hex, str2buf } from '@/utils/crypto'
import { ref } from 'vue'
const title = 'SHA'
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
  if (window.crypto.subtle == null) alert('error: 当前环境不支持window.crypto')
  if (input.value.trim() === '') return
  let hash: ArrayBuffer
  let hmacKey: CryptoKey
  switch (curOption.value) {
    case 'SHA1':
    case 'SHA256':
    case 'SHA384':
    case 'SHA512':
      hash = await window.crypto.subtle.digest(
        { name: 'SHA-' + curOption.value.substring(3) },
        str2buf(input.value)
      )
      break
    case 'HMAC-SHA1':
    case 'HMAC-SHA256':
    case 'HMAC-SHA384':
    case 'HMAC-SHA512':
      if (key.value === '') {
        return
      }
      hmacKey = await window.crypto.subtle.importKey(
        'raw',
        str2buf(key.value),
        {
          name: 'HMAC',
          hash: { name: 'SHA-' + curOption.value.substring(8) }
        },
        false,
        ['sign', 'verify']
      )
      hash = await window.crypto.subtle.sign(
        {
          name: 'HMAC'
        },
        hmacKey,
        str2buf(input.value)
      )
      break
    default:
      hash = str2buf('')
      break
  }
  result.value = buf2hex(hash)
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
