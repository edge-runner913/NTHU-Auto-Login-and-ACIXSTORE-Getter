# ~~中~~清華大學校務系統 自動登入 & 獲取ACIXSTORE - NTHU auto login & ACIXSTORE getter

## 前置要求

### TypeScript

安裝[node.js](https://nodejs.org/zh-tw/download/)（建議版本 18 以上）。

使用TypeScript編寫。

### Python

需要安裝[uv (python 套件管理工具)](https://docs.astral.sh/uv/)，請依uv網站指示安裝。

`uv`創建的虛擬環境自帶Python 3.10，因此也**不需要安裝Python**。

檔案較大，請耐心等待。

## 使用說明

>[!NOTE]
> 可以在main.ts中，將`你的帳號`與`你的密碼`分別替換成你的帳號與密碼，如下所示：
>
>```typescript
>const account: string = '你的帳號';
>const password: string = '你的密碼';
>```
>
>或將`.env.example`改名為`.env`檔案放在專案根目錄，內容如下：
>
>```env
>ACCOUNT=你的帳號
>PASSWORD=你的密碼
>```
>
> 或是執行時不提供，會要求輸入。

開啟命令提示字元或終端機，`cd`進入專案資料夾後

依序執行以下指令：

`npm i`

`npx tsc`

`npm start` (或 `node NTHU_login.js`)

之後會自動讀取驗證碼。

如無提供帳號/密碼，則會要求輸入。

跑完之後，會顯示你的ACIXSTORE值，並return ACIXSTORE。

## 運行結果

NTHU_login函式會回傳ACIXSTORE值。格式為字串。

## 注意事項

~~照慣例求個star 雖然我不是本系~~

本程式僅供練習與本校學生之學習用途。

本程式不會竊取你的帳號密碼 ~~我沒那麼聰明~~ ，請安心使用。

本人不負責任何因使用此程式碼所產生的法律問題，請勿用於從事違法行為。

本程式僅用於寬帶測試~~不是校務系統伺服器的寬帶測試~~，下載後請於 24 小時內刪除。
