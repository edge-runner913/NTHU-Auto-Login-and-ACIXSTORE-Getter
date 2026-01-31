import axios from "axios";
import * as cheerio from 'cheerio';
import fs from 'fs';
export const imagePath = 'captcha.png';
// 取得並儲存驗證碼圖片，回傳驗證碼ID (fnstr)
export async function captcha() {
    const loginUrl = 'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/';
    const response = (await axios.get(loginUrl))?.data; // 獲取html
    if (!response) {
        throw new Error('伺服器無回傳資料，請稍後再試。');
    }
    // 載入html，轉化成DOM結構
    const load = cheerio.load(response);
    // 從隱藏的 <input type="hidden" name="fnstr" value="..."> 中提取value
    const fnstr = load('input[name="fnstr"]').val();
    if (!fnstr || typeof fnstr !== 'string') {
        throw new Error('無法找到驗證碼ID (fnstr)。');
    }
    const imgUrl = `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/auth_img.php?pwdstr=${fnstr}`;
    const imgResponse = await axios.get(imgUrl, {
        responseType: 'arraybuffer',
        headers: {
            Accept: "application/json, text/plain, */*",
        }
    });
    fs.writeFileSync(imagePath, Buffer.from(imgResponse.data));
    console.info(`驗證碼已儲存為 ${imagePath}`);
    return fnstr;
}
