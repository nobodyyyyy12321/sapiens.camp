<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>全螢幕心智圖</title>
    <style>
        /* 1. 移除網頁預設的邊距 */
        body, html { 
            margin: 0; 
            padding: 0; 
            width: 100%; 
            height: 100%; 
            overflow: hidden; /* 防止出現捲軸 */
            background-color: #f8fafc;
        }

        /* 2. 強制 Markmap 容器撐滿全螢幕 */
        .markmap-container {
            width: 100vw;
            height: 100vh;
        }

        .markmap {
            width: 100%;
            height: 100%;
        }

        /* 3. 讓字體稍微大一點，看得更清楚 */
        .markmap > svg {
            width: 100%;
            height: 100%;
            font-size: 16px; 
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/markmap-autoloader"></script>
    <script>
    window.addEventListener('DOMContentLoaded', () => {
        function setVertical() {
            const svg = document.querySelector('.markmap > svg');
            if (svg && svg.markmap) {
                svg.markmap.options = {
                    ...svg.markmap.options,
                    direction: 'TB' // Top-Bottom，直式
                };
                svg.markmap.fit();
                return true;
            }
            return false;
        }
        if (!setVertical()) {
            setTimeout(setVertical, 600);
        }
    });
    </script>
</head>
<body>

<div class="markmap-container">
    <div class="markmap">
    # 題庫總目錄
    ## 英文文法
    ### 時態
    #### 過去式
    #### 現在式
    ### 子句
    ## 單字分類
    ### 商業
    ### 旅遊
    </div>
</div>

</body>
</html>