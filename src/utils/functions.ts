import { UserState } from "../model/userStore";

export const getCurUser = (): UserState | null => {
    let curUserStr: string | undefined = sessionStorage.getItem('userState') || undefined;
    if (!curUserStr)
        return null;
    return JSON.parse(curUserStr);
}

export const getIsLogin = (): Boolean => {
    let curUserStr: string | undefined = sessionStorage.getItem('userState') || undefined;
    if (!curUserStr)
        return false;
    return JSON.parse(curUserStr).isLogin;
}