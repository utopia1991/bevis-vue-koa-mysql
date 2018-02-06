<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
  }
</style>

<template>
  <section class="box">
    <el-tabs v-model="active" type="border-card" ref='editForm'>
      <el-tab-pane label="基本信息" name="1">
        <el-row :gutter="20">
          <el-col :span="3">姓名：</el-col>
          <el-col :span="19">
            <el-input v-model="editForm.name"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">邮箱：</el-col>
          <el-col :span="19">
            <el-input v-model="editForm.email"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">状态：</el-col>
          <el-col :span="19">
            <el-select v-model="editForm.status" filterable>
              <el-option
                v-for="item in statusItems"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="信息2" name="2">
        <el-row :gutter="20">
          <el-col :span="3">创建时间：</el-col>
          <el-col :span="19">
            <el-date-picker
              v-model="editForm.createTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">VIP等级：</el-col>
          <el-col :span="19">
            <el-select v-model="editForm.vipLevel" filterable>
              <el-option
                v-for="item in vipItems"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <p>
      <el-button type="primary" @click="save">保存</el-button>
    </p>
  </section>
</template>

<script>
  import userList from '@/api/list'
  import moment from 'moment'

  export default {
    data () {
      return {
        userId: this.$route.query.id,
        active: '1',
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
        editForm: {
          name: '',
          email: '',
          status: '',
          vipLevel: '',
          createTime: ''
        }
      }
    },
    mounted () {
      this.getUser(this.userId)
    },
    methods: {
      getUser: function (params) {
        this.loading = true

        userList.getUser(params).then((res) => {
          this.loading = false
          if (res.data.success === false) {
            this.$router.push({ name: '服务配置2' })
          } else {
            this.editForm = res.data.value
          }
        }).catch(() => {
          this.$router.push({ name: '服务配置2' })
        })
      },
      save: function () {
        this.$confirm('确认修改吗？', '提示', {}).then(() => {
          this.editForm.createTime = moment(this.editForm.createTime).format('YYYY-MM-DD HH:mm:ss')

          let para = {
            id: this.userId,
            name: this.editForm.name,
            email: this.editForm.email,
            status: this.editForm.status,
            vipLevel: this.editForm.vipLevel,
            createTime: this.editForm.createTime
          }

          userList.editUser(para).then((res) => {
            if (res.data.success === true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getUser(this.userId)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      }
    }
  }
</script>
