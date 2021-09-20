<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface tag {
  type: string
  name: string
  path: string
  checked: boolean
}
const router = useRouter()
const route = useRoute()

const tags = reactive<tag[]>([
  {
    type: 'hash',
    name: 'Sha',
    path: '/sha',
    checked: false
  },
  {
    type: 'hash',
    name: 'MD5',
    path: '/md5',
    checked: false
  },
  {
    type: 'hash',
    name: 'Base64',
    path: '/base64',
    checked: false
  },
  {
    type: 'crypto',
    name: 'AES',
    path: '/aes',
    checked: false
  },
  {
    type: 'crypto',
    name: 'DES',
    path: '/des',
    checked: false
  },
  {
    type: 'crypto',
    name: 'RSA',
    path: '/rsa',
    checked: false
  }
])

tags.some((item) => (item.checked = '/tools' + item.path === route.path))

const hashs = computed(() => tags.filter((item) => item.type === 'hash'))
const cryptoes = computed(() => tags.filter((item) => item.type === 'crypto'))
const handleChange = (name: string) => {
  let path = ''
  tags.forEach((item) => {
    if (item.name === name) {
      item.checked = true
      path = item.path
    } else {
      item.checked = false
    }
  })
  router.push('/tools' + path)
}
</script>

<template>
  <div id="container">
    <header>header</header>
    <div class="body">
      <div>
        <div class="nav">
          <div class="hash">
            <a-typography-text strong>Hash</a-typography-text>
            <div class="tags">
              <a-checkable-tag
                v-for="item of hashs"
                :key="item.name"
                v-model:checked="item.checked"
                @change="handleChange(item.name)"
                >{{ item.name }}</a-checkable-tag
              >
            </div>
          </div>
          <div class="crypto">
            <a-typography-text strong>加解密</a-typography-text>
            <div class="tags">
              <a-checkable-tag
                v-for="item of cryptoes"
                :key="item.name"
                v-model:checked="item.checked"
                @change="handleChange(item.name)"
                >{{ item.name }}</a-checkable-tag
              >
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="box">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <footer>footer</footer>
  </div>
</template>

<style scoped lang="less">
#container {
  --primary: #3498db;
  --warn: #e67e22;
  --error: #e74c3c;
  --state: flex;

  @media screen and (max-width: 812px) {
    --state: none;
  }

  // min-width: 728px;
  width: stretch;
  height: 100%;

  display: grid;
  grid-template-rows: auto 1fr auto;
  // grid-template-columns: auto;
  // background-color: #34495e;
  header {
    background-color: var(--primary);
  }
  .body {
    width: 100%;
    height: 100%;
    display: flex;
    & > div:first-child {
      flex: 2;
      display: var(--state);
      justify-content: flex-end;
      // align-items: flex-start;

      .nav {
        display: flex;
        flex-direction: column;
        margin-top: 50px;

        & > div {
          display: flex;
          margin-top: 20px;
          :deep(.ant-typography) strong {
            display: block;
            width: 60px;
            text-align: right;
            padding-right: 10px;
            margin-right: 10px;
            border-right: 2px solid #cccccc;
          }
        }
      }
    }
    & > div:last-child {
      flex: 4;
      display: flex;
      justify-content: center;
      align-items: center;
      .box {
        width: 100%;
        height: 100%;
        padding: 20px;
        // background-color: #e74c3c;
      }
    }
  }

  footer {
    background-color: var(--error);
  }
}
</style>
