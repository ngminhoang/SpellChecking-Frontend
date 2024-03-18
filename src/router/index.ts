import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import {useAccountStore} from "@/stores/account";
import {useWebDataStore} from "@/stores/webdata";
import {getInfo} from "@/api/API";
import main from "@/router/main";
import login from "@/router/login";
import register from "@/router/register";
import setting from "@/router/setting";
import about from "@/router/about";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        login,
        about,
        register,
        main,
        setting,
    ]
})

router.beforeEach((to, from, next) => {
    const dataWeb = useWebDataStore();
    dataWeb.clearData();
    const account = useAccountStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const isAuthenticated = localStorage.getItem('token');
        if (!isAuthenticated) {
            next({name: login.name});
        } else {
            if (!isTokenExpired(isAuthenticated)) {
                account.login();
                // const title = useTitleStore()
                // title.changingTitle("Bắt đầu nào " + account.name )
                getInfo(isAuthenticated);
                next();
            } else {
                localStorage.removeItem('token');
                account.notLogin();
                next({name: login.name});
            }
        }
    } else {
        if (to.path == "/") next({name: about.name});
        account.notLogin();
        next();
    }
})

export default router
const isTokenExpired = (token: any) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp;
    return Date.now() / 1000 >= expirationTime;
};

