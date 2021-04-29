<template>
  <div class="publish-container">
      <el-card class="box-card">
          <!-- 面包屑 -->
        <div slot="header" class="clearfix">
           <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发布文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      <!-- 表单 -->
    <el-form ref="publishForm" :model="article" label-width="60px" :rules="Rules">
  <el-form-item label="标题" prop="title">
    <el-input v-model="article.title"></el-input>
  </el-form-item>
    <el-form-item label="内容" prop="content">
    <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
    <el-tiptap :extensions="extensions" v-model="article.content" lang="zh" height="400"/>
  </el-form-item>
    <el-form-item label="封面">
    <el-radio-group v-model="article.cover.type">
      <el-radio :label="1">单图</el-radio>
      <el-radio :label="3">三图</el-radio>
      <el-radio :label="0">无图</el-radio>
      <el-radio :label="-1">自动</el-radio>
    </el-radio-group>
    <!-- 注意：我们需要判断是否是单图或者是三图的情况下进行遍历，但是v-if和v-for不要写在一个节点下
    所以我们套一个template节点在该节点不会被渲染
    这里的key就是index 代表第几个cover触发了
    -->
    <!--
      当你给子组件提供的数据既要使用，又要修改，这个时候我们可以使用v-model简化数据绑定能避免某些问题
          v-model="article.cover.images[index]"
          给子组件传递了一个叫value得数据
          :value="article.cover.images[index]"
          默认监听input事件，当事件发生时，它会让绑定数据=事件参数
          @input=""article.cover.images[index] = $event"
    -->
    <template v-if="article.cover.type > 0">
      <!-- <Cover
      v-for="(cover,index) in article.cover.type"
      :key="index"
      :cover-image="article.cover.images[index]"
      @coverUrl="updateUrl(index, $event)"
      ></Cover> -->
      <Cover
      v-for="(cover,index) in article.cover.type"
      :key="index"
      v-model="article.cover.images[index]"
      >
      </Cover>
    </template>
  </el-form-item>
  <el-form-item label="频道" prop="channel_id">
    <el-select v-model="article.channel_id" placeholder="请选择频道">
      <el-option
       :label="channel.name"
       :value="channel.id"
       v-for="(channel,index) in channels"
       :key="index"
        ></el-option>
    </el-select>
  </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="onPublish(false)">发表</el-button>
    <el-button @click="onPublish(true)">存入草稿</el-button>
  </el-form-item>
</el-form>
</el-card>
  </div>
</template>

<script>
import { getChannels, getAddArticle, getArticle, updateArticle, uploadImage } from '@/api/articles.js'
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading, // 标题
  Bold, // 加粗
  Underline, // 下划线
  Italic, // 斜体
  Strike, //
  ListItem, // 无序和有序的基础
  BulletList, // 无序列表
  OrderedList, // 有序列表
  Image, // 图片上传
  TodoItem,
  TodoList, // todo列表
  TextColor, // 文本颜色
  Preview, // 预览
  Fullscreen, // 全屏
  CodeBlock // 代码块，文本块
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import Cover from './component/cover.vue'
export default {
  name: 'publishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    Cover
  },
  props: {},
  data () {
    return {
      channels: [], // 频道数据列表
      // 收集表单数据
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        // 封面
        cover: {
          type: 1, // 封面类型 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 图片的路径
        },
        channel_id: null // 文章所属的id
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new Image({
          uploadRequest (file) {
            // 这个内置函数接受一个参数，参数是file上传的图片对象
            const fd = new FormData()
            // 封装body参数一起传给data和设置multipart/form-data请求头
            fd.append('image', file)
            // 调用接口函数上传图片至服务器
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
            // return的是图片上传值服务后存储在服务器的地址(自己return什么返回得图片的路径就是什么)
          }
        }),
        new CodeBlock(),
        new ListItem(),
        new TodoItem(),
        new BulletList(),
        new OrderedList(),
        new TodoList(),
        new Preview(),
        new TextColor(),
        new Fullscreen()
      ],
      // 表单验证
      Rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 15, message: '标题长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator: function (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('文章内容不能为空'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 判断是否带有参数id如果有就加载请求获取当前的文章展示
    const articleId = this.$route.query.id
    if (articleId) {
      this.loadArticle(articleId)
    }
  },
  mounted () {},
  methods: {
    // 如果有路径参数点击更新文章，如果没有点击发送请求发布文章
    onPublish (draft) {
      const articleId = this.$route.query.id
      // 手动验证表单
      this.$refs.publishForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          if (articleId) {
            // 调用接口更新文章
            updateArticle(this.article, articleId, draft).then(res => {
              if (draft) {
                this.$message({
                  message: '存入草稿成功',
                  type: 'success'
                })
                // 跳转到内容管理页面
                this.$router.push('/article')
              } else {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                // 跳转到内容管理页面
                this.$router.push('/article')
              }
            })
          } else {
            // 调用接口发布文章
            getAddArticle(this.article, draft).then(res => {
            // 清空article数据对象
              this.article.title = ''
              this.article.content = ''
              this.article.channel_id = null
              console.log(res)
              if (draft) {
              // 存为草稿
                this.$message({
                  message: '存入草稿成功',
                  type: 'success'
                })
                // 跳转到内容管理页面
                this.$router.push('/article')
              } else {
                // 非草稿状态
                this.$message({
                  type: 'success',
                  message: '发布成功'
                })
                // 跳转到内容管理页面
                this.$router.push('/article')
              }
            })
          }
        }
      })
    },
    // 加载获取频道列表
    loadChannels () {
      // 发送请求
      getChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 请求获取需要编辑的文章
    loadArticle (articleId) {
      // 发请求获取指定文章
      getArticle(articleId).then(res => {
        // console.log(res)
        this.article = res.data.data
      })
      // console.log(1)
    },
    // 将子组件传递过来的url存储到article.cover.images中
    // 如果是传递的三张图片应该每个组件一张并且顺序是点击组件的顺序来传
    //  所以我们还需要当前组件的索引，当接受两个参数的时候，我们可以用$event来接收子组件
    // 传递过来的值
    updateUrl (index, url) {
      // console.log(index)
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped lang="less"></style>
