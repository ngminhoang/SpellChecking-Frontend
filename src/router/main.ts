import MainView from '@/views/MainView.vue';

export default {
    path: '/main',
    name: 'main',
    component: MainView,
    meta: { requiresAuth: true }
};
