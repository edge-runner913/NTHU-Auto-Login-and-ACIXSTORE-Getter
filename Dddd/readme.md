# 透過Dddd.py 自動讀取驗證碼

## 介紹

用`Dddd.py`的OCR功能來讀取NTHU登入頁面的驗證碼圖片

問就是我找不到JavaScript的OCR套件，Tesseract又常常失敗。

## Requirements

套件列表可用`uv sync`安裝。包含Python環境等也會自動處理。

本套件使用`Python 3.10`，裡面的很多東西也是舊版本的，不然Dddd.py跑不動。

## 使用方法

`./Dddd/.venv/Scripts/python.exe ./Dddd/ocr.py <圖片路徑>`

自動調用方法：見`pyOCR.ts`

---

~我想念npm了~
