<script setup lang="ts">
import {
  RsaEncrypt,
  RsaGenerateKey,
  arrayBufferToBase64,
  buf2str,
  RsaDecrypt
} from '@/utils/crypto'
import { ref } from 'vue'
type KeyLength = 1024 | 2048 | 4096

const title = 'RSA'
const activeKey = ref('1')

const keyLength: KeyLength = 1024

const key = ref<CryptoKeyPair>({
  privateKey: undefined,
  publicKey: undefined
})
const source = ''
const target = ''
const generateKey = async () => {
  const k = await RsaGenerateKey(keyLength)
  console.log('👀,k', k)

  // key.value
  key.value.publicKey = k.publicKey as CryptoKey
  key.value.privateKey = k.privateKey as CryptoKey

  // const keydata: ArrayBuffer = await window.crypto.subtle.exportKey('jwk', publicKey)

  // const keyData = await RsaExportKey(publicKey as CryptoKey)
  // console.log(keyData)

  try {
    const buf: ArrayBuffer = await RsaEncrypt('abc', publicKey)
    const ciphertext = arrayBufferToBase64(buf)
    console.log(ciphertext)

    const buf1 = await RsaDecrypt(ciphertext, privateKey)
    // console.log(buf1)
    console.log(buf2str(buf1))
  } catch (error) {
    console.log('error', error)
  }
}
const encrypt = () => {
  source
}
const decrypt = () => {}
const clear = () => {}
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-tabs v-model:activeKey="activeKey" :animated="false">
      <a-tab-pane key="1" tab="生成秘钥">
        <a-textarea v-model:value="key.publicKey" :rows="10" />
        <div class="btns">
          <a-select v-model:value="keyLength" style="min-width: 100px">
            <a-select-option :value="1024">1024 bit</a-select-option>
            <a-select-option :value="2048">2048 bit</a-select-option>
            <a-select-option :value="4096">4096 bit</a-select-option>
          </a-select>
          <a-button type="primary" style="margin-left: 12px" @click="generateKey"
            >生成秘钥</a-button
          >
        </div>
        <a-textarea v-model:value="key.privateKey" :rows="10" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="加密解密">
        <a-textarea v-model:value="source" :rows="10" />
        <div class="btns">
          <a-button type="primary" style="margin-right: 12px" @click="encrypt">加密</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="decrypt">解密</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="clear">清空</a-button>
        </div>
        <a-textarea v-model:value="target" :rows="10" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped lang="less">
.btns {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}
</style>
