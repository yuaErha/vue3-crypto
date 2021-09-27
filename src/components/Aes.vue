<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import TripleDES from 'crypto-js/tripledes'
import AES from 'crypto-js/aes'

import Utf8 from 'crypto-js/enc-utf8'
import Hex from 'crypto-js/enc-hex'
import Base64 from 'crypto-js/enc-base64'
import { mode, pad } from 'crypto-js'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = ref(route.name)

const aesMode = Reflect.ownKeys(mode)
const aesPad = Reflect.ownKeys(pad)

type CipherType = typeof AES | typeof TripleDES
type ModeType = keyof typeof mode
type PadType = keyof typeof pad
const data = reactive({
  input: '',
  key: '',
  textEncoding: 'Base64',
  iv: '',
  result: '',
  curMode: 'ECB' as ModeType,
  curPad: 'Pkcs7' as PadType
})

const encrypt = () => {
  const key = Utf8.parse(data.key)
  const iv = Utf8.parse(data.iv)
  const routeName = route.name

  let cryptyMethod: CipherType
  if (routeName === 'AES') {
    cryptyMethod = AES
  } else if (routeName === 'DES') {
    cryptyMethod = TripleDES
  } else {
    return
  }

  const encrypted = cryptyMethod.encrypt(data.input, key, {
    iv: iv,
    mode: mode[data.curMode], // 加密模式
    padding: pad[data.curPad]
  })
  if (data.textEncoding === 'Base64') {
    data.result = encrypted.ciphertext.toString(Base64)
  } else if (data.textEncoding === 'HEX') {
    data.result = encrypted.ciphertext.toString()
  }
}
const decrypt = () => {
  const key = Utf8.parse(data.key)
  const iv = Utf8.parse(data.iv)
  const routeName = route.name

  let encrypted = ''
  if (data.textEncoding === 'Base64') {
    encrypted = data.result
  } else if (data.textEncoding === 'HEX') {
    encrypted = Base64.stringify(Hex.parse(data.input))
  }

  let cryptyMethod: CipherType
  if (routeName === 'AES') {
    cryptyMethod = AES
  } else if (routeName === 'DES') {
    cryptyMethod = TripleDES
  } else {
    return
  }

  const decrypted = cryptyMethod.decrypt(encrypted, key, {
    iv: iv,
    mode: mode[data.curMode], // 加密模式
    padding: pad[data.curPad]
  })
  data.input = decrypted.toString(Utf8)
}
const clear = () => {
  data.input = ''
  data.key = ''
  data.iv = ''
  data.result = ''
}
// 监听整个路由
watch(
  () => route.name,
  (to, from) => {
    // 处理一些事情
    // ...
    title.value = route.name as string
    clear()
  }
)
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-textarea
      v-model:value="data.input"
      placeholder="加密内容"
      :rows="10"
      style="margin-bottom: 16px"
    />

    <div class="mode" style="margin-bottom: 16px">
      <a-input-group compact>
        <a-input style="width: 54px" disabled default-value="模式" />
        <a-select v-model:value="data.curMode">
          <a-select-option v-for="item of aesMode" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
        <a-input style="width: 54px" disabled default-value="填充" />
        <a-select v-model:value="data.curPad" style="min-width: 140px">
          <a-select-option v-for="item of aesPad" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
        <a-input style="width: 54px" disabled default-value="偏移" />
        <a-input v-model:value="data.iv" />
      </a-input-group>
      <!-- <a-input-group compact style="margin-top: 16px">
        <a-input style="width: 54px" disabled default-value="偏移" />
        <a-input v-model:value="value4" />
      </a-input-group> -->
      <a-input-group compact style="margin-top: 16px">
        <a-input style="width: 54px" disabled default-value="秘钥" />
        <a-input v-model:value="data.key" style="width: 100%" />
        <a-input style="width: 54px" disabled default-value="编码" />
        <a-select v-model:value="data.textEncoding" style="min-width: 100px">
          <a-select-option value="Base64">Base64</a-select-option>
          <a-select-option value="HEX">HEX</a-select-option>
        </a-select>
      </a-input-group>
    </div>
    <a-textarea v-model:value="data.result" placeholder="" :rows="10" style="margin-bottom: 16px" />
    <a-button type="primary" style="margin-right: 6px" @click="encrypt">加密</a-button>
    <a-button type="primary" style="margin-right: 6px" @click="decrypt">解密</a-button>
    <a-button type="primary" style="margin-right: 6px" @click="clear">清空</a-button>
  </div>
</template>

<style scoped lang="less">
.mode {
  // display: flex;
  // & > .ant-input-group-wrapper {
  //   width: 150px;
  //   margin-right: 10px;
  // }
  // align-items: stretch;
  & > span {
    display: flex;
  }
  :deep(input[type='text'][disabled]) {
    cursor: default;
    background-color: #fafafa;
    color: #000000bd;
    // display: none;
    // // width: 1px;
    // div {
    //   display: none;
    // }
  }
}
</style>
