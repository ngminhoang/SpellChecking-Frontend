import {defineStore} from "pinia";
import {onMounted, ref, watch} from 'vue'

export const useWebDataStore = defineStore("webdata", () => {
    const header = ref('');
    const body = ref('');

    function setHeader(msg: string) {
        header.value = msg
    }

    function setBody(msg: string) {
        body.value = msg
    }

    function clearData() {
        header.value = '';
        body.value = '';
    }


    return {
        header, body, setHeader, setBody, clearData
    }
})