<style lang="scss" scoped>
  @import "../assets/scss/404.scss";
</style>

<template>
  <div class="bg-404">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" :src="img_404" alt="404">
        <img class="pic-404__child left" :src="img_404_cloud" alt="404">
        <img class="pic-404__child mid" :src="img_404_cloud" alt="404">
        <img class="pic-404__child right" :src="img_404_cloud" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
        <router-link to="/" class="bullshit__return-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import img_404 from '../assets/images/error/404.png'
  import img_404_cloud from '../assets/images/error/404_cloud.png'

  export default {
    data () {
      return {
        img_404,
        img_404_cloud
      }
    },
    computed: {
      message () {
        return '该页面没找到......'
      }
    }
  }
</script>
