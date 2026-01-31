import sys
from ddddocr import DdddOcr  # type: ignore

def main() -> None:
    try:
        # 獲取圖片路徑
        if len(sys.argv) < 2:
            raise Exception("找不到圖片路徑。") # 不是，哥們，你路徑呢？
        image_path: str = sys.argv[1]

        # initialize ddddocr (關閉廣告訊息)
        ocr = DdddOcr(show_ad=False)

        # 讀取圖片bits
        with open(image_path, 'rb') as file:
            img_bytes = file.read()

		# print result
        print(ocr.classification(img_bytes))

    except Exception as e:
        print(f"錯誤: {str(e)}")

if __name__ == '__main__':
    main()