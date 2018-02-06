<style scoped lang="scss">
  @import "../assets/scss/Layout.scss";
</style>

<template>
  <div class="side-nav">
    <template v-for="item in routes">
      <!-- 无子菜单情况 -->
      <router-link v-if="item.children.length === 0" :to="item.url" class="nav-items">
        {{item.cnName}}
      </router-link>
      <!-- 有子菜单情况 -->
      <el-submenu v-else :index="item.url">
        <!-- 多级菜单标题 -->
        <template slot="title">
          <span>{{item.cnName}}</span>
        </template>
        <!-- 多级菜单子元素 -->
        <template v-for="child in item.children">
          <router-link :to="child.url" class="subnav-items">
            {{child.cnName}}
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  export default {
    // 子模块，props父模块注入值
    props: {
      routes: {
        type: Array
      }
    }
  }
</script>
