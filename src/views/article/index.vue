<template>
  <div class="article-container">
    <el-card class="fileter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option :label="channel.name" :value="channel.id" v-for="(channel,index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="changeDate"
            type="datetimerange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCheckArticles" :loading="loading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
     <el-card>
      <div slot="header" class="clearfix">
    根据筛选条件共查询到{{totalCount}}条数据
      </div>
      <!-- 数据列表 -->
    <el-table stripe :data="articles" style="width: 100%" size="mini" class="table-list" v-loading="loading">
      <el-table-column label="封面">
        <template slot-scope="scope">
           <!-- <el-image
            lazy
            style="width: 100px; height: 100px"
            :src="scope.row.cover.images[0]"
            :fit="cover"></el-image> -->
          <img v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="" class="cover-image">
          <img v-else src="./no-cover.gif" alt="" class="cover-image">
          <!-- 下面的写法不会生效是在运行期间动态改变处理的，
          而本地图片必须在打包的时候就存在 下面这种情况是在打包之前不存在，所以渲染不起
          因为这种情况
           -->
          <!-- <img :src="scope.row.cover.images[0] || './no-cover.gif'" alt="" class="cover-image"> -->
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!-- <el-tag v-if="scope.row.status===0" type="warning">草稿</el-tag>
          <el-tag v-else-if="scope.row.status===1" type="primary">待审核</el-tag>
          <el-tag v-else-if="scope.row.status===2" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.status===3" type="danger">审核失败</el-tag>
          <el-tag v-else-if="scope.row.status===4" type="info">已删除</el-tag> -->
          <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="$router.push('/publish?id'+ '=' + scope.row.id)"
          ></el-button>
          <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="deleteArticle(scope.row.id)"
           ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!--current-change组件自定义事件会接收一个参数，返回当前页的页码  -->
    <el-pagination
    :current-page.sync="page"
    :disabled="loading"
    background layout="prev, pager, next"
    :total="totalCount"
    :page-size="pageSizes"
    @current-change='onCurrentPage'>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getChannels, getDeleteArticle } from '@/api/articles'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [ // 状态类型数组
        { status: 0, type: '', text: '草稿' },
        { status: 1, type: 'warning', text: '待审核' },
        { status: 2, type: 'success', text: '审核成功' },
        { status: 3, type: 'danger', text: '审核失败' },
        { status: 4, type: 'info', text: '已删除' }
      ],
      totalCount: 0, // 全部文章的条数
      pageSizes: 10, // 每页展示的条数
      status: null, // 不传默认显示全部文章数据
      channels: [], // 频道数据列表
      channelId: null, // 频道id ，默认值为null就是不传 默认请求全部
      changeDate: null, // 选择的日期(有值)为一个数组，第一个值为起始日期 第二个值为结束日期(初始值设定为null)
      loading: false, // 设置表格数据的加载状态，默认为false
      page: 1 // 当前页的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始化loading状态
    this.loading = true
    // 初始化调用传递page 1的页码，获取数据
    this.loadArticles()
    // 初始化调用获取频道列表
    this.loadChannels()
  },
  mounted () {},
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        status: this.status,
        channel_id: this.channelId,
        per_page: this.pageSizes,
        // 点击组件清空之后 changeDate的值变为null null[0] 会报错 所以我们需要判断一下changeDate的值
        // 有值就传没值就不传为null
        begin_pubdate: this.changeDate ? this.changeDate[0] : null,
        end_pubdate: this.changeDate ? this.changeDate[1] : null
      }).then(res => {
        // 将请求返回的数据存储到组件数据中
        this.articles = res.data.data.results
        const { total_count: totalCount } = res.data.data
        this.totalCount = totalCount
        // console.log(res.data.data)
        this.loading = false
      })
    },
    onCurrentPage (page) {
    // 拿到页码，点击分页器获取对应页的数据
      this.loadArticles(page)
    },
    // 监听单选框的变化，状态status发生变化，就发请求请求数据
    onCheckArticles () {
      this.loadArticles()
    },
    // 获取频道列表
    loadChannels () {
      getChannels().then(res => {
        const { channels } = res.data.data
        this.channels = channels
        // console.log(channels)
      })
    },
    // 删除文章
    deleteArticle (articleId) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发请求删除数据
        getDeleteArticle(articleId.toString()).then(res => {
          console.log(res, articleId)
          // 刷新数据，更新视图
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.fileter-card {
  margin-bottom: 30px;
}
.table-list {
  margin-bottom: 20px;
}
.cover-image {
  width: 88px;
}
</style>
