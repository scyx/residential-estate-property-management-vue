import Vue from 'vue';
import VueRouter from 'vue-router';
import Info from '../views/info.vue';
import Login from '../components/Login.vue';
import Home from '../components/common/Home.vue';
import Welcome from '../components/common/Welcome.vue';
import Household from '../components/common/household/Household.vue';
import Authority from '../components/common/Authority/Authority.vue';
import User from '../components/common/User.vue';
import HouseholdOwnMember from '../components/common/household/HouseholdOwnMember.vue';
import Notice from '../components/common/Notice.vue';
import House from '../components/common/House/House.vue';
import Unit from '../components/common/House/Unit.vue';
import Room from '../components/common/House/Room.vue';
import addRoom from '../components/common/House/addRoom.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/104',
        component: Info,
      },
      {
        path: '/welcome',
        component: Welcome,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/household',
        component: Household,
        meta: {
          title: '住户列表'
        }
      },
      {
        path: '/authority',
        component: Authority,
        meta: {
          title: '权限组'
        }
      },
      {
        path: '/users',
        component: User,
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/householdOwnMember',
        component: HouseholdOwnMember,
        meta: {
          title: '业主成员'
        }
      },
      {
        path: '/notice',
        component: Notice,
        meta: {
          title: '公告管理'
        }
      },
      {
        path: '/house',
        component: House,
        meta: {
          title: '楼栋管理'
        },
      },
      {
        path: '/unit',
        component: Unit,
        meta: {
          title: '单元信息'
        }
      },
      {
        path: '/room',
        component: Room,
        meta: {
          title: '房屋管理'
        }
      },
      {
        path: '/addRoom',
        component: addRoom,
        meta: {
          title: '添加房屋'
        }
    },
    ],
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  window.sessionStorage.setItem('activepath', to.path);
  next();
  // to：将要访问的路径
  // from： 从哪个路径跳转过来
  // next： 表示放行 是一个函数
  if (to.path === '/login') return next();
  // 获取token
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
});

export default router;
