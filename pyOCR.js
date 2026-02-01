import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';
// 調用 Dddd.py 識別驗證碼
export function pyOCR(imagePath) {
    return new Promise((resolve, reject) => {
        const pythonPath = path.resolve('Dddd', '.venv', 'Scripts', 'python.exe');
        const scriptPath = path.resolve('Dddd', 'ocr.py');
        const imgPath = path.resolve(imagePath);
        if (!fs.existsSync(path.resolve('Dddd', '.venv'))) {
            try {
                console.info('正在以uv建立虛擬環境，請稍候...');
                spawnSync('uv', ['--version'], { stdio: 'ignore' });
                spawnSync('uv', ['sync'], {
                    cwd: path.resolve('Dddd'),
                    shell: true,
                    stdio: 'inherit'
                });
            }
            catch (e) {
                console.error('錯誤：請先安裝 uv (https://docs.astral.sh/uv/)');
                console.error("請輸入以下指令，安裝uv：\n" + `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`);
                process.exit(1);
            }
        }
        // $ python ocr.py captcha.png
        const pythonProcess = spawn(pythonPath, [scriptPath, imgPath]);
        let result, error;
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
            }
            else {
                // 去除換行
                resolve(result.trim());
            }
        });
    });
}
