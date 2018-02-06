import NotFound from '../views/404'
import NoAuth from '../views/403'
import Layout from '../components/Layout'
// infor 页面
import Information from '../views/infor/Information'
import Service from '../views/infor/Service'
// report 页面
import Connect from '../views/report/Connect'
import Manage from '../views/report/Manage'
import Edit from '../views/report/Edit'
// office 页面
import Plan from '../views/office/Plan'
import Brace from '../views/office/Brace'
import Clue from '../views/office/Clue'
import Task from '../views/office/Task'
import Others from '../views/office/Others'

// 配置路由
const routes = [
  { path: '/404', component: NotFound, name: '404', hidden: true },
  { path: '/403', component: NoAuth, name: '403', hidden: true },
  { path: '/', redirect: '/infor/information', hidden: true },
  { path: '/infor', component: Layout, redirect: '/infor/information', name: '项目信息',
    children: [
      { path: 'information', component: Information, name: '客户基本信息' },
      { path: 'service', component: Service, name: '产品服务单' }
    ]
  },
  { path: '/report', component: Layout, redirect: '/report/connect', name: '项目汇报',
    children: [
      { path: 'connect', component: Connect, name: '项目沟通' },
      { path: 'manage', component: Manage, name: '进度管理' },
      { path: 'manage/edit', component: Edit, name: '查看配置' }
    ]
  },
  { path: '/office', component: Layout, redirect: '/office/plan', name: '项目事务',
    children: [
      { path: 'plan', component: Plan, name: '文档计划' },
      { path: 'brace', component: Brace, name: '客服支撑' },
      { path: 'clue', component: Clue, name: '项目线索' },
      { path: 'task', component: Task, name: '任务管理' },
      { path: 'others', component: Others, name: '其他事务' }
    ]
  },
  { path: '*', hidden: true, redirect: { path: '/404' } }
]

export default routes
