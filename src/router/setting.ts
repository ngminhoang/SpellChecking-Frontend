import SettingView from '@/views/SettingView.vue';

export default {
    path: '/setting',
    name: 'setting',
    component: SettingView,
    meta: { requiresAuth: true }
};
