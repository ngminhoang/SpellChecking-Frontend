import{ useAccountStore } from "@/stores/account";
import router from "@/router";
import { useWebDataStore } from "@/stores/webdata";
import { ElMessageBox } from 'element-plus';
import {useLoading} from "@/stores/loading";
import dayjs from "dayjs";
import {useTitleStore} from "@/stores/title";
const { startLoading, endLoading } = useLoading();

export const login = async (mail: string, password: string): Promise<string> => {
    const account = useAccountStore();
    startLoading();
    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail, password }),
        });

        if (!response.ok) {
            ElMessageBox.alert('Bạn đăng nhập không thành công, vui lòng đăng nhập lại', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        }
        const data = await response.json();
        const token = data.token;
        account.token = token;
        localStorage.setItem('token', token);
        await getInfo(token); // Gọi getInfo với token
        router.push("/main");
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    } finally {
        endLoading();
    }
};

export const getInfo = async (token: string) => {
    const account = useAccountStore();
    try {
        const response = await fetch('http://localhost:8080/api/user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        account.name = data.name;
        account.mail = data.mail;
        //await createHistory(token, data.name, data.mail);
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};



export const register = async (mail: string, password: string,checkPass: string, name: string, role: string): Promise<string> => {
    if(password!= checkPass){
        ElMessageBox.alert('Mật khẩu nhập lại không giống, hãy nhập lại mật khẩu đúng', 'Rất tiếc', {
            confirmButtonText: 'Đồng ý',
            type: 'warning',
        });
        return;
    }
    const account = useAccountStore();
    startLoading();
    try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail, password, name, role }),
        });

        if (!response.ok) {
            ElMessageBox.alert('Bạn đăng ký không đúng form hoặc tài khoản này đã tồn tại, vui lòng đăng ký lại', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        }
        endLoading();
        const data = await response.json();
        const token = data.token;
        account.token = data.token;
        localStorage.setItem('token', token);
        router.push("/main")
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const spellCheck = async (url: string): Promise<string> => {
    startLoading();
    const dataweb = useWebDataStore();
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://localhost:8080/api/user/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({url}),
        });

        if (!response.ok) {
            ElMessageBox.alert('Có lẽ Url bạn cung cấp bị lỗi hoặc không hợp lệ', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        }
        endLoading();
        const data = await response.json();
        dataweb.setHeader(data.title);
        dataweb.setBody(data.body);
        await createHistory(dataweb.header,url, dataweb.body)

    } catch (error) {
        console.error('Check url error:', error);
        throw error;
    }
};


export const updateAccount = async (name, mail, password) => {
    startLoading();
    const account = useAccountStore();
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://localhost:8080/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({name, mail, password}),
        });

        if (!response.ok) {
            ElMessageBox.alert('Có lẽ thông tin bạn cung cấp bị lỗi hoặc không hợp lệ', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        }
        endLoading();
        const data = await response.json();
        if(data==false){
            ElMessageBox.alert('Có lẽ thông tin bạn cung cấp bị lỗi hoặc không hợp lệ', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        }
        else {
            await getInfo(token)
        };

    } catch (error) {
        console.error('Check url error:', error);
        throw error;
    }
};

export const createHistory = async (title: string, link: string , param: string) => {
    const dataweb = useWebDataStore();
    const dateTime = new Date(); // Đối tượng ngày và giờ từ TypeScript
    const date = dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://localhost:8080/api/user/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ date, title, link , param}),
        });

        if (!response.ok) {
            throw new Error('Failed to create history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating history:', error);
        throw error;
    }
};

export const deleteHistory = async (id: number) => {
    const apiUrl = `http://localhost:8080/api/user/history`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: id,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch paginated history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated history:', error);
        throw error;
    }
};

export const fetchPaginatedHistory = async (sizeNumber,pageNumber,typeOrder) => {
    const apiUrl = `http://localhost:8080/api/user/history/page?size=${sizeNumber}&page=${pageNumber}&soft=${typeOrder}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch paginated history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated history:', error);
        throw error;
    }
};


export const fetchPageCount = async (sizeNumber) => {
    const apiUrl = `http://localhost:8080/api/user/history/page/total?size=${sizeNumber}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch paginated history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated history:', error);
        throw error;
    }
};


export const fetchPaginatedHistoryBySearch = async (key,sizeNumber,pageNumber,checkOrder) => {
    const apiUrl = `http://localhost:8080/api/user/history/search?size=${sizeNumber}&page=${pageNumber}&soft=${checkOrder}&key=${key}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch paginated history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated history:', error);
        throw error;
    }
};


export const fetchPageCountBySearch = async (key,sizeNumber) => {
    const apiUrl = `http://localhost:8080/api/user/history/search/total?size=${sizeNumber}&key=${key}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch paginated history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated history:', error);
        throw error;
    }
};