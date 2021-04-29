<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: 'bmapIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // 注意BMP是全局包里面的我们需要通过window来调用
    var map = new window.BMap.Map('container')// 创建地图实例
    var point = new window.BMap.Point(116.404, 39.915)// 创建点坐标
    map.centerAndZoom(point, 15)// 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
  },
  methods: {}
}
</script>

<style scoped lang="less">
#container {
  height: 400px;
  width: 600px;
  border: 1px solid #000;
}
</style>
