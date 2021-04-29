<template>
  <div class="comment-container">
    <el-card class="box-card">
    <!-- 头部 -->
    <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <!-- 评论数据表格 -->
     <el-table
      stripe
      :data="comments"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数"
        width="auto"
         >
      </el-table-column>
      <el-table-column
        width="auto"
        label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.comment_status === true ? '正常' : '关闭'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
        <el-switch
        v-model="scope.row.comment_status"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="onChange(scope.row.id ,scope.row.comment_status)"
        >
        </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器完整功能 -->
    <el-pagination
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pagesizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
</el-card>
  </div>
</template>

<script>
import { getComments, changeCommentStatus } from '@/api/comment'
import JSONbig from 'json-bigint'
export default {
  name: 'commentIndex',
  components: {},
  props: {},
  data () {
    return {
      // 评论数据列表
      comments: [],
      page: 1, // 当前的页码
      pagesizes: 10, // 当前每页展示的条数
      totalCount: 0 // 总数目条数
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadComments(this.page)
  },
  mounted () {},
  methods: {
    // 获取评论
    loadComments () {
      getComments({
        response_type: 'comment', // 获取评论数据
        page: this.page, // 默认获取第一页的数据
        per_page: this.pagesizes // 每页获取的条数
      }).then(res => {
        // 存储到data数据中
        this.comments = res.data.data.results
        this.totalCount = res.data.data.total_count
        // console.log(res)
      })
    },
    // 评论功能
    onChange (articleId, allowComment) {
      const articleIdd = JSONbig.stringify(articleId)
      // console.log(articleIdd, allowComment)
      // 发请求修改状态
      changeCommentStatus(articleIdd, allowComment).then(res => {
        // console.log(res)
        if (res.data.data.allow_comment) {
          this.$message({
            message: '开启评论功能成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '关闭评论功能成功',
            type: 'error'
          }).catch(error => {
            console.log(error)
            this.$message({
              message: '操作失败',
              type: 'warining'
            })
          })
        }
      })
    },
    handleSizeChange (val) {
      // 更新每页获取的数据
      this.pagesizes = val
      // 从第一页获取数据
      this.page = 1
      // 获取数据
      this.loadComments()
    },
    handleCurrentChange (val) {
      this.page = val
      // 获取数据
      this.loadComments()
    }
  }
}
</script>

<style scoped lang="less">
.pagination {
    margin-top: 25px;
}
</style>
