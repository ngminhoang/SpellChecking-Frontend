import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTitleStore
    = defineStore('title',()=> {
    const title = ref('DURIU SPELL CHECKING');
    const reactImg = ref('duriu');
    function changingTitle(msg: any) {
        title.value = msg;
    };
    function changingImg(msg: any) {
        reactImg.value = msg;
    };
    return {
        title, reactImg, changingTitle, changingImg
    };
});