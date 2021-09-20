<script setup lang="ts">
import { ref } from 'vue'

const title = 'Aes'
const input = ref('')

// window.crypto.subtle.generateKey
const key = ref('')
const textEncoding = ref('Base64')
const mode = ref('CBC')
// const textEncoding = ref('Base64')
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-textarea v-model:value="input" placeholder="吃了吗" :rows="10" style="margin-bottom: 16px" />

    <div class="mode" style="margin-bottom: 16px">
      <a-input-group compact>
        <a-input style="width: 54px" disabled default-value="模式" />
        <a-select v-model:value="mode">
          <a-select-option value="CBC">CBC</a-select-option>
          <a-select-option value="Jiangsu">Jiangsu</a-select-option>
        </a-select>
        <a-input style="width: 54px" disabled default-value="填充" />
        <a-select v-model:value="value3" style="min-width: 100px">
          <a-select-option value="Zhejiang">Zhejiang</a-select-option>
          <a-select-option value="Jiangsu">Jiangsu</a-select-option>
        </a-select>
        <a-input style="width: 54px" disabled default-value="偏移" />
        <a-input v-model:value="value4" />
      </a-input-group>
      <!-- <a-input-group compact style="margin-top: 16px">
        <a-input style="width: 54px" disabled default-value="偏移" />
        <a-input v-model:value="value4" />
      </a-input-group> -->
      <a-input-group compact style="margin-top: 16px">
        <a-input style="width: 54px" disabled default-value="秘钥" />
        <a-input v-model:value="key" style="width: 100%" />
        <a-input style="width: 54px" disabled default-value="编码" />
        <a-select v-model:value="textEncoding" style="min-width: 100px">
          <a-select-option value="Base64">Base64</a-select-option>
          <a-select-option value="HEX">HEX</a-select-option>
        </a-select>
      </a-input-group>
    </div>
    <a-textarea v-model:value="input" placeholder="" :rows="10" style="margin-bottom: 16px" />
    <a-button type="primary" style="margin-right: 6px">加密</a-button>
    <a-button type="primary" style="margin-right: 6px">解密</a-button>
    <a-button type="primary" style="margin-right: 6px">清空</a-button>
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
