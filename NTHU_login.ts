import axios from "axios";
import FormData from "form-data";
import inquirer from "inquirer";
import sharp from "sharp";

import { captcha, imagePath } from "./captcha.js";
import { pyOCR } from './pyOCR.js';

// ================ 手動設定區域 =================

const account: string = '你的帳號';
const password: string = '你的密碼';

// ==============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function NTHU_login(account: string, password: string): Promise<string | void> {
	// 取得驗證碼ID (fnstr)
	const fnstr: string = await captcha()
		.catch((err) => {
			throw new Error('取得驗證碼失敗：' + err);
		});

	const passwd2: number = await (async (): Promise<number> => {
		try {
			console.info('正在調用 Dddd.py 識別驗證碼...');
			const num = parseInt(await pyOCR(imagePath), 10);
			if (num > 999999) throw new Error('超出六位數範圍');
			console.log('識別結果:', num.toString().padStart(6, '0'));
			return num;
		} catch (err) {
			console.error(`使用 Dddd.py 識別失敗：${err}，請手動輸入驗證碼。`);

			const imagePrompt = await sharp(imagePath)
				.grayscale()      // 轉灰度
				.threshold(150)   // 二值化，過濾掉淺色的背景干擾
				.toFile(imagePath + '_1.png')
				.then(() => `處理後的 ${imagePath + '_1.png'} 或 ${imagePath}`)
				.catch((err) => {
					console.error('處理驗證碼圖片失敗：' + err);
					return imagePath;
				});

			const { num_1 } = await inquirer.prompt([{
				type: "number",
				name: 'num_1',
				message:
					`請手動查看 ${imagePrompt} \n` +
					`並輸入六位數驗證碼:`,
				validate: (input: number) => (
					typeof input === 'number' && !isNaN(input) &&
					0 <= input && input <= 999999) ||
					'請輸入有效的六位數驗證碼'
			}]);
			return num_1;
		}
	})();

	// ======== 帳號 & 密碼 ========
	if (account === '' || account === "你的帳號" ||
		password === '' || password === "你的密碼") {
		console.warn('未設定帳號和密碼，請先輸入：');
		({ account, password } = await inquirer.prompt([
			{
				type: "input",
				name: "account",
				message: "請輸入帳號：",
			},
			{
				type: "input",
				name: "password",
				message: "請輸入密碼：",
			}
		]));
	}

	// ======== 發送登入請求 ========
	const url = "https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/pre_select_entry.php";
	const payload = new FormData();
	payload.append('account', account); // 帳號
	payload.append('passwd', password); 	// 密碼
	payload.append('passwd2', passwd2.toString().padStart(6, '0')); // 驗證碼
	payload.append('Submit', '%B5n%A4J');
	payload.append('fnstr', fnstr);	// 驗證碼ID

	const headers = {
		Accept: "application/json, text/plain, */*",
		...payload.getHeaders(),
	};

	try {
		console.info(`正在嘗試登入...`);
		const response: string | undefined = (await axios.post(url, payload, { headers }))?.data;

		// 分析回傳結果
		if (!response) {
			throw new Error('伺服器無回傳資料，請稍後再試。');
		} else if (response.includes('System Error')) {
			throw new Error('系統錯誤！');
		} else if (response.includes('Authentication ID')) {
			throw new Error('驗證碼錯誤！');
		} else if (response.includes('alert(')) {
			const err = response.match(/alert\('(.+)'\);/)?.[1] || '未知錯誤';
			console.error(err);
			throw new Error(err);
		} else if (!response.includes('ACIXSTORE')) {
			throw new Error('回傳資料中缺少必要的ACIXSTORE。');
		}

		const { ACIXSTORE, hint } = extract(response, 'ACIXSTORE', 'hint');
		console.info(`ACIXSTORE: ${ACIXSTORE}, hint: ${hint}`);
		if (hint !== account) {
			console.warn('帳號與回傳值不符，可能登入失敗。');
		}
		return ACIXSTORE;
	} catch (err) {
		console.error('錯誤：' + err);
	}
}

// 從html字串中提取參數值
function extract(input: string, ...params: Array<string>): Record<string, string> {
	const result: Record<string, string> = {};
	for (const param of params) {
		const value = input.replace('>', '').split(`${param}=`)[1]?.split('&')[0];
		result[param] = (value) ? value.split('&')[0].trim() : '';
	}
	return result;
}

await NTHU_login(account, password);