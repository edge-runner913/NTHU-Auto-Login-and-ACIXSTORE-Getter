import { NTHU_login } from "./NTHU_login.js";

// ================ 手動設定區域 =================

const account: string = '你的帳號';
const password: string = '你的密碼';

// ==============================================

await NTHU_login(account, password);