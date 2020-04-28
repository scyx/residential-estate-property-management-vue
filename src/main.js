import ElementUI, {
    Message
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import axios from 'axios';
import QS from 'qs';
import router from './router';
import store from './store';
import App from './App.vue';
import './assets/css/global.css';


// 手机号验证规则
var checkTelephone = (rule, value, callback) => {
    const regTelephone = /^1[3-9]\d{9}$/;
    if (regTelephone.test(value)) {
        callback();
    }
    callback(new Error('请输入合法的手机号'));
};
// 请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/';
// 允许携带跨域cookie
axios.defaults.withCredentials = true;
// post请求转换
Vue.prototype.QS = QS;
Vue.prototype.$http = axios;
Vue.prototype.$confirm = Message.$confirm;
Vue.prototype.dialog_width = '350px';
// 清空表单的全局方法
Vue.prototype.clearForm = function (formName) {
    this.$refs[formName].resetFields();
};
// 关闭对话框的方法 两个变量为对话框中的表单名称控制对话框可见的变量
Vue.prototype.closeDialog = function (formName, visible) {
    this[visible] = false;
    this.clearForm(formName);
};
// 校验电话号的规则
Vue.prototype.checkTelephone = checkTelephone;
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.currentUser = window.sessionStorage.getItem('username');
// 通过id查询业主信息
Vue.prototype.selectByHouseHoldId = async function (id) {
    const {
        data: res
    } = await this.$http.get('getHouseHoldById/' + id);
    if (res.code === 200) {
        this.editform = res.data;
    } else {
        return this.$message.error('获取住户信息失败！该住户可能不存在');
    }
};
// 通过id查询楼栋信息
Vue.prototype.selectByHouseId = async function (id) {
    const {
        data: res
    } = await this.$http.get('getHouseById/' + id);
    if (res.code === 200) {
        this.editform = res.data;
    } else {
        return this.$message.error('获取楼栋信息失败！楼栋可能不存在');
    }
};
// 获取楼栋列表
Vue.prototype.getHouseList = async function () {
    const {
        data: res
    } = await this.$http.get('getHouseList', {
        params: {
            query: this.queryInfo.query,
            pageNum: this.queryInfo.pagenum,
            pageSize: this.queryInfo.pagesize
        }
    });
    if (res.code === 200) {
        this.HouseList = res.data.list;
        this.total = res.data.total;
    }
};
// 获取单元列表
Vue.prototype.getUnitList = async function () {
    const {
        data: res
    } = await this.$http.get(
        'getUnitList', {
            params: {
                query: this.queryInfo.query,
                house_id: this.currentHouseId,
                pageNum: this.queryInfo.pagenum,
                pageSize: this.queryInfo.pagesize,
            }
        }
    );
    this.UnitList = res.data.list;
    console.log(res);
    this.total = res.data.total;
};
// 菜单栏激活
Vue.prototype.savepath = function (activepath) {
    window.sessionStorage.setItem('activepath', activepath);
    this.activepath = activepath;
};
Vue.prototype.towelcome = function () {
    this.$router.push('/welcome');
    this.savepath('/welcome');
    window.location.reload();
};
// 根据id 获取公告详情
Vue.prototype.getNoticeById = async function (id) {
    const {
        data: res
    } = await this.$http.get('getNoticeById/' + id);
    if (res.code === 200) {
        this.currentNotice = res.data;
        console.log(this.currentNotice);
    } else {
        return this.$message.error(
            '获取住户信息失败！该房屋可能不存在'
        );
    }
};

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
