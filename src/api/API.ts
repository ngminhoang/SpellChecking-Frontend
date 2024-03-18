import {useAccountStore} from "@/stores/account";
import router from "@/router";
import {useWebDataStore} from "@/stores/webdata";
import {ElMessageBox} from 'element-plus';
import {useLoading} from "@/stores/loading";
import main from "@/router/main";
import {loginUrl, infoUrl, registerUrl, spellCheckUrl, updateAccountUrl, createHistoryUrl, deleteHistoryUrl, paginateUrl} from "@/api/APIUrl";

const {startLoading, endLoading} = useLoading();

export const login = async (mail: string, password: string) => {
    const account = useAccountStore();
    startLoading();
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({mail, password}),
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
        router.push(main.path);
    } finally {
        endLoading();
    }
};

export const getInfo = async (token: any) => {
    const account = useAccountStore();
    const response = await fetch(infoUrl, {
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

};


export const register = async (mail: string, password: string, checkPass: string, name: string, role: string) => {
    if (password != checkPass) {
        ElMessageBox.alert('Mật khẩu nhập lại không giống, hãy nhập lại mật khẩu đúng', 'Rất tiếc', {
            confirmButtonText: 'Đồng ý',
            type: 'warning',
        });
    }
    const account = useAccountStore();
    startLoading();
    try {
        const response = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({mail, password, name, role}),
        });

        if (!response.ok) {
            ElMessageBox.alert('Bạn đăng ký không đúng form hoặc tài khoản này đã tồn tại, vui lòng đăng ký lại', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        }
        const data = await response.json();
        const token = data.token;
        account.token = data.token;
        localStorage.setItem('token', token);
        router.push(main.path)
    } finally {
        endLoading();
    }
};

export const spellCheck = async (url: string) => {
    startLoading();
    const dataweb = useWebDataStore();
    const token = localStorage.getItem('token')
    try {
        const response = await fetch(spellCheckUrl, {
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
        await createHistory(dataweb.header, url, dataweb.body)

    } finally {
        endLoading();
    }
};

export const updateAccount = async (name: string, mail: string, password: string) => {
    startLoading();
    const token = localStorage.getItem('token')
    try {
        const response = await fetch(updateAccountUrl, {
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
        const data = await response.json();
        if (!data) {
            ElMessageBox.alert('Có lẽ thông tin bạn cung cấp bị lỗi hoặc không hợp lệ', 'Rất tiếc', {
                confirmButtonText: 'Đồng ý',
                type: 'warning',
            });
        } else {
            await getInfo(token)
        }
    } finally {
        endLoading();
    }
};

export const createHistory = async (title: string, link: string, param: string) => {
    const dateTime = new Date();
    const createdDate = dateTime.toISOString();
    const token = localStorage.getItem('token')
    const response = await fetch(createHistoryUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({createdDate, title, link, param}),
    });

    if (!response.ok) {
        throw new Error('Failed to create history');
    }

    return await response.json();
};

export const deleteHistory = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(deleteHistoryUrl, {
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
    return await response.json();
};


export const fetchPaginatedHistoryBySearch = async (key: string, sizeNumber: number, pageNumber: number, checkOrder: number) => {
    const apiUrl = paginateUrl+`size=${sizeNumber}&page=${pageNumber}&sort=${checkOrder}&key=${key}`;
    const token = localStorage.getItem('token');
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

    return await response.json();
};
