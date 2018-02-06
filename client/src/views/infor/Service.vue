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
          <span class="search-label">服务状态：</span>
          <el-select v-model="filters.status" filterable style="width: 120px">
            <el-option
              v-for="item in statusItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="search-label">项目进度：</span>
          <el-select v-model="filters.process" filterable style="width: 120px">
            <el-option
              v-for="item in processItems"
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
    <section class="tools">
      <el-button type="primary" v-on:click="handleAdd">新增</el-button>
      <el-button type="danger" @click='batchRemove' :disabled='this.sels.length===0'>批量删除用户</el-button>
    </section>
    <!--列表内容-->
    <el-table :data="users" stripe border v-loading="loading" element-loading-text='给我点时间' @selection-change='selsChange'>
      <el-table-column type='selection'>
      </el-table-column>
      <el-table-column prop="name" label="服务单号" sortable align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">
            {{scope.row.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="服务单名称" sortable align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">
            {{scope.row.email}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="客户名称" sortable align="center">
      </el-table-column>
      <el-table-column prop="processLevel" label="项目经理" sortable align="center">
      </el-table-column>
      <el-table-column prop="processLevel" label="服务状态" sortable align="center">
      </el-table-column>      
      <el-table-column prop="processLevel" label="项目进度" sortable align="center">
      </el-table-column>
      <el-table-column label='操作' align="center">
        <template slot-scope='scope'>
          <router-link :to="{ path:'/service/analysis/flow/edit', query: { id: scope.row.id }}">
            <el-button size='small'>编辑</el-button>
          </router-link>
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
        <el-form-item label='process等级：'>
          <select v-model="addForm.processLevel" placeholder="请选择process等级">
            <option
              v-for="item in processItems"
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
    <el-dialog title="查看详情" :visible.sync="dialogFormVisible">
      <p>姓名：{{temp.name}}</p>
      <p>邮箱：{{temp.email}}</p>
      <p>状态：{{temp.status}}</p>
      <p>process等级：{{temp.processLevel}}</p>
      <p>创建时间：{{temp.createTime}}</p>
    </el-dialog>
  </section>
</template>

<script>
  import userList from '@/api/list'
  import moment from 'moment'

  export default {
    data () {
      return {
        extend: false,
        sels: [], // 列表选中列
        loading: false,
        users: [],
        temp: {
          name: '',
          email: '',
          status: '',
          process: ''
        },
        filters: {
          name: '',
          email: '',
          status: 0,
          process: 0
        },
        statusItems: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '正式'
        }, {
          value: 2,
          label: '测试'
        }, {
          value: 3,
          label: '静默'
        }, {
          value: 4,
          label: '关闭'
        }],
        processItems: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: 'process2'
        }, {
          value: 2,
          label: 'process3'
        }],
        // 分页控件
        pagination: {
          limit: 20, // 分页每页多少条
          start: 0,
          currentPage: 1,
          total: 0
        },
        // 添加用户弹窗
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addForm: {
          name: '',
          email: '',
          processLevel: undefined,
          status: undefined
        },
        addFormRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
          status: [{ required: true, message: '请输入状态', trigger: 'blur' }]
        },
        dialogFormVisible: false
      }
    },
    mounted () {
      // 页面挂载结束请求用户列表
      this.getUsers()
    },
    methods: {
      // process转换
      formatprocess: function (row) {
        let process = {
          '1': 'process1',
          '2': 'process2',
          '3': 'process3'
        }
        return process[row.processLevel]
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
      // 列表多选
      selsChange: function (sels) {
        this.sels = sels
      },
      // 获取以及搜索用户
      getUsers: function () {
        this.loading = true
        let params = {
          'name': this.filters.name,
          'email': this.filters.email,
          'limit': this.pagination.limit,
          'start': this.pagination.start,
          'process': this.filters.process,
          'status': this.filters.status.toString()
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
                  message: '提交成功',
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
      // 批量删除用户
      batchRemove: function () {
        let ids = this.sels.map(item => item.id)

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = { 'delete': ids }

          userList.batchRemoveUser(para).then((res) => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
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
      handleUpdate: function (row) {
        this.temp = Object.assign({}, row)
        this.dialogFormVisible = true
      }
    }
  }
</script>
