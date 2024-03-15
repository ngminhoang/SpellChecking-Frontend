import {ref} from 'vue';
import {ElLoading} from 'element-plus';

export function useLoading() {
    const loadingInstance = ref(null);

    function startLoading() {
        loadingInstance.value = ElLoading.service({
            lock: true,
            text: 'Loading...',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }

    function endLoading() {
        if (loadingInstance.value) {
            loadingInstance.value.close();
        }
    }

    return {
        startLoading,
        endLoading
    };
}