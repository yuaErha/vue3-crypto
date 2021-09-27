<script setup lang="ts">
import MD5 from 'crypto-js/md5'
import Latin1 from 'crypto-js/enc-latin1'
import { ref } from 'vue'

const title = 'MD5'

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

const activeKey = ref('1')
const textRet = ref('')
const fileRet = ref('')
const fileList = ref([])

const input = ref('')

const encodeMd5 = () => {
  textRet.value = MD5(input.value).toString()
}

const clear = () => {
  textRet.value = ''
  input.value = ''
}
const uploadChange = (fileInfo: FileInfo) => {
  if (fileInfo.file.status === 'removed') {
    fileRet.value = ''
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

    fileRet.value = MD5(Latin1.parse(fileReader.result as string)).toString()
  }
  fileReader.readAsBinaryString(options.file)

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
        <a-textarea v-model:value="input" :rows="10" />
        <Md5-Ret :result="textRet"></Md5-Ret>
        <div class="btns" style="margin-top: 16px">
          <a-button type="primary" style="margin-right: 12px" @click="encodeMd5">编码</a-button>
          <a-button type="primary" style="margin-right: 12px" @click="clear">清空</a-button>
        </div>
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
        <Md5-Ret :result="fileRet"></Md5-Ret>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped lang="less"></style>
