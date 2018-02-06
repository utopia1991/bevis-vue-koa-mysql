<style lang="scss" scoped>
  @import "../../assets/scss/List";
  .link-type {
    cursor: pointer;

    &:hover {
      color: $color-blue;
    }
  }
</style>

<template>
  <section class='box'>
    <!--搜索条-->
    <el-col :span="24" class="search">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">服务单号：</span>
          <el-input v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">客户名称：</span>
          <el-input v-model="filters.email"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">提交人：</span>
          <el-input v-model="filters.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
          <el-button @click="extend = !extend">
            <i class="icon-search-extend" v-show="extend"></i>
            <i class="icon-nav-collapse" v-show="!extend"></i>
          </el-button>
        </el-form-item>
        <el-collapse-transition>
          <div v-show="extend">
            <el-form-item>
              <span class="search-label">项目阶段：</span>
              <el-select v-model="filters.status" filterable>
                <el-option
                  v-for="item in statusItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span class="search-label">修改时间：</span>
              <el-date-picker v-model="filters.timeValue" type="datetimerange"
                :picker-options="pickerOptions" placeholder="选择时间范围"
                align="right" class="date-picker">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </el-form>
    </el-col>
    <!--列表内容-->
    <el-table :data="users" stripe border v-loading="loading" element-loading-text='玩命加载中'>
      <el-table-column prop="name" label="服务单号" align="center">
      </el-table-column>
      <el-table-column prop="email" label="客户名称" align="center">
      </el-table-column>
      <el-table-column prop="email" label="项目阶段" align="center">
      </el-table-column>
      <el-table-column prop="email" label="提交人" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="修改时间" sortable align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            {{ scope.row.createTime }}
            <div slot="reference">
              {{ scope.row.createTime }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label='操作' align="center">
        <template slot-scope='scope'>
          <router-link :to="{ path:'/report/manage/edit', query: { id: scope.row.id }}">
            <el-button size='small'>查看</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--分页控件-->
    <el-col :span='24' class="pagination">
      <!-- size-change 事件处理页码大小变动时候触发的事件 -->
      <!-- current-change 事件处理当前页变动时候触发的事件 -->
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='pagination.currentPage'
        :page-sizes='[10, 20, 30, 40]'
        :page-size='pagination.limit'
        :total='pagination.total'
        layout='total, sizes, prev, pager, next, jumper'
        style='float:right;'>
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import userList from '@/api/list'
  import moment from 'moment'

  export default {
    data () {
      return {
        extend: false,
        loading: false,
        users: [],
        filters: {
          name: '',
          email: '',
          status: '',
          vip: '',
          timeValue: ''
        },
        statusItems: [{
          value: 1,
          label: '已生效'
        }, {
          value: 2,
          label: '已失效'
        }, {
          value: 3,
          label: '已挂起'
        }],
        vipItems: [{
          value: 1,
          label: 'VIP1'
        }, {
          value: 2,
          label: 'VIP2'
        }, {
          value: 3,
          label: 'VIP3'
        }],
        pickerOptions: {
          shortcuts: [{
            text: '最近1天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近7天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近30天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        // 分页控件
        pagination: {
          limit: 20, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        }
      }
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.getUsers()
    },
    methods: {
      // 状态转换
      formatStatus: function (row) {
        return row.status === 1 ? '已生效' : row.status === 2 ? '已失效' : '已挂起'
      },
      // vip转换
      formatVIP: function (row) {
        let vip = {
          '1': 'VIP1',
          '2': 'VIP2',
          '3': 'VIP3'
        }
        return vip[row.vipLevel]
      },
      // 分页条目
      handleSizeChange: function (val) {
        this.pagination.limit = val
        this.getUsers(this.pagination.start, this.pagination.limit)
      },
      // 分页切换页面
      handleCurrentChange: function (val) {
        this.pagination.start = (val - 1) * this.pagination.limit
        this.getUsers(this.pagination.start, this.pagination.limit)
      },
      // 获取以及搜索用户
      getUsers: function () {
        this.loading = true
        let params = {
          'name': this.filters.name,
          'email': this.filters.email,
          'limit': this.pagination.limit,
          'start': this.pagination.start,
          'vipLevel': this.filters.vip,
          'status': this.filters.status.toString(),
          'dateFrom': this.filters.timeValue[0],
          'dateTo': this.filters.timeValue[1]
        }

        userList.getUsers(params).then((res) => {
          this.loading = false

          if (res.data.success === true) {
            this.pagination.total = res.data.value.totalCount
            this.users = res.data.value.rows
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>
