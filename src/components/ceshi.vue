<template>
  <div class="cehsi-container">
      <div id="test"></div>
      <button @click="sendRequest">点击发送请求</button>
  </div>
</template>

<script>
export default {
  name: 'testIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    sendRequest () {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function (res) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const text = res.currentTarget.responseText
          var testDiv = document.getElementById('test')
          testDiv.innerHTML = text
        }
      }
      xhr.open('GET', '/api/', true)
      xhr.send()
    }
  }
}
</script>

<style scoped lang="less"></style>
