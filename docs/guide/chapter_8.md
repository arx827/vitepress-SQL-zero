---
title: 第 8 章 SQL 進階處理功能
---

# 第 8 章 SQL 進階處理功能

## 8-1 各式各樣的函數
  ::: info 學習重點
  - 視窗函數能達成加上排名順序或流水編號等，一般彙總函數所做不到的進階操作。
  - 理解 PARTITION BY 和 ORDER BY 這 2 個關鍵字的意義。
  :::

### 什麼是視窗函數
  `視窗函數 (Window Function)` 也稱為 `OLAP函數`。

  所謂 `OLAP` 是 `OnLine Analytical Processing` 的簡稱，即為「 `線上分析處理` 」，意指在使用資料庫的時候，即時完成資料分析的處理工作。例如：市場分析、製作各種財務報表、提出企劃案...等。

  而 `視窗函數` 正是為了實現 `OLAP` 的操作方式，添加至 `標準 SQL` 中的功能。

  > ### COLUMN 視窗函數的支援現況
  > `關聯式資料庫` 開始具有這些 `OLAP` 用途的功能，也不過是最近 10 年左右的事情。
  > 因為是新增加的功能，所以還有一些 `DBMS` 尚未支援。

### 視窗函數的語法
  ::: warning 語法 8-1
  視窗函數
  ```SQL
  <視窗函數> OVER ([PARTITION BY <欄位串列>]
                    ORDER BY <排列用欄位串列>)
  ```
  :::
  
  這裡的重點在於 `PARTITION BY` 以及 `ORDER BY`，先理解這 2 個關鍵字所扮演的角色，便是理解 `視窗函數` 的第 1 步。

  - #### 可做為 `視窗函數` 使用的函數
    視窗函數大致上可分為下列 2 種類型：
    - ① 當作視窗函數使用的彙總函數 (`SUM`、`AVG`、`COUNT`、`MAX`、`MIN`)
    - ② `RANK`、`DENSE_RANK`、`ROW_NUMBER` 等視窗專用函數

    ② 是 標準 SQL 為 OLAP 用途所設定的專用函數，統一稱之為「 視窗專用函數 」。
    
    將 ① 的彙總函數寫在「 語法 8-1 」的 <視窗函數> 位置，便能當作視窗函數來使用。

### 基本使用方式 - 以 RANK 函數為例
  `RANK` 這個函數，是能對各筆紀錄加上 `排名順序 (Ranking)` 的函數。

  ::: warning 範例 8-1
  根據商品分類製作販售單價由小到大的排行榜

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`
  ```SQL
  SELECT shohin_name, shohin_catalg, sell_price, RANK() OVER (PARTITION BY shohin_catalg
                                                            ORDER BY sell_price) AS ranking
  FROM Shohin;
  ```

  執行結果
  | shohin_name | shohin_catalg | sell_price | ranking |
  |-------------|---------------|-----------:|--------:|
  | 叉子         | 廚房用品       |        500 |       1 |
  | 刨絲器       | 廚房用品       |        880 |       2 |
  | 菜刀         | 廚房用品       |       3000 |       3 |
  | 壓力鍋       | 廚房用品       |       6800 |       4 |
  | T恤          | 衣物          |       1000 |       1 |
  | 襯衫         | 衣物          |       4000 |       2 |
  | 鋼珠筆       | 辦公用品       |        100 |       1 |
  | 打孔機       | 辦公用品       |        500 |       2 |
  :::

  `PARTITION BY` 用來指定加上順位的對象範圍，由於需要在不同商品分類的範圍中，替該商品分類的商品加上名次，所以指定了 `shohin_catalg`。

  `ORDER BY` 則是用來設定按照哪個欄位，以什麼樣的順序加上名次。因為需要按照販售單價的升冪順序加上名次，所以指定了 `sell_price` 欄位。可以加上 `ASC`、`DESC` 關鍵字來指定升冪或降冪順序。

  ::: tip 牢記的原則 8-1
  視窗函數同時兼具切割分群和賦予順序等 2 種功能。
  :::

  經過 `PARTITION BY` 劃分之後所得的紀錄集合稱為「 `視窗 (Window)` 」，代表「 `範圍` 」的意思。

  ::: tip 牢記的原則 8-2
  `PARTITION BY` 劃分之後所得的部分集合稱為「 `視窗` 」。
  :::

### 也可以不指定 PARTITION BY
  `PARTITION BY` 並非絕對必要的部分，即使不指定 `PARTITION BY`，便是把整個資料表視為 1 個大型的視窗來處理。

  ::: warning 範例 8-2
  不指定 PARTITION BY 的寫法

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`
  ```SQL
  SELECT shohin_name, shohin_catalg, sell_price,
         RANK() OVER (ORDER BY sell_price) AS ranking
  FROM Shohin;
  ```

  執行結果
  | shohin_name | shohin_catalg | sell_price | ranking |
  |-------------|---------------|-----------:|--------:|
  | 鋼珠筆       | 辦公用品       |        100 |       1 |
  | 叉子         | 廚房用品       |        500 |       2 |
  | 打孔機       | 辦公用品       |        500 |       2 |
  | 刨絲器       | 廚房用品       |        880 |       4 |
  | T恤          | 衣物          |       1000 |       5 |
  | 菜刀         | 廚房用品       |       3000 |       6 |
  | 襯衫         | 衣物          |       4000 |       7 |
  | 壓力鍋       | 廚房用品       |       6800 |       8 |

  此次則變為對資料表中的所有商品一起做排行
  :::

### 常用的視窗專用函數
  - #### RANK 函數
    計算對象欄位的排行名次，當有多筆紀錄具有相同名次時，後續的名次會按照相同名次的數量順延跳過。
    
    如： 第 1 名有 3 筆紀錄的狀況：
    > 第 1 名、第 1 名、第 1 名、第 4 名

  - #### DENSE_RANK 函數
    同樣是計算排行名次的函數，不過即使有多筆紀錄具有相同的名次，後續的名次也不會跳過處理。

    如： 第 1 名有 3 筆紀錄的狀況：
    > 第 1 名、第 1 名、第 1 名、第 2 名
  
  - #### ROW_NUMBER 函數
    替各筆紀錄加上流水編號。

    如： 第 1 名有 3 筆紀錄的狀況：
    > 第 1 名、第 2 名、第 3 名、第 4 名

  ::: warning 範例 8-4
  比較 `RANK`、`DENSE_RANK`、`ROW_NUMBER` 的結果

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`
  ```SQL
  SELECT shohin_name, shohin_catalg, sell_price,
        RANK() OVER (ORDER BY sell_price) AS ranking
        DENSE_RANK() OVER (ORDER BY sell_price) AS dense_ranking
        ROW_NUMBER() OVER (ORDER BY sell_price) AS row_num
  FROM Shohin;
  ```

  執行結果
  | shohin_name | shohin_catalg | sell_price | ranking |dense_ranking|row_num|
  |-------------|---------------|-----------:|--------:|--------:|--------:|
  | 鋼珠筆       | 辦公用品       |        100 |       1 |       1 |       1 |
  | 叉子         | 廚房用品       |        500 |       2 |       2 |       2 |
  | 打孔機       | 辦公用品       |        500 |       2 |       2 |       3 |
  | 刨絲器       | 廚房用品       |        880 |       4 |       3 |       4 |
  | T恤          | 衣物          |       1000 |       5 |       4 |       5 |
  | 菜刀         | 廚房用品       |       3000 |       6 |       5 |       6 |
  | 襯衫         | 衣物          |       4000 |       7 |       6 |       7 |
  | 壓力鍋       | 廚房用品       |       6800 |       8 |       7 |       8 |
  :::
  
  ::: tip 牢記的原則 8-3
  由於視窗專用函數不會引用參數，所以括號()中，不需填入任何東西。
  :::

### 視窗函數應當寫在何處
  ::: tip 牢記的原則 8-4
  視窗函數原則上僅能寫在 `SELECT 子句` 之中。
  :::

  理由在於 `DBMS` 內部的執行方式，因為視窗函數在運作上，便是針對 `WHERE 子句` 或 `GROUP BY 子句` 處理後所獲得的「 `中間結果` 」產生作用。例如在名次排列完成之後，如果又因為 `WHERE 子句` 的條件而減少紀錄筆數、或是 `GROUP BY 子句` 的作用而再進行彙總統計，那麼先前的排行結果當然會發生問題。

### 將彙總函數當作視窗函數使用
  所有的彙總函數都可以當作視窗函數使用，在這種使用方式之下，其語法和使用視窗函數的時候完全相同。

  ::: warning 範例 8-4
  將 SUM 函數當作視窗函數使用

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`、
  ```SQL
  SELECT shohin_id, shohin_name, sell_price,
         SUM(sell_price) OVER (ORDER BY shohin_id) AS current_sum
  FROM Shohin;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | current_sum |
  |----------:|-------------|-----------:|------------:|
  |      0001 | T恤         |       1000 |        1000 |
  |      0002 | 打孔機       |        500 |        1500 |
  |      0003 | 襯衫         |       4000 |        5500 |
  |      0004 | 菜刀         |       3000 |        8500 |
  |      0005 | 壓力鍋       |       6800 |       15300 |
  |      0006 | 叉子         |        500 |       15800 |
  |      0007 | 刨絲器       |        880 |       16680 |
  |      0008 | 鋼珠筆       |        100 |       16780 |

  - 0001 -> 1000
  - 0002 -> 1000 + 500
  - 0003 -> 1000 + 500 + 4000
  :::

  使用 `SUM 函數` 的時候不同於 `RANK` 或 `ROW_NUMBER`，需要在 `()括號` 中填入參數，和之前學過的使用方式一樣，應當指定統計對象的欄位名稱。

  不過這並非單純的總計值，而是先利用 `ORDER BY 子句`，指定紀錄按照 `shohin_id` 由小到大排列之後，再計算商品ID「 `比自己還小` 」的商品販售單價總計，每往下一行紀錄，計算總計的對象紀錄也會增加 1 筆，而這樣的統計方式，通常稱為「 `累計` 」。實務上也經常按照時間的順序，計算各段時間營業金額的累計數字。

  ::: warning 範例 8-5
  將 AVG 函數當作視窗函數使用

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`、
  ```SQL
  SELECT shohin_id, shohin_name, sell_price,
         AVG(sell_price) OVER (ORDER BY shohin_id) AS current_avg
  FROM Shohin;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price |           current_sum |
  |----------:|-------------|-----------:|----------------------:|
  |      0001 | T恤         |       1000 | 1000.0000000000000000 |
  |      0002 | 打孔機       |        500 |  750.0000000000000000 |
  |      0003 | 襯衫         |       4000 | 1833.3333333333333333 |
  |      0004 | 菜刀         |       3000 | 2125.0000000000000000 |
  |      0005 | 壓力鍋       |       6800 | 3060.0000000000000000 |
  |      0006 | 叉子         |        500 | 2633.3333333333333333 |
  |      0007 | 刨絲器       |        880 | 2382.8571428571428571 |
  |      0008 | 鋼珠筆       |        100 | 2097.5000000000000000 |

  - 0001 -> (1000) / 1
  - 0002 -> (1000 + 500) / 2
  - 0003 -> (1000 + 500 + 4000) / 3
  :::

  觀察執行的結果，應該可以看出 `current_avg` 是計算販售單價的平均值，不過統計的對象只有包含「 `自身上方` 」的紀錄。

  像這樣以「 自身紀錄 (`當前紀錄`) 」為基準來決定統計對象的特點，便是將彙總函數當作視窗函數使用時的一大特色。

### 計算移動平均
  `視窗函數` 在執行的時候，會先從資料表切割出名為 `視窗` 的部分資料集合，然後進行附加順序的動作，不過對於視窗之中的資料，其實還有額外的選項功能，可以進一步指定更加精細的統計範圍，而這樣更精細的統計範圍被稱做「 `窗格(Frame)` 」。

  ::: warning 範例 8-6
  設定統計對象為「 最近 3 筆紀錄 」

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`、
  ```SQL
  SELECT shohin_id, shohin_name, sell_price,
         AVG(sell_price) OVER (ORDER BY shohin_id ROWS 2 PRECEDING) AS moving_avg
  FROM Shohin;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | moving_avg |
  |----------:|-------------|-----------:|-----------:|
  |      0001 | T恤         |       1000 |       1000 |
  |      0002 | 打孔機       |        500 |        750 |
  |      0003 | 襯衫         |       4000 |       1833 |
  |      0004 | 菜刀         |       3000 |       2500 |
  |      0005 | 壓力鍋       |       6800 |       4600 |
  |      0006 | 叉子         |        500 |       3433 |
  |      0007 | 刨絲器       |        880 |       2726 |
  |      0008 | 鋼珠筆       |        100 |        493 |

  - 0001 -> (1000) / 1
  - 0002 -> (1000 + 500) / 2
  - 0003 -> (1000 + 500 + 4000) / 3
  - 0004 -> (500 + 4000 + 3000) / 3
  - 0005 -> (4000 + 3000 + 6800) / 3
  :::

  - #### 指定窗格 (統計範圍)
    這裡使用了 `ROWS (橫行、紀錄)` 以及 `PRECEDING (之前的)` 這 2 個關鍵字，設定出「 `包含前 ～ 筆紀錄` 」的窗格，以「 `ROWS 2 PRECEDING` 」的寫法，指定「 `包含前 2 筆紀錄` 」的窗格，將統計對象限制在下列的「 `最近 3 筆紀錄` 」。
    - 自身 (當前紀錄)
    - 自身前 1 行的紀錄
    - 自身前 2 行的紀錄

    藉由當前紀錄的位置，以相對的方式決定窗格的範圍，所以和視窗的固定範圍不同，目前的 `當前紀錄` 不同時，納入統計的範圍也會發生改變。

    這樣的統計方式稱為 `移動平均 (Moving Average)`，由於對於想要時常掌握「 `最近的狀況` 」來說相當方便，所以經常應用於追蹤股價趨勢之類的場合。 

    另外，若改以 `FOLLOWING (之後的)` 這個關鍵字取代 `PRECEDING`，便能指定「 包含後 ～ 筆紀錄 」的窗格範圍。

  - #### 將當前紀錄前後的紀錄都納入統計對象
    如果想更進一步，讓當前紀錄前後的紀錄同時成為統計的對象，可以合併使用 `PRECEDING (之前的)` 以及 `FOLLOWING (之後的)` 這 2 個關鍵字。

    ::: warning 範例 8-7
    將當前紀錄前後的紀錄都納入統計對象

    - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`、
    ```SQL
    SELECT shohin_id, shohin_name, sell_price,
          AVG(sell_price) OVER (ORDER BY shohin_id
                                ROWS BETWEEN 1 PRECEDING
                                AND 1 FOLLOWING) AS moving_avg
    FROM Shohin;
    ```

    執行結果
    | shohin_id | shohin_name | sell_price | moving_avg |
    |----------:|-------------|-----------:|-----------:|
    |      0001 | T恤         |       1000 |        750 |
    |      0002 | 打孔機      |        500 |       1833 |
    |      0003 | 襯衫        |       4000 |       2500 |
    |      0004 | 菜刀        |       3000 |       4600 |
    |      0005 | 壓力鍋      |       6800 |       3433 |
    |      0006 | 叉子        |        500 |       2726 |
    |      0007 | 刨絲器      |        880 |        493 |
    |      0008 | 鋼珠筆      |        100 |        490 |

    - 0001 -> (1000 + 500) / 2
    - 0002 -> (1000 + 500 + 4000) / 3
    - 0003 -> (500 + 4000 + 3000) / 3
    - 0004 -> (4000 + 3000 + 6800) / 3
    - 0005 -> (3000 + 6800 + 500) / 3
    :::

    這樣的窗格指定方式，代表以「 `1 PRECEDING` 」(前 1 筆紀錄) 至「 `1 FOLLOWING` 」(後 1 筆紀錄) 為統計對象，具體來說便是下列的 3 筆紀錄。
    - 自身前 1 行的紀錄
    - 自身 (當前紀錄)
    - 自身後 1 行的紀錄

    ::: tip 牢記的原則 8-5
    把 `彙總函數` 當 `視窗函數` 使用的時候，可以用 `當前紀錄為基準` 來決定統計對象紀錄。
    :::
    
### 2個 ORDER BY
  `OVER 子句` 中 `ORDER BY` 的功能，充其量只能決定 `視窗函數` 應該以哪個欄位的順序執行運算，所以並不會影響到最終結果的排序。
  
  雖然有些 `DBMS` 所顯示的結果，會按照 `視窗函數` 後面的 `ORDER BY 子句` 所指定的欄位來排序，不過這屬於開發商自行增加的功能。

  ::: warning 範例 8-8
  無法保證此段 SELECT 敘述執行結果的排列順序

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`
  ```SQL
  SELECT shohin_name, shohin_catalg, sell_price,
         RANK() OVER (ORDER BY sell_price) AS ranking
  FROM Shohin;
  ```

  執行結果
  | shohin_name | shohin_catalg | sell_price | ranking |
  |-------------|---------------|-----------:|--------:|
  | 菜刀         | 廚房用品       |       3000 |       6 |
  | 打孔機       | 辦公用品       |        500 |       2 |
  | 襯衫         | 衣物          |       4000 |       7 |
  | T恤          | 衣物          |       1000 |       5 |
  | 壓力鍋       | 廚房用品       |       6800 |       8 |
  | 叉子         | 廚房用品       |        500 |       2 |
  | 刨絲器       | 廚房用品       |        880 |       4 |
  | 鋼珠筆       | 廚房用品       |        100 |       1 |
  :::

  如果想讓各筆紀錄確實按照 `ranking` 欄位由小到大排列的話，只需在 `SELECT 敘述` 的最後，再加上 1 個 `ORDER BY 子句` 指定排序的欄位即可。

  ::: warning 範例 8-9
  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`、`MariaDB 10.2 之後`
  ```SQL
  SELECT shohin_name, shohin_catalg, sell_price,
         RANK() OVER (ORDER BY sell_price) AS ranking
  FROM Shohin
  ORDER BY ranking;
  ```

  執行結果
  | shohin_name | shohin_catalg | sell_price | ranking |
  |-------------|---------------|-----------:|--------:|
  | 鋼珠筆       | 廚房用品       |        100 |       1 |
  | 打孔機       | 辦公用品       |        500 |       2 |
  | 叉子         | 廚房用品       |        500 |       2 |
  | 刨絲器       | 廚房用品       |        880 |       4 |
  | T恤          | 衣物          |       1000 |       5 |
  | 菜刀         | 廚房用品       |       3000 |       6 |
  | 襯衫         | 衣物          |       4000 |       7 |
  | 壓力鍋       | 廚房用品       |       6800 |       8 |
  :::

## 8-2 GROUPING 運算子
  ::: info 學習重點
  - 光靠 `GROUP BY 子句` 以及 `彙總函數`，無法同時求得小計和總計的數字，而能達成此目的的功能便是 `GROUPING 運算子`。
  - 理解 `GROUPING 運算子` `CUBE` 功能的關鍵，在於想像它是「 以積木疊成的立方體 」。
  - 雖然 `GROUPING 運算子` 屬於 標準SQL 的功能，不過還有部分的 `DBMS` 無法使用。
  :::

### 一併列出總計行
  ::: warning 範例 8-10
  以 GROUP BY 子句 無法列出總計的紀錄

  ```SQL
  SELECT shohin_catalg, SUM(sell_price)
  FROM Shohin
  GROUP BY shohin_catalg;
  ```

  執行結果
  | shohin_catalg |   sum |
  |---------------|------:|
  | 衣物          |  5000 |
  | 辦公用品       |   600 |
  | 廚房用品       | 11180 |
  :::

  由於 `GROUP BY 子句` 是用來指定做為彙總鍵的欄位，敘述執行時只會按照其中指定的彙總鍵來分割資料表，所以不會出現總計紀錄。

  如果想達成這樣的需求，可以先分別求得總計行、以及按照牤品分類進行統計的結果，然後再 `UNION ALL` 將2者串連在一起。

  ::: warning 範例 8-11
  分別求得 總計行 和 彙總結果，再以 UNION ALL 串聯

  ```SQL
  SELECT '合計' AS shohin_catalg, SUM(sell_price)
  FROM Shohin
  UNION ALL
  SELECT shohin_catalg, SUM(sell_price)
  FROM Shohin
  GROUP BY shohin_catalg;
  ```

  執行結果
  | shohin_catalg |   sum |
  |---------------|------:|
  | 合計           | 16780 |
  | 衣物           |  5000 |
  | 辦公用品        |   600 |
  | 廚房用品        | 11180 |
  :::

  雖然這樣也能獲得想要的結果，不過要先執行 2 段幾乎相同的 `SELECT 敘述`，然後再將結果串連輸出，不僅敘述看起來相當冗長，也會耗費更多 `DBMS` 內部處理的效能。

### ROLLUP - 1次取得總計與小計
  - #### `GROUPING 運算子` 有以下 3 類。
    - `ROLLUP`
    - `CUBE`
    - `GROUPING SETS`

  - #### ROLLUP 的使用方式
    只要使用此運算子的功能，即可簡單寫出能一併列出總計行的 `SELECT 敘述`。

    ::: warning 範例 8-12
    以 ROLLUP 同時列出總計與小計

    - 專用語法：`Oracle`、`DB2`、`SQL Server`、`PostgreSQL`
    ```SQL
    SELECT shohin_catalg, SUM(sell_price) AS sum_price
    FROM Shohin
    GROUP BY ROLLUP(shohin_catalg);
    ```

    執行結果 (DB2 的狀況)
    | shohin_catalg | sum_price |
    |---------------|----------:|
    |               |     16780 |
    | 廚房用品       |     11180 |
    | 辦公用品       |       600 |
    | 衣物          |      5000 |
    :::

    ::: warning 專用語法：`MySQL`、`MariaDB`
    在 `MySQL` 和 `MariaDB` 上執行 範例 8-12 的敘述時，需要將「 `GROUP BY ROLLUP(shohin_catalg)` 」的 `GROUP BY 子句` 部分改為 「 `GROUP BY shohin_catalg WITH ROLLUP` 」。

    `MariaDB 10.2.4` 的 `ROLLUP` 寫法和 `MySQL` 相同。
    :::

    在語法上，對於 `GROUP BY 子句` 的彙總鍵串列部分，可以寫成「 `ROLLUP(<欄位1>, <欄位2>, ...)` 」的形式。而假若要以 1 句話簡單說明此 `ROLLUP 演算法` 的功用，可以說「 `同時計算出彙總鍵在不同組合下的結果` 」。

    上面的範例，便是一併算出下列 2 種組合方式的統計結果。
    - `GROUP BY ()`
      相當於未指定彙總鍵，在這種狀況下會產生所有單價總和的總計行，而此總計列的紀錄稱為 `超級集合列 (Supergroup Row)`。只要理解到這是原本 `GROUP BY 子句` 所無法產生的總計列即可。
    - `GROUP BY (shohin_catalg)`

    由於對於 `DBMS` 來說是未知的鍵值，所以使用預設的 `NULL`，後面再解說如何改成填入適當的字串。

    ::: tip 牢記的原則 8-6
    超級集合列。
    :::

  - #### 在彙總鍵中增加「 登錄日期 」的例子
    ::: warning 範例 8-13
    在 GROUP BY 增加「 登錄日期 」的例子 (無 ROLLUP)
    ```SQL
    SELECT shohin_catalg, reg_date, SUM(sell_price) AS sum_price
    FROM Shohin
    GROUP BY shohin_catalg, reg_date;
    ```

    執行結果 (DB2 的狀況)
    | shohin_catalg | reg_date   | sum_price |
    |---------------|------------|----------:|
    | 廚房用品       | 2008-04-28 |       880 |
    | 廚房用品       | 2009-01-15 |      6800 |
    | 廚房用品       | 2009-09-20 |      3500 |
    | 辦公用品       | 2009-09-11 |       500 |
    | 辦公用品       | 2009-11-11 |       100 |
    | 衣物          | 2009-09-20 |      1000 |
    | 衣物          |            |      4000 |
    :::

    ::: warning 範例 8-14
    在 GROUP BY 增加「 登錄日期 」的例子 (有 ROLLUP)

    - 專用語法：`Oracle`、`DB2`、`SQL Server`、`PostgreSQL`
    ```SQL
    SELECT shohin_catalg, reg_date, SUM(sell_price) AS sum_price
    FROM Shohin
    GROUP BY ROLLUP(shohin_catalg, reg_date);
    ```

    執行結果 (DB2 的狀況)
    | shohin_catalg | reg_date   | sum_price |
    |---------------|------------|----------:|
    |               |            |     16780 |
    | 廚房用品       |            |     11180 |
    | 廚房用品       | 2008-04-28 |       880 |
    | 廚房用品       | 2009-01-15 |      6800 |
    | 廚房用品       | 2009-09-20 |      3500 |
    | 辦公用品       |            |       600 |
    | 辦公用品       | 2009-09-11 |       500 |
    | 辦公用品       | 2009-11-11 |       100 |
    | 衣物          |            |      5000 |
    | 衣物          | 2009-09-20 |      1000 |
    | 衣物          |            |      4000 |
    :::

    ::: warning 專用語法：`MySQL`、`MariaDB`
    在 `MySQL` 和 `MariaDB` 上執行 範例 8-14 的敘述時，需要將「 `GROUP BY ROLLUP(shohin_catalg, reg_date)` 」的 `GROUP BY 子句` 部分改為 「 `GROUP BY shohin_catalg, reg_date WITH ROLLUP` 」。
    :::

    加上 `ROLLUP` 之後的寫法，其結果多了最上方所有商品的總計列，以及 3 種商品分類個別的小計列 (也就是當作彙總鍵中沒有登錄日期的結果紀錄)，這 4 列紀錄均屬於 `超級集合列`。

    此 `SELECT 敘述` 的結果，相當於先執行下列 3 種模式的彙總層級，再以 `UNION` 串聯輸出結果。
    - `GROUP BY ()`
    - `GROUP BY (shohin_catalg)`
    - `GROUP BY (shohin_catalg, reg_date)`

    `ROLLUP` 具有從最小範圍的彙總統計層級開始，按照小計到總計的順序，逐漸擴展彙總統計的單位，其名稱便是根據這樣的意象而命名。

    ::: tip 牢記的原則 8-7
    `ROLLUP` 是能同時獲得總計與小計的方便工具。
    :::

  > ### COLUMN GROUPING 運算子的支援現況
  >  `GROUPING 運算子` 和 `視窗函數`，算是比較新的項目 (增加這些功能的標準SQL版本為：SQL:1999)，因此，還有一些 `DBMS` 尚未支援相關語法。最新版的 `Oracle`、`SQL Server`、`DB2` 以及 `PostgreSQL` 已經能完全支援，不過 `MySQL 5.7` 和 `MariaDB 10.2` 還無法使用。
  >
  >  在尚未支援 `GROUPING 運算子` 和 `DBMS` 上，想要以 `SQL 敘述` 同樣獲得包含總計和小計的結果時，只能採用舊有方法，將多段 `SELECT 敘述` 以 `UNION` 串聯輸出最後的結果。
  >
  >  另外，`MySQL` 和 `MariaDB` 的狀況又稍微有些複雜，只能使用變形過後的 `ROLLUP 語法`。
  >
  > ```SQL
  > -- MySQL、MariaDB
  > SELECT shohin_catalg, reg_date, SUM(sell_price) AS sum_price
  > FROM Shohin
  > GROUP BY shohin_catalg, reg_date WITH ROLLUP;
  > ```
  > 
  > `MySQL`、`MariaDB` 目前暫時無法支援 `CUBE` 和 `GROUPING SETS`。

### GROUPING函數 - 分辨 NULL 的真偽
  在前個單元 `ROLLUP` 的執行結果中，出現了 2 筆 `reg_date` 欄位為 `NULL` 的紀錄。

  `sum_price` 為 4000 元的這筆資料，在來源的資料表中，由於襯衫的登陸日期為 `NULL`，這裡照實列出了原本的 NULL。

  `sum_price` 為 5000 元的這筆資料，則應該是 `超級集合列` 的 `NULL`，不過這 2 者外觀上都是以 `NULL` 的形式呈現。

  | shohin_catalg | reg_date   | sum_price |
  |---------------|------------|----------:|
  | 衣物           |            |      5000 |
  | 衣物           | 2009-09-20 |      1000 |
  | 衣物           |            |      4000 |

  為了防止混亂狀況，`SQL` 特別準備了 `GROUPING 函數`，用來判別是否為 `超級集合列` 的 `NULL`。如果寫入其參數位置的欄位內容值為 `超級集合列` 的 `NULL` 時，此函數會回傳 `1`，而其他的內容值則會回傳 `0`。

  ::: warning 範例 8-15
  利用 GROUPING 函數判別 NULL

  - 專用語法：`Oracle`、`DB2`、`SQL Server`、`PostgreSQL`
  ```SQL
  SELECT GROUPING(shohin_catalg) AS shohin_catalg,
         GROUPING(reg_date) AS reg_date,
         SUM(sell_price) AS sum_price
  FROM Shohin
  GROUP BY ROLLUP(shohin_catalg, reg_date);
  ```

  執行結果 (DB2 的狀況)
  | shohin_catalg | reg_date | sum_price |
  |--------------:|---------:|----------:|
  |             1 |        1 |     16780 |
  |             0 |        1 |     11180 |
  |             0 |        0 |       880 |
  |             0 |        0 |      6800 |
  |             0 |        0 |      3500 |
  |             0 |        1 |       600 |
  |             0 |        0 |       500 |
  |             0 |        0 |       100 |
  |             0 |        1 |      5000 |
  |             0 |        0 |      1000 |
  |             0 |        0 |      4000 |
  :::

  若能善加利用 `GROUPING 函數` 的功能，還能進一步在 `超級集合列` 的彙總鍵欄位內容內，填入適當的文字。其基本原理為當 `GROUPING 函數` 的回傳值為 1 的時候，指定顯示「 總計 」或「 小計 」之類的自訂文字，而其他回傳值則保持原始資料的內容值。

  ::: warning 範例 8-16
  將超級集合列的鍵值改為適當的字串

  - 專用語法：`Oracle`、`DB2`、`SQL Server`、`PostgreSQL`
  ```SQL
  SELECT CASE WHEN GROUPING(shohin_catalg) = 1
              THEN '商品分類 總計'
              ELSE shohin_catalg END AS shohin_catalg,
         CASE WHEN GROUPING(reg_date) = 1
              THEN '登錄日期 總計'
              ELSE CAST(reg_date AS VARCHAR(16)) END AS reg_date,
         SUM(sell_price) AS sum_price
  FROM Shohin
  GROUP BY ROLLUP(shohin_catalg, reg_date);
  ```

  執行結果 (DB2 的狀況)
  | shohin_catalg |      reg_date | sum_price |
  |---------------|--------------:|----------:|
  | 商品分類 總計   | 登錄日期 總計   |     16780 |
  | 廚房用品       | 登錄日期 總計   |     11180 |
  | 廚房用品       |    2008-04-28 |       880 |
  | 廚房用品       |    2009-01-15 |      6800 |
  | 廚房用品       |    2009-09-20 |      3500 |
  | 辦公用品       | 登錄日期 總計   |       600 |
  | 辦公用品       |    2009-09-11 |       500 |
  | 辦公用品       |    2009-11-11 |       100 |
  | 衣物          | 登錄日期 總計   |      5000 |
  | 衣物          |    2009-09-20 |      1000 |
  | 衣物          |               |      4000 |
  :::

  ```SQL
  CAST(reg_date AS VARCHAR(16))
  ```
  將 `reg_date` 欄位轉換成字串型別，是因為 `CASE 運算式` 所有分支處理的回傳值，其型別必須完全一致，上面的型別轉換措施，便是為了符合這樣的規則。如果沒有加上這個動作，執行時將會造成語法錯誤。

  ::: tip 牢記的原則 8-8
  使用 `GROUPING 函數`，即可簡單區分出原始資料的 `NULL` 和 `超級集合列` 的 `NULL`。
  :::

### CUBE - 將資料堆疊成積木
  CUBE 運算子，此英文單字代表了「 立方體 」的意思。

  ::: warning 範例 8-17
  以 CUBE 取得所有可能的組合

  - 專用語法：`Oracle`、`DB2`、`SQL Server`、`PostgreSQL`
  ```SQL
  SELECT CASE WHEN GROUPING(shohin_catalg) = 1
              THEN '商品分類 總計'
              ELSE shohin_catalg END AS shohin_catalg,
         CASE WHEN GROUPING(reg_date) = 1
              THEN '登錄日期 總計'
              ELSE CAST(reg_date AS VARCHAR(16)) END AS reg_date,
         SUM(sell_price) AS sum_price
  FROM Shohin
  GROUP BY CUBE(shohin_catalg, reg_date);
  ```

  執行結果 (DB2 的狀況)
  | shohin_catalg |      reg_date | sum_price |
  |---------------|--------------:|----------:|
  | 商品分類 總計   |   登錄日期 總計 |     16780 |
  | 商品分類 總計   |    2008-04-28 |       880 |
  | 商品分類 總計   |    2009-01-15 |      6800 |
  | 商品分類 總計   |    2009-09-11 |       500 |
  | 商品分類 總計   |    2009-09-20 |      4500 |
  | 商品分類 總計   |    2009-11-11 |       100 |
  | 商品分類 總計   |               |      4000 |
  | 廚房用品       |   登錄日期 總計 |     11180 |
  | 廚房用品       |    2008-04-28 |       880 |
  | 廚房用品       |    2009-01-15 |      6800 |
  | 廚房用品       |    2009-09-20 |      3500 |
  | 辦公用品       |   登錄日期 總計 |       600 |
  | 辦公用品       |    2009-09-11 |       500 |
  | 辦公用品       |    2009-11-11 |       100 |
  | 衣物          |   登錄日期 總計 |      5000 |
  | 衣物          |    2009-09-20 |      1000 |
  | 衣物          |               |      4000 |
  :::

  對比 `ROLLUP` 的結果，`CUBE` 執行之後會再多出幾行紀錄，觀察新增加的紀錄即可得知，這是在僅使用 `reg_date` 當作彙總鍵的狀況下新增加的紀錄。
  - `GROUP BY ()`
  - `GROUP BY (shohin_catalg)`
  - `GROUP BY (reg_date)`
  - `GROUP BY (shohin_catalg, reg_date)`

  `CUBE` 的功能是針對 `GROUP BY 子句` 中所寫入的彙總鍵，將「 `所有可能的組合方式` 」的結果，如同大雜燴一般同時輸出。

  ::: tip 牢記的原則 8-9
  可以將 `CUBE` 理解成先利用彙總鍵切割資料區塊，然後再堆疊成立方體的樣貌。
  :::

### GROUPING SETS - 只取出部分積木
  對於 `ROLLUP` 或 `CUBE` 所獲得的結果，如果只需要其中的部分紀錄時，便可使用此運算子。

  ::: warning 範例 8-18
  以 CUBE 取得所有可能的組合

  - 專用語法：`Oracle`、`DB2`、`SQL Server`、`PostgreSQL`
  ```SQL
  SELECT CASE WHEN GROUPING(shohin_catalg) = 1
              THEN '商品分類 總計'
              ELSE shohin_catalg END AS shohin_catalg,
         CASE WHEN GROUPING(reg_date) = 1
              THEN '登錄日期 總計'
              ELSE CAST(reg_date AS VARCHAR(16)) END AS reg_date,
         SUM(sell_price) AS sum_price
  FROM Shohin
  GROUP BY GROUPING SETS (shohin_catalg, reg_date);
  ```

  執行結果 (DB2 的狀況)
  | shohin_catalg |      reg_date | sum_price |
  |---------------|--------------:|----------:|
  | 商品分類 總計   |    2008-04-28 |       880 |
  | 商品分類 總計   |    2009-01-15 |      6800 |
  | 商品分類 總計   |    2009-09-11 |       500 |
  | 商品分類 總計   |    2009-09-20 |      4500 |
  | 商品分類 總計   |    2009-11-11 |       100 |
  | 商品分類 總計   |               |      4000 |
  | 廚房用品       |   登錄日期 總計 |     11180 |
  | 辦公用品       |   登錄日期 總計 |       600 |
  | 衣物          |   登錄日期 總計 |      5000 |
  :::

  在此結果當中，已經沒有全部商品的總計行 (16780 元)。像這樣相對於 `ROLLUP` 或 `CUBE` 在執行後會獲得有規律的、比較符合日常業務所需的資料，`GROUPING SETS` 則會指定個別的單獨條件，從中抽出較為特殊的部分結果。

## 自我練習
  - 8.1 如果對章節內文所使用過的 Shohin (商品) 資料表，執行如下所示的 `SELECT 敘述`，請預測一下將會得到什麼樣的結果。
    ```SQL
    SELECT shohin_id, shohin_name, sell_price,
           MAX(sell_price) OVER (ORDER BY shohin_id) AS current_max_price
    FROM Shohin;
    ```
    
    ::: details 練習
    | shohin_id | shohin_name | sell_price | current_max_price |
    |-----------|-------------|-----------:|------------------:|
    | 0001      | T恤         |       1000 |              1000 |
    | 0002      | 打孔機       |        500 |              1000 |
    | 0003      | 襯衫         |       4000 |              4000 |
    | 0004      | 菜刀         |       3000 |              4000 |
    | 0005      | 壓力鍋       |       6800 |              6800 |
    | 0006      | 叉子         |        500 |              6800 |
    | 0007      | 刨絲器       |        880 |              6800 |
    | 0008      | 鋼珠筆       |        100 |              6800 |

    `OVER` 中 缺少了 `PARTITION BY 子句` 來限制比較範圍。使 `current_max_price` 未依分類比較。
    
    應改為：
    ```SQL
    SELECT shohin_id, shohin_name, sell_price,
           MAX(sell_price) OVER (PARTITION BY shohin_catalg
                                 ORDER BY shohin_id) AS current_max_price
    FROM Shohin;
    ```
    :::

  - 8.2 接下來同樣使用 Shohin 資料表，在按照 `登錄日期` 將紀錄由小到大排列的狀況下，請同時求得各日期時間點上 `販售單價 (sell_price)` 的 總計金額。不過登錄日期為 `NULL` 的「 襯衫 」這筆紀錄必須排在 `第 1 行` 的位置 (也就是早於其他商品的登錄日期)。

    ::: details 練習
    ```SQL
    SELECT reg_date, SUM(sell_price) AS sum_price
    FROM Shohin
    GROUP BY reg_date
    ORDER BY reg_date;
    ```

    執行結果
    | reg_date   | sum_price |
    |------------|----------:|
    |            |      4000 |
    | 2008-04-28 |       880 |
    | 2009-01-15 |      6800 |
    | 2009-09-11 |       500 |
    | 2009-09-20 |      4500 |
    | 2009-11-11 |       100 |
    :::