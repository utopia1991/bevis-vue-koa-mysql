<style lang="scss" scoped>
  @import "../../assets/scss/List";
</style>

<template>
  <section class='box'>
    <!--搜索条-->
    <el-col :span="24" class="search">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">客户名称：</span>
          <el-input v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">英文简称：</span>
          <el-input v-model="filters.enName"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">VIP等级：</span>
          <el-select v-model="filters.vip" filterable>
            <el-option
              v-for="item in vipItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表内容-->
    <el-table :data="users" stripe border v-loading="loading" element-loading-text='给我点时间'>
      <el-table-column prop="name" label="客户名称" sortable align="center">
      </el-table-column>
      <el-table-column prop="email" label="英文简称" sortable align="center">
      </el-table-column>
      <el-table-column prop="status" label="所属分公司" sortable align="center">
      </el-table-column>
      <el-table-column prop="manage" label="项目经理" sortable align="center">
      </el-table-column>
      <el-table-column prop="industry" label="所属行业" sortable align="center">
      </el-table-column>
      <el-table-column prop="vipLevel" label="VIP等级" sortable :formatter='formatVIP' align="center">
      </el-table-column>
      <el-table-column label='操作' width="140" align="center">
        <template slot-scope='scope'>
          <el-button size='small' @click='handleEdit(scope.$index, scope.row)'>查看</el-button>
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
    <!--修改用户弹窗-->
    <el-dialog title='修改用户' v-model='editFormVisible' :close-on-click-modal='false'>
      <el-form :model='editForm' label-width='80px' :rules='editFormRules' ref='editForm'>
        <el-form-item label='姓名' prop='name'>
          <el-input v-model='editForm.name' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='邮箱'>
          <el-input v-model='editForm.email'></el-input>
        </el-form-item>
        <el-form-item label='VIP'>
          <el-select v-model="editForm.vipLevel" filterable placeholder="请选VIP等级">
            <el-option v-for="item in vipItems" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click.native='editFormVisible = false'>取消</el-button>
        <el-button type='primary' @click.native='editUser' :loading='editLoading'>提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  // 将每个页面的所有api都放在一个api文件中去管理，@为 src 目录
  import userList from '@/api/list'

  export default {
    data () {
      return {
        loading: false,
        users: [],
        filters: {
          name: '',
          enName: '',
          vip: 0
        },
        vipItems: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: 'VIP1'
        }, {
          value: 2,
          label: 'VIP2'
        }, {
          value: 3,
          label: 'VIP3'
        }],
        // 分页控件
        pagination: {
          limit: 20, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        // 修改用户弹窗
        editFormVisible: false, // 编辑弹窗默认不显示
        editLoading: false,
        editForm: {
          name: '',
          email: '',
          status: undefined,
          vipLevel: undefined,
          createTime: ''
        },
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.getUsers()
    },
    methods: {
      // vip转换
      formatVIP: function (row) {
        let vip = {
          '0': '全部',
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
        var self = this
        this.loading = true
        let params = {
          name: this.filters.name,
          enName: this.filters.enName,
          limit: this.pagination.limit,
          start: this.pagination.start,
          vipLevel: this.filters.vip
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
      },
      // 修改用户
      editUser: function () {
        this.$refs.editForm.validate((valid) => {
          // 验证输入框信息合法
          if (valid) {
            this.$confirm('确认修改吗？', '提示', {}).then(() => {
              this.editLoading = true
              let para = Object.assign({}, this.editForm)

              userList.editUser(para).then((res) => {
                this.editLoading = false

                if (res.data.success === true) {
                  this.$message({
                    message: res.data.msg,
                    type: 'success'
                  })
                  this.$refs['editForm'].resetFields()
                  this.editFormVisible = false
                  this.getUsers()
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
      },
      // 修改用户方法
      handleEdit: function (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      }
    }
  }
</script>
