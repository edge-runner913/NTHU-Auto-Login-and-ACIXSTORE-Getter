import { spawn } from 'child_process';
import path from 'path';

// 調用 Dddd.py 識別驗證碼
export function pyOCR(imagePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const pythonPath = path.resolve('Dddd', '.venv', 'Scripts', 'python.exe');
		const scriptPath = path.resolve('Dddd', 'ocr.py');
		const imgPath = path.resolve(imagePath);

		// $ python ocr.py captcha.png
		const pythonProcess = spawn(pythonPath, [scriptPath, imgPath]);

		let result: string, error: string;

		// use stdout and stderr to get data
		pythonProcess.stdout.on('data', (data) => {
			result = data.toString();
		});
		pythonProcess.stderr.on('data', (data) => {
			error = data.toString();
		});

		// when the process ends
		pythonProcess.on('close', (exit_code) => {
			if (exit_code !== 0) {
				reject(`錯誤代碼 ${exit_code}: ${error}`);
			} else {
				// 去除換行
				resolve(result.trim());
			}
		});
	});
}