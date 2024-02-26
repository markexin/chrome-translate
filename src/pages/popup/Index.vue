<template>
  <div>
    <div v-if="!hasKey" class="translate-form">
      <input placeholder="请添加OpenAI Key" />
      <button>确认</button>
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
      hasKey: false
    }
  },
  components: {
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
