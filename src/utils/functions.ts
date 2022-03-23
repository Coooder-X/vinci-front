import { UserState } from "../model/userStore";

export const getCurUser = (): Player | undefined => {
    let curUserStr: string | undefined = sessionStorage.getItem('userState') || undefined;
    if (!curUserStr)
        return undefined;
    return JSON.parse(curUserStr).player;
}

export const getIsLogin = (): Boolean => {
    let curUserStr: string | undefined = sessionStorage.getItem('userState') || undefined;
    if (!curUserStr)
        return false;
    return JSON.parse(curUserStr).isLogin;
}