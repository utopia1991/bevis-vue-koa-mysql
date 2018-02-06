<style lang="scss" scoped>
  @import "../../assets/scss/List";
</style>

<template>
  <section class='box'>
    <!--搜索条-->
    <el-col :span="24" class="search">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span class="search-label">执行项：</span>
          <el-input v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="search-label">负责人：</span>
          <el-input v-model="filters.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <section class="tools">
      <el-button type="primary" v-on:click="handleAdd">新增</el-button>
    </section>
    <!--列表内容-->
    <el-table :data="users" stripe border v-loading="loading" element-loading-text='给我点时间'>
      <el-table-column prop="name" label="执行项" align="center">
      </el-table-column>
      <el-table-column prop="email" label="本周进展" align="center">
      </el-table-column>
      <el-table-column prop="status" label="下阶段目标" align="center">
      </el-table-column>
      <el-table-column prop="vipLevel" label="负责人" align="center">
      </el-table-column>
      <el-table-column label='操作' align="center">
        <template slot-scope='scope'>
          <el-button size='small' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
          <el-button type='danger' size='small' @click='removeUser(scope.$index, scope.row)'>删除</el-button>
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
    <!--新增用户弹窗-->
    <el-dialog title='添加用户' v-model='addFormVisible' :close-on-click-modal='false'>
      <el-form :model='addForm' label-width='80px' :rules='addFormRules' ref='addForm'>
        <el-form-item label='姓名：'>
          <el-input v-model='addForm.name' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='邮箱：'>
          <el-input v-model='addForm.email'></el-input>
        </el-form-item>
        <el-form-item label='状态：'>
          <el-select v-model="addForm.status" filterable placeholder="请选择状态">
            <el-option
              v-for="item in statusItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='VIP等级：'>
          <select v-model="addForm.vipLevel" placeholder="请选择VIP等级">
            <option
              v-for="item in vipItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </option>
          </select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click.native='addFormVisible = false'>取消</el-button>
        <el-button type='primary' @click.native='addUser' :loading='addLoading'>提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  // 将每个页面的所有api都放在一个api文件中去管理，@为 src 目录
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
        },
        // 添加用户弹窗
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addForm: {
          name: '',
          email: '',
          vipLevel: undefined,
          status: undefined
        },
        addFormRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
          status: [{ required: true, message: '请输入状态', trigger: 'blur' }]
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
        var self = this
        this.loading = true
        let params = {
          name: this.filters.name,
          email: this.filters.email,
          limit: this.pagination.limit,
          start: this.pagination.start,
          vipLevel: this.filters.vip,
          status: this.filters.status.toString(),
          dateFrom: this.filters.timeValue[0],
          dateTo: this.filters.timeValue[1]
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
              this.editForm.createTime = moment(this.editForm.createTime).format('YYYY-MM-DD HH:mm:ss')
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
      // 添加用户
      addUser: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确定添加吗？', '提示', {}).then(() => {
              this.addLoading = true
              let para = Object.assign({}, this.addForm)

              // 新增用户
              userList.addUser(para).then((res) => {
                this.addLoading = false
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getUsers()
              })
            })
          }
        })
      },
      // 删除单个用户
      removeUser: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let userId = row.id

          // 删除单个用户
          userList.removeUser(userId).then((res) => {
            this.listLoading = false

            if (res.data.success === true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getUsers()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      },
      // 添加用户方法
      handleAdd: function (index, row) {
        this.addFormVisible = true
        this.addForm = {
          name: '',
          email: '',
          status: ''
        }
      },
      // 修改用户方法
      handleEdit: function (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      }
    }
  }
</script>
