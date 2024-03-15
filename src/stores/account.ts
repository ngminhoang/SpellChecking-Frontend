import {defineStore} from "pinia";
import {ref, watch} from 'vue'
import {useTitleStore} from "@/stores/title";
import {getInfo} from "@/api/API";

export const useAccountStore = defineStore('account', () => {
    const id = ref(null);
    const isLogin = ref(false);
    const token = ref('');
    const name = ref('');
    const mail = ref('');

    function login() {
        isLogin.value = true;
    }

    function notLogin() {
        isLogin.value = false;
    }


    watch(isLogin, (newValue, oldValue) => {
        const title = useTitleStore()
        if (newValue == true) {
            title.changingTitle("Bắt đầu nào " + name.value)
            title.reactImg = "duriu_pre"

        } else {
            title.changingTitle("DURIU SPELL CHECKING")
            title.reactImg = "duriu"
        }
    });

    watch(name, async (newValue, oldValue) => {
        const token = localStorage.getItem('token')
        await getInfo(token);
    });

    return {
        id, isLogin, token, login, notLogin, name, mail
    }
})