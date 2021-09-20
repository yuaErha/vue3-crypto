<script setup lang="ts">
import { ref } from 'vue'
interface FileItem {
  uid: string
  name?: string
  status?: string
  size?: number
  type?: string
  percent?: number
  originFileObj?: File
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}
const title = 'Base64'
const activeKey = ref('1')
const result = ref('')
const fileList = ref([])
const decodeVal = ref('')
const encodeVal = ref('')

const encodeBase64 = () => {
  encodeVal.value = window.btoa(decodeVal.value)
}

const decodeBase64 = () => {
  decodeVal.value = window.atob(encodeVal.value)
}
const clear = () => {
  decodeVal.value = ''
  encodeVal.value = ''
}
const uploadChange = (fileInfo: FileInfo) => {
  if (fileInfo.file.status === 'removed') {
    result.value = ''
    return
  }
  // if (fileInfo.file.status === 'done') {
  if (fileInfo.file.percent === 100) {
    fileInfo.fileList.length = 0
    fileInfo.file.status = 'done'
    fileInfo.fileList.push(fileInfo.file)
  }
}

const customRequest = (options: { file: File; onProgress: Function }) => {
  const fileReader = new FileReader()
  fileReader.onload = (event) => {
    options.onProgress({ percent: 100 })
    result.value = fileReader.result as string
  }
  fileReader.readAsDataURL(options.file)

  // const oReq = new XMLHttpRequest()
  // oReq.addEventListener('load', () => options.onSuccess({ code: 200 }, oReq))
  // oReq.open('GET', 'http://localhost:3000')
  // oReq.send()
  // const xhr = new window.XMLHttpRequest()
  // cc()
}
</script>

<template>
  <div class="container">
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-tabs v-model:activeKey="activeKey" :animated="false">
      <a-tab-pane key="1" tab="文本">
        <a-textarea v-model:value="decodeVal" :rows="10" />
        <div class="btns">
          <a-button type="primary" style="margin-right: 12px" @click="encodeBase64">编码</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="decodeBase64">解码</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="clear">清空</a-button>
        </div>
        <a-textarea v-model:value="encodeVal" :rows="10" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="文件">
        <a-upload-dragger
          v-model:fileList="fileList"
          :custom-request="customRequest"
          @remove="fileList.length = 0"
          @change="uploadChange"
        >
          <p class="ant-upload-hint">点击或拖动文件到此处上传</p>
        </a-upload-dragger>
        <a-textarea v-model:value="result" :rows="16" style="margin-top: 16px" />
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
