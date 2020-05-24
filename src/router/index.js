import Vue from 'vue';
import VueRouter from 'vue-router';
import Info from '../views/info.vue';
import Login from '../components/Login.vue';
import Home from '../components/common/Home.vue';
import Welcome from '../components/common/Welcome.vue';
import Household from '../components/common/household/Household.vue';
import Authority from '../components/common/Authority/Authority.vue';
import notfound from '../components/common/Authority/404.vue';
import User from '../components/common/User.vue';
import HouseholdOwnMember from '../components/common/household/HouseholdOwnMember.vue';
import House from '../components/common/Property/House.vue';
import Unit from '../components/common/Property/Unit.vue';
import Room from '../components/common/Property/Room.vue';
import addRoom from '../components/common/Property/addRoom.vue';
import Parking from '../components/common/Property/Parking.vue';
import Notice from '../components/common/SmartServices/Notice.vue';
import NoticeDetail from '../components/common/SmartServices/NoticeDetail.vue';
import EditNotice from '../components/common/SmartServices/EditNotice.vue';
import ComplaintsAndAdvice from '../components/common/SmartServices/ComplaintsAndAdvice.vue';
import AddComplaintAndAdvice from '../components/common/SmartServices/AddComplaintAndAdvice.vue';
import SendOrders from '../components/common/Repair/SendOrders.vue';
import FeeSetting from '../components/common/Fee/FeeSetting.vue';
import PaymentList from '../components/common/Fee/PaymentList.vue';

Vue.use(VueRouter);
const routes = [{
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
        path: '/404',
        component: notfound,
        meta: {
            title: '未找到'
        }
    },
    {
        path: '/home',
        redirect: '/welcome',
        component: Home,
        children: [{
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
            {
                path: '/parking',
                component: Parking,
                meta: {
                    title: '车位管理'
                }
            },
            {
                path: '/noticeDetail',
                component: NoticeDetail,
                meta: {
                    title: '公告详情'
                }
            },
            {
                path: '/editNotice',
                component: EditNotice,
                meta: {
                    title: '修改公告'
                }
            },
            {
                path: '/complaintsAndAdvice',
                component: ComplaintsAndAdvice,
                meta: {
                    title: '投诉建议'
                }
            },
            {
                path: '/AddComplaintAndAdvice',
                component: AddComplaintAndAdvice,
                meta: {
                    title: '登记投诉'
                }
            },
            {
                path: '/SendOrders',
                component: SendOrders,
                meta: {
                    title: '派单信息'
                }
            },
            {
                path: '/FeeSetting',
                component: FeeSetting,
                meta: {
                    title: '费用项设置'
                }
            },
            {
                path: '/PaymentList',
                component: PaymentList,
                meta: {
                    title: '缴费清单'
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
    const token = window.sessionStorage.getItem('token');
    const list = window.sessionStorage.getItem('pathList');
    // console.log(from.path);
    // console.log(list.indexOf(to.path.slice(1)));
    if ((to.path === '/editNotice' || to.path === '/noticeDetail') && list !== null && list.indexOf('notice') > 0) {
        window.document.title = to.meta.title;
        window.sessionStorage.setItem('activepath', to.path);
        return next();
    }
    if (to.path === '/AddComplaintAndAdvice' && list !== null && list.indexOf('complaintsAndAdvice') > 0) {
        window.document.title = to.meta.title;
        window.sessionStorage.setItem('activepath', to.path);
        return next();
    }
    if (to.path === '/addRoom' && list !== null && list.indexOf('room') > 0) {
        window.document.title = to.meta.title;
        window.sessionStorage.setItem('activepath', to.path);
        return next();
    }
    if (to.path === '/login' || to.path === '/404') {
        window.document.title = to.meta.title;
        window.sessionStorage.setItem('activepath', to.path);
        return next();
    }
    if (!token) {
        return next('/login');
    }
    if (to.path === '/welcome') {
        window.document.title = to.meta.title;
        window.sessionStorage.setItem('activepath', to.path);
        return next();
    }
    if (list !== null && list.indexOf(to.path.slice(1)) < 0) {
        return next('/404');
    }
    if (list !== null && list.indexOf(to.path.slice(1)) > 0) {
        window.document.title = to.meta.title;
        window.sessionStorage.setItem('activepath', to.path);
        next();
    }
    // 获取token
    // to：将要访问的路径
    // from： 从哪个路径跳转过来
    // next： 表示放行 是一个函数
    // next();
});

export default router;
