<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { chat } from './api/openai'

const chatContent: {
  role: string,
  msg: string
}[] = reactive([])

const msg: Ref<string> = ref('')
const key: Ref<string> = ref(location.search.replace('?key=', ''))
const contentBoxRef = ref({} as HTMLTextAreaElement)
const disableInput = ref(false)

async function handleSendMsg() {
  const message = msg.value
  let contextStartIdx = 0
  if (chatContent.length > 10) {
    contextStartIdx = chatContent.length - 10
  }
  chatContent.push({
    role: 'Q',
    msg: message
  })
  const context = chatContent.slice(
    contextStartIdx,
    chatContent.length
  )
  .map(item=> `${item.role}:${item.msg}`)
  .join('\n')
  chatContent.push({
    role: 'A',
    msg: '思考中....'
  })
  msg.value = ''
  disableInput.value = true
  const reply = await chat(context, key.value)
  chatContent.pop()
  chatContent.push({
    role: 'A',
    msg: reply as string
  })
  disableInput.value = false
  contentBoxRef.value.scrollTop = contentBoxRef.value.scrollHeight
}

</script>

<template>
  <div class="container">
    <h1>GPT3 在线演示</h1>
    <div style="margin-bottom: 15px;">
      <label for="">Key:</label>
      <input v-model="key" type="text" placeholder="请输入Key...">
    </div>
    <div ref="contentBoxRef" class="content-box" readonly>
      <template
      v-for="item of chatContent">
      <div
      :class="item.role==='bot' ? 'red' : 'blue'">
        {{ item.role }}：{{ item.msg }}
      </div>
    </template>  
    </div>
    <div class="input-box">
      <textarea
      v-model="msg"
      :disabled="disableInput"
      rows="3"
      class="input-box-inner"
      placeholder="请输入想问ChatGPT的问题"
      @keypress.enter.prevent="handleSendMsg"></textarea>
      <button class="input-btn"
      @click="handleSendMsg">发送消息</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content-box {
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  text-align: left;
  padding: 0px 5px;
  border: 1px solid rgb(200,200,200);
  font-size: 1rem;
  overflow-y: scroll;
  word-break: break-all;
}
.content-box::-webkit-scrollbar, .input-box-inner::-webkit-scrollbar {
  width: 4px;
}
.content-box::-webkit-scrollbar-thumb, 
.input-box-inner::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 6px;
}
.input-box {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  border: 1px solid rgb(200,200,200);
  padding: 5px;
}
.input-box-inner {
  font-size: 1rem;
  outline: none;
  border: none;
  width: 100%;
  box-sizing: border-box;
}
.input-box-inner:disabled {
  background: transparent;
}
.input-btn {
  float: right;
  margin-top: 5px;
  padding: 6px 12px;
  border: none;
  background-color: rgb(30,111,255);
  color: #fff;
}

:deep(.blue) {
  color: blue;
}

:deep(.red) {
  color: red;
}
</style>
