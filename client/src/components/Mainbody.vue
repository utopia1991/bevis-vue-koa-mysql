<style scoped lang="scss">
  @import "../assets/scss/Layout.scss";
</style>

<template>
  <el-col :span="24" class="content-wrapper">
    <p class="content-title">
      <span class="content-title-logo">
        <i class="icon-title"></i>
      </span>
      <span class="content-title-name">
        {{$route.name}}
      </span>
    </p>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-col>
</template>

<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
