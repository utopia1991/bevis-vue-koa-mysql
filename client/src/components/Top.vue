<style scoped lang="scss">
  @import "../assets/scss/Layout.scss";
</style>

<template>
  <el-col :span="24" class="header">
    <el-col :span="4" class="logo logo-width"></el-col>
    <el-col :span="20" class="userinfo">
      <nav class="menu-nav">
        <template v-for="route in routes">
          <router-link :to="route.url" class="menu-items" v-if='route.children.length > 0'>
            {{route.cnName}}
          </router-link>
          <a target="_blank" :href='route.url'  class="menu-items" v-else>
            {{route.cnName}}
          </a>
        </template>
      </nav>
      <el-dropdown trigger="click" class="username">
        <span class="el-dropdown-link userinfo-inner">
          {{userName}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom-end">
        <span @click.native="logout" class="logout">
          <i class="icon-logout"></i> 退出
        </span>
      </el-tooltip>
    </el-col>
  </el-col>
</template>

<script>
  export default {
    props: {
      routes: {
        type: Array
      },
      userName: String
    },
    data () {
      return {
        activeIndex: '1'
      }
    },
    methods: {
      // 退出登录
      logout: function () {
        var _this = this
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('user')
          _this.$router.push('/login')
        }).catch((err) => {
          console.log('错误：', err)
        })
      }
    }
  }
</script>
