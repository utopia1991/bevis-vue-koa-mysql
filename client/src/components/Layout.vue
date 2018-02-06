<style scoped lang="scss">
  @import "../assets/scss/Layout.scss";
</style>

<template>
  <el-row class="container">
    <!-- 头部导航菜单 -->
    <Top :routes='permission_routers' :userName='user_name'></Top>
    <!-- 中间内容 -->
    <el-col :span="24" class="main">
      <!--导航菜单-->
      <el-col :span="4" :class="[show ? 'collapsemenu' : 'extendmenu', 'aside']">
        <el-menu :default-active="$route.path" class="aside-menu" router unique-opened>
          <Sidenav :routes='side_routers'></Sidenav>
        </el-menu>
      </el-col>
      <span class="extend-bar" @click="show = !show" v-show="show">
        <i class="icon-extend"></i>
      </span>
      <span class="collapse-bar" @click="show = !show" v-show="!show">
        <i class="icon-collapse"></i>
      </span>
      <!-- 页面主体部分 -->
      <el-col :span="20" class="content-container">
        <Mainbody></Mainbody>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import Top from '@/components/Top'
  import Sidenav from '@/components/Sidenav'
  import Mainbody from '@/components/Mainbody'
  import _ from 'lodash'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      Top,
      Sidenav,
      Mainbody
    },
    data: () => ({
      show: true
    }),
    computed: {
      ...mapGetters([
        'permission_routers',
        'user_name'
      ]),
      'side_routers': function () {
        let a = this.$store.getters.permission_routers
        let b = this.$route.path.split('/')[1]
        let c = _.find(a, ['url', '/' + b])
        return c.children
      }
    }
  }
</script>
