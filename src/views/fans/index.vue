<template>
  <div class="fans-container">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
</el-breadcrumb>
    </div>
<!-- tab选项卡 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="粉丝列表" name="first">
        <!-- <el-row>
            <el-col v-for="o in 20" :key="o" :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
                <div class="fansImage-container">
                    <img
                    src="http://toutiao-img.itheima.net/Fl-AkD-mEffqqpERZ6CCBP8YWTCa"
                    class="fans-image"
                    alt="fans"
                    >
                    <p class="fans-name">name</p>
                     <el-button type="primary" size="mini">关注</el-button>
                </div>
            </el-col>
        </el-row> --><el-row>
        <el-col v-for="(fan, index) in fans" :key="index" :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
            <div class="fansImage-container">
                <img
                src="http://toutiao-img.itheima.net/FgCnGuLJs1V_M-ixujuMjOIXRXLt"
                class="fans-image"
                alt="fans"
                >
                <p class="fans-name">{{fan.name}}</p>
                  <el-button :type="isFans ? 'info': 'primary'" size="mini" @click="fansAdd">关注</el-button>
            </div>
        </el-col>
    </el-row>
    </el-tab-pane>
    <el-tab-pane label="粉丝图表" name="second">
      <div class="echarts-wrap" ref="echarts"></div>
      <echartsDemo></echartsDemo>
      <b-map></b-map>
    </el-tab-pane>
  </el-tabs>
</el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import echartsDemo from './components/echart-demo'
import BMap from './components/bMap.vue'
import { getFansList } from '@/api/fans'
export default {
  name: 'fansIndex',
  components: {
    echartsDemo,
    BMap
  },
  props: {},
  data () {
    return {
      activeName: 'first',
      fans: [], // 粉丝数据列表
      fansLoading: false, // 按钮状态
      isFans: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始化粉丝列表
    this.loadFansLists()
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.echarts)
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 获取粉列表的函数
    loadFansLists () {
      getFansList().then(res => {
        // 数据列表
        this.fans = res.data.data.results
      })
    },
    // 关注
    fansAdd () {
      // 开启loading状态
      this.fansLoading = true
      // 发请求关注
      this.isFans = !this.isFans
      this.$message({
        message: this.isFans === true ? '关注成功' : '已取消关注',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped lang="less">
.fansImage-container {
    padding: 7px 0 7px 0;
    width: 150px;
    height: 210px;
    text-align: center;
    border: 1px solid rgb(245, 235, 235);
    box-shadow: 10px 10px 20px #eee;
    overflow: hidden;
    box-sizing: border-box;
    margin-bottom: 10px;
    .fans-name {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
    }
    .el-button {
        outline: none;
        border: none;
    }
    .fans-image {
      width: 135px;
      height: 135px;
      border-radius: 50%;
    }
}
.echarts-wrap {
      width: 600px;
      height: 400px;
      border: 1px solid black;
    }
</style>
