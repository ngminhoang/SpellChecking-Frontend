import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAccountStore } from "@/stores/account";
import { useWebDataStore } from "@/stores/webdata";
import { getInfo } from "@/api/API";
import { useTitleStore } from "@/stores/title";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/main',
            name: 'main',
            component: () => import('../views/MainView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/setting',
            name: 'setting',
            component: () => import('../views/SettingView.vue'),
            meta: { requiresAuth: true }
        },
    ]
})

router.beforeEach((to, from, next) => {
    const dataWeb = useWebDataStore();
    dataWeb.clearData();
    const account = useAccountStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const isAuthenticated = localStorage.getItem('token');
        if (!isAuthenticated) {
            next({ name: 'login' });
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
                next({ name: 'login' });
            }
        }
    } else {
        if (to.path == "/") next({ name: 'about' });
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

