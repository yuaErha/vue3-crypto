<script setup lang="ts">
import { arrayBufferToBase64, base64ToUint8Array, buf2str, str2buf } from '@/utils/crypto'
import { reactive, ref } from 'vue'

const title = 'RSA'
const activeKey = ref('1')

type KeyLength = 1024 | 2048 | 4096

const data = reactive<{
  publicKey: string
  privateKey: string
  keyLength: KeyLength
}>({
  publicKey: '',
  privateKey: '',
  keyLength: 2048
})
const publicData = reactive<{
  publicKey: string
  encryptStr: string
  result: string
}>({
  publicKey: '',
  encryptStr: '',
  result: ''
})
const privateData = reactive<{
  privateKey: string
  decryptStr: string
  result: string
}>({
  privateKey: '',
  decryptStr: '',
  result: ''
})

const encrypt = async () => {
  const pem = publicData.publicKey
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\n/g, '')

  const publicKey = await window.crypto.subtle.importKey(
    'spki',
    base64ToUint8Array(pem),
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' }
    },
    false,
    ['encrypt']
  )

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    publicKey,
    str2buf(publicData.encryptStr)
  )

  publicData.result = arrayBufferToBase64(encrypted)
}
const decrypt = async () => {
  const pem = privateData.privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '')

  const privateKey = await window.crypto.subtle.importKey(
    'pkcs8',
    base64ToUint8Array(pem),
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' }
    },
    false,
    ['decrypt']
  )

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    privateKey, // from generateKey or importKey above
    base64ToUint8Array(privateData.decryptStr) // ArrayBuffer of the data
  )
  privateData.result = buf2str(decrypted)
}
const clear = (obj: { [props: string]: string }) =>
  Reflect.ownKeys(obj).forEach((key) => (obj[key as string] = ''))

const generateKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: data.keyLength, // can be 1024, 2048, or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' } // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] // must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
  )

  const privateKey = arrayBufferToBase64(
    await window.crypto.subtle.exportKey(
      'pkcs8', // can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      key.privateKey as CryptoKey // can be a publicKey or privateKey, as long as extractable was true
    )
  )
  const publicKey = arrayBufferToBase64(
    await window.crypto.subtle.exportKey(
      'spki', // can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      key.publicKey as CryptoKey // can be a publicKey or privateKey, as long as extractable was true
    )
  )

  let index = 0
  let str = '-----BEGIN PRIVATE KEY-----\n'
  while (index < privateKey.length) {
    str += privateKey.slice(index, (index += 64)) + '\n'
  }
  str += '-----END PRIVATE KEY-----'
  data.privateKey = str

  index = 0
  str = '-----BEGIN PUBLIC KEY-----\n'
  while (index < publicKey.length) {
    str += publicKey.slice(index, (index += 64)) + '\n'
  }
  str += '-----END PUBLIC KEY-----'
  data.publicKey = str
}

const copy = async (str: string) => {
  await navigator.clipboard.writeText(str)
}
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-tabs v-model:activeKey="activeKey" :animated="false">
      <a-tab-pane key="1" tab="生成密钥">
        <div class="mode" style="margin-bottom: 16px">
          <a-input-group compact>
            <a-input style="width: 80px" disabled default-value="密钥长度" />
            <a-select v-model:value="data.keyLength" style="min-width: 100px">
              <a-select-option :value="1024">1024 bit</a-select-option>
              <a-select-option :value="2048">2048 bit</a-select-option>
              <a-select-option :value="4096">4096 bit</a-select-option>
            </a-select>
            <a-button type="primary" @click="generateKey">生成密钥</a-button>
          </a-input-group>
        </div>
        <a-space direction="horizontal">
          <a-typography-text>私钥</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(data.privateKey)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="data.privateKey"
          :rows="10"
          style="margin: 4px 0 12px 0"
          spellcheck="false"
        />
        <a-space direction="horizontal">
          <a-typography-text>公钥</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(data.publicKey)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="data.publicKey"
          :rows="10"
          style="margin: 4px 0 12px 0"
          spellcheck="false"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="公钥加密">
        <a-space direction="horizontal">
          <a-typography-text>公钥</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(publicData.publicKey)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="publicData.publicKey"
          :rows="10"
          spellcheck="false"
          style="margin: 4px 0 12px 0"
        />
        <a-space direction="horizontal">
          <a-typography-text>加密字符串</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(publicData.encryptStr)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="publicData.encryptStr"
          :rows="6"
          spellcheck="false"
          style="margin: 4px 0 12px 0"
        />
        <a-space direction="horizontal">
          <a-typography-text>加密结果</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(publicData.result)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="publicData.result"
          :rows="6"
          spellcheck="false"
          style="margin: 4px 0 12px 0"
        />
        <div class="btns">
          <a-button type="primary" style="margin-right: 12px" @click="encrypt">加密</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="clear(publicData)"
            >清空</a-button
          >
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="私钥解密">
        <a-space direction="horizontal">
          <a-typography-text>私钥</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(privateData.privateKey)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="privateData.privateKey"
          :rows="10"
          spellcheck="false"
          style="margin: 4px 0 12px 0"
        />
        <a-space direction="horizontal">
          <a-typography-text>解密字符串</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(privateData.decryptStr)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="privateData.decryptStr"
          :rows="6"
          spellcheck="false"
          style="margin: 4px 0 12px 0"
        />
        <a-space direction="horizontal">
          <a-typography-text>解密结果</a-typography-text>
          <a-typography-link href="#" type="secondary" @click="copy(privateData.result)">
            复制
          </a-typography-link>
        </a-space>
        <a-textarea
          v-model:value="privateData.result"
          :rows="6"
          spellcheck="false"
          style="margin: 4px 0 12px 0"
        />
        <div class="btns">
          <a-button type="primary" style="margin-right: 12px" @click="decrypt">解密</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="clear(privateData)"
            >清空</a-button
          >
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped lang="less">
.container {
  :deep(textarea.ant-input) {
    // text-indent: -0.5rem;
    font-family: Monaco;
    font-size: 0.8rem;
  }
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
}
</style>
