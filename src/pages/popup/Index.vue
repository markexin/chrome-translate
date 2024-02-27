<template>
  <div>
    <div v-if="!hasKey" class="translate-form">
      <input v-model="key" placeholder="请添加OpenAI Key" />
      <button @click="storeKey">确认</button>
    </div>
    <div v-else>
      <h2>已添加 OpenAI Key</h2>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      hasKey: false,
      key: ''
    }
  },
  methods: {
    storeKey () {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        messageType: 'key',
        text: this.key
      },
      function (res) {
        alert(res)
      })
    }
  }
}
</script>

<style>
.translate-form {
  display: flex;
}
.translate-form button {
  width: 100px;
}
</style>
