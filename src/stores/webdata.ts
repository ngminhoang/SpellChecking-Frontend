import { defineStore } from "pinia";
import {onMounted, ref, watch} from 'vue'
import {fetchPaginatedHistory} from "@/api/API";
export const useWebDataStore = defineStore("webdata", ()=>{
    const header = ref('');
    const body = ref('');
    const tableData = ref(null);
    function setTableData(data){
        tableData.value = data
    }
    function setHeader(msg){
        header.value = msg
    }
    function setBody(msg){
        body.value = msg
    }
    function clearData(){
        header.value='';
        body.value ='';
    }

    onMounted(async () => {
        try {
            const data = await fetchPaginatedHistory(1);
            tableData.value = data;

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function setHistoryData(data){
        body.value = data
    }

    return{
        header, body, setHeader, setBody, clearData,setTableData, tableData
    }
})