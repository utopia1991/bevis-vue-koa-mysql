<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;

    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;

      li {
        padding-bottom: 5px;
      }

      a {
        color: #008489;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>

<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="6">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>你没有权限去该页面</h2>
        <h4>
          <router-link to="/">回首页</router-link>
        </h4>
      </el-col>
      <el-col :span="18">
        <img :src="errGif" height="400" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        errGif: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646'
      }
    }
  }
</script>
