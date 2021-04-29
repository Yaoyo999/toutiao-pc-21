<template>
   <el-menu
      :collapse="collapse"
      class="menu"
      router
      :default-active="$route.path"
      background-color="#002033"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/">
        <i class="iconfont iconiconsy_active"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="iconfont icontext"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="iconfont iconimage"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="iconfont iconpublish"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="iconfont iconCommentquantity"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="iconfont icongift"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/setting">
        <i class="iconfont iconsafe-menu-settting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  name: 'appNav',
  components: {},
  props: {
    collapse: {
      isRequired: true,
      type: Boolean
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
.menu {
    .iconfont {
        margin-right: 10px;
        font-size: 14px;
        padding-left: 5px;
    }
}
</style>
