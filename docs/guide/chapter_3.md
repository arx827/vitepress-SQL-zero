---
title: 第 3 章 彙總與排序
---

<style>
  .red {
    color: #f43f5e;
  }
</style>

# 第 3 章 彙總與排序

## 3-1 查詢時彙總資料
  ::: info 學習重點
  - 計算資料表欄位的總計值或平均值等統計操作，需要利用彙總函數 (`Aggregate Function`、`Group Function`)
  - 彙總函數的統計結果基本上會排除 `NULL`，不過，只有 COUNT 函數的「 `COUNT(*)` 」用法，會計算包含 `NULL` 的所有紀錄筆數。
  - 排除重複值進行統計時，需要使用 `DISTINCT` 關鍵字。
  :::

### 彙總函數
  想利用 SQL 對資料執行某些操作或計算的時候，需要使用到名為「 `函數 (Function)` 」的輔助工具。

  想執行 「 計算資料表總共有多少筆紀錄 」的操作時，可以使用 `COUNT 函數`，主要用來 `計算數量`。

  SQL 還準備了許多可以用於統計資料的函數：
  - `COUNT`：計算資料表的紀錄筆數 (列數)。
  - `SUM`：計算資料表數值欄位的總計。
  - `AVG`：計算資料表數值欄位的平均值。
  - `MAX`：列出資料表任意欄位全部資料的最大值。
  - `MIN`：列出資料表任意欄位全部資料的最小值。

  這些統計用的函數稱為「 彙總函數 」。實際上所有的彙總函數，都具有將篩選目標的多筆資料輸出成 1 筆紀錄的功用。

### 計算資料表的紀錄筆數
  以 `COUNT 函數` 來說，若輸入資料表的欄位，它便會輸出紀錄的筆數。

  ::: warning 範例 3-1
  計算所有紀錄筆數
  ```SQL
  SELECT COUNT(*)
  FROM Shohin;
  ```

  執行結果
  |count|
  |:---:|
  |8    |
  :::

  > `COUNT( )` 中的星號(*)，代表「 所有欄位 」的意思。表示要把所有欄位傳遞給 COUNT 函數。

  傳遞給函數的數值資料稱為「 `參數(Parameter)` 」，
  
  而函數輸出的數值資料稱為「 `回傳值(Return Value)` 」。

### 計算 NULL 以外的紀錄筆數
  如果想要計算某個欄位除了 `NULL` 以外有多少筆紀錄的時候，則可以在括號中寫入查詢對象的欄位名稱。

  ::: warning 範例 3-2
  計算所有紀錄筆數
  ```SQL
  SELECT COUNT(buying_price)
  FROM Shohin;
  ```

  執行結果
  |count|
  |:---:|
  |6    |
  :::

  由於 `COUNT` 函數的參數若指定不同欄位將產生不同結果，所以撰寫時必須特別留意。

  ::: warning 範例 3-3
  只有 NULL 的資料表 (NullTbl)
  |col_1|
  |:---:|
  |     |
  |     |
  |     |

  ```SQL
  SELECT COUNT(*), COUNT(col_1)
  FROM NullTbl;
  ```

  執行結果
  |count|count|
  |:---:|:---:|
  |3    |0    |

  從上面的例子可以知道，即使是對相同的資料表同樣使用 `COUNT 函數`，也會因為不同的參數而獲得不同的結果。

  以欄位名稱做為參數的時候，由於只會計算 `NULL` 以外的資料，所以得到 「 0 筆紀錄 」的結果。
  :::

  ::: tip 牢記的原則 3-1
  `COUNT 函數` 的參數不同將獲得不同的結果。

  `COUNT(*)` 會計算包含 `NULL` 的紀錄筆數，

  而 `COUNT(欄位名稱)` 則會排除 `NULL` 的紀錄筆數。
  :::

### 求得總計
  `SUM 函數` 能算出總和。

  ::: warning 範例 3-4
  求得 販售單價 的總計
  ```SQL
  SELECT SUM(sell_price)
  FROM Shohin
  ```

  執行結果
  |sum  |
  |:---:|
  |16780|
  :::

  ::: warning 範例 3-5
  求得 販售單價 和 購入單價 的總計
  ```SQL
  SELECT SUM(sell_price), SUM(buying_price)
  FROM Shohin
  ```

  執行結果
  |sum  |sum  |
  |:---:|:---:|
  |16780|12210|
  :::

  > 所有的 `彙總函數` 以參數形式接收欄位名稱的時候，在開始計算之前都會先排除 `NULL` 的資料，並不是把 `NULL` 當作 0 處理。

  ::: tip 牢記的原則 3-2
  `彙總函數` 會排除 `NULL` 資料，不過只有「 `COUNT(*)` 」例外，不會排除 `NULL` 。
  :::

### 求得平均值
  `AVG 函數` 能求得平均值。

  ::: warning 範例 3-6
  求得 販售單價 的平均值
  ```SQL
  SELECT AVG(sell_price)
  FROM Shohin
  ```

  執行結果
  |avg                  |
  |:-------------------:|
  |2097.5000000000000000|
  :::

  其實就是一般 `(數值總計) / (數值個數)` 的 平均值計算公式。

  ::: warning 範例 3-7
  求得 販售單價 和 購入單價 的平均值
  ```SQL
  SELECT AVG(sell_price), AVG(buying_price)
  FROM Shohin
  ```

  執行結果
  |avg                  |avg                  |
  |:-------------------:|:-------------------:|
  |2097.5000000000000000|2035.0000000000000000|
  :::

  和 `SUM 函數` 的處理方式相同，會先排除 `NULL` 資料再進行計算。

### 求得最大、最小值
  想在多筆紀錄中找出欄位的最大值和最小值，可以分別使用 `MAX` 和 `MIN` 的函數。

  ::: warning 範例 3-8
  求得 販售單價 的最大值、購入單價的最小值
  ```SQL
  SELECT MAX(sell_price), MIN(buying_price)
  FROM Shohin
  ```

  執行結果
  |max |min|
  |:--:|:-:|
  |6800|320|
  :::

  > - `SUM`、`AVG` 函數只能應用於數值型別的欄位。
  > - `MAX`、`MIN` 函數原則上可以適用各種資料型別的欄位。

  ::: warning 範例 3-9
  求得 登錄日期 的最大值和最小值
  ```SQL
  SELECT MAX(reg_date), MIN(reg_date)
  FROM Shohin
  ```

  執行結果
  |max       |min       |
  |:--------:|:--------:|
  |2009-11-11|2008-04-28|
  :::

  ::: tip 牢記的原則 3-3
  `MAX`、`MIN` 函數可以適用絕大部分的資料型別，而 `SUM`、`AVG` 函數僅適用於數值型別。
  :::

### 排除重複值再使用彙總函數 (DISTINCT 關鍵字)
  ::: warning 範例 3-10
  排除重複值再計算筆數
  ```SQL
  SELECT COUNT(DISTINCT shohin_catalg)
  FROM Shohin
  ```

  執行結果
  |count|
  |:---:|
  |3    |
  :::

  > `DISTINCT` 必須寫在函數名稱後方的括號之中，一開始先排除 `shohin_catalg` 欄位的重複值，然後再計算排除後的紀錄筆數。

  ::: danger 範例 3-11
  錯誤用法：先計算紀錄筆數再排除重複值
  ```SQL
  SELECT DISTINCT COUNT(shohin_catalg)
  FROM Shohin
  ```

  執行結果
  |count|
  |:---:|
  |8    |
  :::

  ::: tip 牢記的原則 3-4
  想計算內容值總類的數量時，需要對 `COUNT 函數` 的參數冠上 `DISTINCT`。
  :::

  `DISTINCT` 關鍵字，同樣適用於其他彙總函數。

  ::: warning 範例 3-12
  有無 DISTINCT 的差異 (SUM 函數)
  ```SQL
  SELECT SUM(sell_price), SUM(DISTINCT sell_price)
  FROM Shohin
  ```

  執行結果
  |sum  |sum  |
  |:---:|:---:|
  |16780|16280|

  右側 加上了 `DISTINCT`，少了重複值的加總。
  :::

  ::: tip 牢記的原則 3-5
  想排除重複值再進行彙總，需要對彙總函數的參數冠上 `DISTINCT`。
  :::

## 3-2 資料分群
  ::: info 學習重點
  - `GROUP BY` 子句 可以像切蛋糕一樣把資料表區分切開。如果搭配彙總函數使用 `GROUP BY` 子句，便能先將資料「 按照各商品分類 」或「 按照個登錄日期 」等方式進行分群，再執行彙總計算。
  - 彙總鍵包含 `NULL` 時，彙總之後的結果也會出現「 未知 」紀錄 (空白)。
  - 搭配彙總函數使用 `GROUP BY` 子句的時候，必須注意下列 4 項重點：
    1. `GROUP BY` 子句，只能指定寫在 `SELECT` 子句中的元素。
    2. `GROUP BY` 子句中，不能使用 `SELECT` 子句中取的別名。
    3. `GROUP BY` 子句，無法排序彙總結果。
    4. `WHERE` 子句中，不能寫入彙總函數。
  :::
### GROUP BY 子句
  意思是「按照～區分群組」。
  
  ::: warning 語法 3-1
  以 GROUP BY 子句進行彙總
  ```SQL
  SELECT <欄位名稱1>, <欄位名稱2>, <欄位名稱3>, ...
  FROM <資料表名稱>
  GROUP BY <欄位名稱1>, <欄位名稱2>, <欄位名稱3>, ...;
  ```
  :::

  ::: warning 範例 3-13
  按照各商品分類分別計算紀錄筆數
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg;
  ```

  執行結果
  |shohin_catalg|count|
  |-------------|:---:|
  |衣物          |2    |
  |辦公用品       |2    |
  |廚房用品       |4    |
  :::

  先前沒有使用 `GROUP BY 子句` 的時候，`COUNT 函數` 的執行結果只有 1 行，這是因為沒有 `GROUP BY 子句` 的時候，整個資料表被視為單一的群組，而相對地使用 `GROUP BY 子句` 之後，資料表中的資料會先被區分成數個群組。

  `GROUP BY 子句` 中所指定的欄位稱為 `彙總鍵` 或 `群組化欄位`，這是用來指定如何分割資料表非常重要的欄位。

  `GROUP BY 子句` 會先將資料分組，然後 `COUNT 函數` 再分別計算每組分類的紀錄筆數。

  ::: tip 牢記的原則 3-6
  `GROUP 子句` 是能分割資料表的刀子。
  :::

  > SQL 子句的撰寫順序
  > 1. `SELECT`
  > 2. `FROM`
  > 3. `WHERE`
  > 4. `GROUP BY`

  ::: tip 牢記的原則 3-7
  SQL 敘述中的子句撰寫順序不可改變，不能任意更換！
  :::

### 彙總鍵包含 NULL 的狀況
  ::: warning 範例 3-14
  按照各購入單價分別計算紀錄筆數
  ```SQL
  SELECT buying_price, COUNT(*)
  FROM Shohin
  GROUP BY buying_price;
  ```

  執行結果
  | buying_price | count |
  |-------------:|:-----:|
  |              |   2   |
  |          320 |   1   |
  |          500 |   1   |
  |         5000 |   1   |
  |         2800 |   2   |
  |          790 |   1   |

  當彙總鍵中包含 `NULL` 資料的時候，所有的 `NULL` 都會被一併分類至名為「 `NULL` 」的資料群組。
  :::

  ::: tip 牢記的原則 3-8
  彙總鍵包含 `NULL` 時，結果也會出現「 未知 」紀錄 (空白)。
  :::

### 使用 WHERE 子句時 GROUP BY 的作用
  ::: warning 語法 3-2
  使用 `WHERE` 和 `GROUP BY` 子句進行彙總
  ```SQL
  SELECT <欄位名稱1>, <欄位名稱2>, <欄位名稱3>, ...,
  FROM <資料表名稱>
  WHERE <條件式>
  GROUP BY <欄位名稱1>, <欄位名稱2>, <欄位名稱3>, ...;
  ```
  :::

  會先按照 `WHERE 子句`所指定的條件留下符合的紀錄，然後再進行彙總的動作。

  ::: warning 範例 3-15
  合併使用 `WHERE` 和 `GROUP BY` 子句
  ```SQL
  SELECT buying_price, COUNT(*)
  FROM Shohin
  WHERE shohin_catalg = '衣物'
  GROUP BY buying_price;
  ```

  執行結果
  | buying_price | count |
  |-------------:|:-----:|
  |          500 |   1   |
  |         2800 |   1   |

  合併使用 `WHERE` 和 `GROUP BY` 子句時，`SELECT 敘述` 的執行順序：
  
  `FROM` -> `WHERE` -> `GROUP BY` -> `SELECT`。
  :::

  SQL 敘述，在外觀上的排列順序，與 DBMS 內部的執行順序並不一致。

### 彙總函數與 GROUP BY 子句的常見錯誤
  - #### <span class="red">常見錯誤 1</span> - `SELECT 子句` 中寫入多餘的欄位
    合併使用 `GROUP BY 子句` 和 `COUNT` 之類的彙總函數時，可以寫在 `SELECT 子句` 中的元素非常有限，實際上只有下列 3 種元素能寫入 `SELECT 子句`：
    - 常數
    - 彙總函數
    - `GROUP BY 子句` 所指定的欄位名稱 (亦即 `彙總鍵`)

    `常數`：即 123 之類的數值、或 '測試' 這類的字串等。

    將彙總鍵以外的欄位名稱寫入 `SELECT 子句` 中。在大部分的 DBMS 上執行會有錯誤，而在 `MySQL(MariaDB)` 則會得到不太正確的結果。

    ::: danger 範例 3-16
    在 `SELECT 子句` 寫入彙總鍵以外的欄位名稱
    ```SQL
    SELECT shohin_name, buying_price, COUNT(*)
    FROM Shohin
    GROUP BY buying_price;
    ```

    執行結果 ( 在 MariaDB 上執行，購入單價為 `NULL` 的商品只有叉子，少列了刀子 )
    | shohin_name | buying_price | COUNT(*) |
    |-------------|-------------:|:--------:|
    | 叉子        |         NULL |    2     |
    | 打孔機      |          320 |    1     |
    | T恤         |          500 |    1     |
    | 刨絲器      |          790 |    1     |
    | 襯衫        |         2800 |    2     |
    | 壓力鍋      |         5000 |    1     |

    `GROUP BY 子句` 中沒有 `shohin_name` 這個欄位名稱，所以不能把 `shohin_name` 寫入 `SELECT 子句` 中。
    :::

    ::: tip 牢記的原則 3-9
    使用 `GROUP BY 子句` 的時候，`SELECT 子句` 中不能寫入彙總鍵以外的欄位名稱。
    :::

  - #### <span class="red">常見錯誤 2</span> - `GROUP BY 子句` 中寫入在 `SELECT 子句` 取的別名
    如果對 `SELECT 子句` 中的項目使用「 `AS` 」這個關鍵字，便能賦予顯示用的別名。
    不過，`GROUP BY 子句` 中不能使用別名來代替原本的名稱，`SELECT 敘述` 將產生錯誤。

    ::: danger 範例 3-17
    `GROUP BY 子句` 使用欄位的別名，將產生錯誤
    ```SQL
    SELECT shohin_catalg AS sc, COUNT(*)
    FROM Shohin
    GROUP BY sc;
    ```

    在 `GROUP BY 子句` 執行的時間點上，`DBMS` 尚未執行 `SELECT 子句` 的內容，不知道別名所代表的意義。

    如果使用 `MySQL (MariaDB)`，這樣的寫法不會產生錯誤，此種寫法無法適用於所有的 `DBMS`，建議最好不要使用

    執行結果 ( 在 MariaDB 上執行 )
    |sc      |COUNT(*)|
    |--------|:------:|
    |衣物     |2       |
    |辦公用品  |2       |
    |廚房用品  |4       |
    :::

    ::: tip 牢記的原則 3-10
    `GROUP BY 子句` 不能使用 `SELECT 子句` 中賦予的別名。
    :::

  - #### <span class="red">常見錯誤 3</span> - `GROUP BY 子句` 會排序其結果？
    使用 `GROUP BY 子句` 篩選結果時，這些紀錄的順序呈現是 `隨機決定` 的。

    如果想要對其排列順序按照某種規則進行`排序`，必須在 `SELECT 敘述` 中，增加特定的語法。

    ::: tip 牢記的原則 3-11
    即使使用 `GROUP BY 子句`，畫面上的結果也不會進行排序。
    :::

  - #### <span class="red">常見錯誤 4</span> - 將彙總函數寫在 `WHERE 子句` 中
    ::: warning 範例 3-18
    `GROUP BY 子句` 使用欄位的別名，將產生錯誤
    ```SQL
    SELECT shohin_catalg, COUNT(*)
    FROM Shohin
    GROUP BY shohin_catalg;
    ```

    執行結果
    |shohin_catalg|COUNT(*)|
    |-------------|:------:|
    |衣物          |2       |
    |辦公用品       |2       |
    |廚房用品       |4       |
    :::

    再來或許會想要「 篩選出計算結果剛好有 2 筆紀錄的群組 」，為了在篩選時指定條件，可能會想到使用 `WHERE 子句`。

    ::: danger 範例 3-19
    在 `WHERE 子句` 中，寫入彙總函數將會發生錯誤
    ```SQL
    SELECT shohin_catalg, COUNT(*)
    FROM Shohin
    WHERE COUNT(*) = 2
    GROUP BY shohin_catalg;
    ```

    執行結果
    ```SQL
    ERROR 1111 (HY000): Invalid use of group function
    ```

    實際上，可以寫入 `COUNT` 等彙總函數的地方，
    
    只有 `SELECT 子句` 和 `HAVING 子句` 以及 `ORDER BY 子句` 而已。
    :::

    `HAVING 子句` 便是可以對分群後的資料指定條件。

    ::: tip 牢記的原則 3-12
    可以寫入彙總函數的地方，只有 `SELECT 子句` 和 `HAVING 子句` 以及 `ORDER BY 子句`。
    :::

> ### COLUMN - DISTINCT 與 GROUP BY
>  ::: warning 範例 3-A
>  DISTINCT 和 GROUP BY 具有相同效果
>  ```SQL
>  SELECT DISTINCT shohin_catalg
>  FROM Shohin
>
>  -- 或
>
>  SELECT shohin_catalg
>  FROM Shohin
>  GROUP BY shohin_catalg;
>  ```
>
>  執行結果
>  |shohin_catalg|
>  |-------------|
>  |衣物          |
>  |辦公用品       |
>  |廚房用品       |
>  :::
>
>  `DISTINCT` 與 `GROUP BY` 子句，同樣會把 `NULL` 資料彙整在一起，而針對多個欄位進行篩選時的結果也完全相同，執行速度也幾乎不分上下。
>  - 對於「 想從篩選結果排除重複資料 」的需求，應該採用 `DISTINCT`，
>  - 而對於「 想取得彙總後的結果 」的需求，應該選擇 `GROUP BY 子句`。

## 3-3 對彙總結果指定條件
  ::: info 學習重點
  - 使用 `COUNT` 等函數彙總資料表的資料時，若想對篩選結果指定條件，不能使用 `WHERE 子句`，必須改用 `HAVING 子句`。
  - `彙總函數` 可以寫在 `SELECT 子句`、`HAVING 子句` 和 `ORDER BY 子句` 中。
  - `HAVING 子句` 應該寫在 `GROUP BY 子句之後`。
  - `WHERE 子句` 用來「 對紀錄指定條件 」，而 `HAVING 子句` 則是「 對資料群組指定條件 」。
  :::

### HAVING子句
  對資料群組指定條件的方法。
  
  `WHERE 子句`，只能對「 各筆資料 」指定條件。

  而想對分群後的資料指定條件，必須使用 `HAVING 子句` 來對資料群組指定條件。

  ::: warning 語法 3-3
  HAVING 子句
  ```SQL
  SELECT <欄位名稱1>, <欄位名稱2>, <欄位名稱3>,...
  FROM <資料表名稱>
  GROUP BY <欄位名稱1>, <欄位名稱2>, <欄位名稱3>,...
  HAVING <針對資料群組的條件>
  ```
  :::

  `HAVING 子句` 的撰寫位置，必須在 `GROUP BY 子句` 之後。

  使用 `HAVING 子句` 時，`SELECT 敘述` 的撰寫順序：
  
  `SELECT` -> `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING`。

  ::: tip 牢記的原則 3-13
  `HAVING 子句`，必須寫在 `GROUP BY 子句` 之後。
  :::

  ::: warning 範例 3-20
  以商品分類進行分群彙總、篩選出「 當中含有 2 筆紀錄 」的群組
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg
  HAVING COUNT(*) = 2;
  ```

  執行結果
  |shohin_catalg|count|
  |-------------|:---:|
  |衣物          |2    |
  |辦公用品       |2    |
  :::

  ::: warning 範例 3-21
  沒有 HAVING 子句進行篩選的狀況
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg;
  ```

  執行結果
  |shohin_catalg|count|
  |-------------|:---:|
  |衣物          |2    |
  |辦公用品       |2    |
  |廚房用品       |4    |
  :::

  此次同樣以商品分類欄位進行分群，不過條件改為「 販售單價的平均值大於 2500 元 」。

  ::: warning 範例 3-22
  尚未加上 HAVING 子句進行篩選
  ```SQL
  SELECT shohin_catalg, AVG(sell_price)
  FROM Shohin
  GROUP BY shohin_catalg;
  ```

  執行結果
  |shohin_catalg|avg                  |
  |-------------|--------------------:|
  |衣物          |2500.0000000000000000|
  |辦公用品       |300.0000000000000000 |
  |廚房用品       |2795.0000000000000000|
  :::

  ::: warning 範例 3-23
  以 HAVING 子句設定條件進行篩選
  ```SQL
  SELECT shohin_catalg, AVG(sell_price)
  FROM Shohin
  GROUP BY shohin_catalg
  HAVING AVG(sell_price) >= 2500;
  ```

  執行結果
  |shohin_catalg|avg                  |
  |-------------|--------------------:|
  |衣物          |2500.0000000000000000|
  |廚房用品       |2795.0000000000000000|
  :::

### 可寫在 HAVING 子句的元素
  與加上 `GROUP BY 子句` 的 `SELECT 子句` 相同，能寫入 `HAVING 子句` 的元素同樣有所限制，兩者限制完全相同：
  - 常數
  - 彙總函數
  - `GROUP BY 子句` 所指定的欄位名稱 (亦即 `彙總鍵`)

  ::: danger 範例 3-21
  HAVING 子句 的錯誤用法
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg
  HAVING shohin_name = '鋼珠筆';
  ```

  執行結果 (於 MariaDB 上執行)
  ```SQL
  #1054 - Unknown column 'shohin_name' in 'having clause'
  ```

  由於 `GROUP BY 子句` 當中並沒有包含名為 `shohin_name (商品名稱)` 的欄位，因此不能將此欄位寫入 `HAVING 子句` 中。
  :::

  當在使用 `HAVING 子句` 時，建議可以想成「 當分組彙總資料的前半段動作完成之後，`HAVING 子句` 是針對分組後的資料指定條件 」

### 適合以 WHERE 子句取代 HAVING 子句的條件
  某些條件可以寫成 `HAVING 子句`，也可以寫成 `WHERE 子句`，而這樣的條件便是「 針對彙總鍵的條件 」。

  ::: warning 範例 3-25
  將條件寫成 HAVING 子句
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg
  HAVING shohin_catalg = '衣物';
  ```

  執行結果
  |shohin_catalg|count|
  |-------------|:---:|
  |衣物          |2    |
  :::

  相同結果

  ::: warning 範例 3-26
  將條件寫成 WHERE 子句的狀況
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  WHERE shohin_catalg = '衣物';
  GROUP BY shohin_catalg
  ```

  執行結果
  |shohin_catalg|count|
  |-------------|:---:|
  |衣物          |2    |
  :::

  `WHERE 子句` 和 `HAVING 子句` 基本上被賦予了不同的角色定位。
  - `WHERE 子句` = 對紀錄指定條件
  - `HAVING 子句` = 對資料群組指定條件

  ::: tip 牢記的原則 3-14
  針對彙總鍵的條件應該寫成 `WHERE 子句`，而不是 `HAVING 子句`。
  :::

> ### COLUMN - WHERE 子句 與 HAVING 子句 的執行速度
> - 可以寫成 `WHERE 子句`、也能寫成 `HAVING 子句` 的條件，應該盡量選擇 `WHERE 子句` 的另外 1 個原因，便是效能上的考量，也就是執行速度上的差異。
`WHERE 子句` 的處理速度較快、取得結果所需的時間較短。
>
> - 使用 `COUNT` 等函數來彙總資料表中的資料時，`DBMS` 內部需要進行「 排序 」的動作、排列各筆紀錄的先後順序，而這樣的排序處理會對硬體效能產生相當大的負擔，也就是屬於相當「 吃重 」的處理動作，因此，可以盡量減少需要排序的紀錄筆數，執行速度也會比較快。
> 
> - 若使用 `WHERE 子句` 來指定條件，因為進行排序前，會先挑選出符合的紀錄，所以進行排序的紀錄筆數較少，而另一方面，`HAVING 子句` 需要先完成排序、進行資料分群之後，才會按照條件挑選紀錄，因此需要排序更多的紀錄筆數。
> 
> - 而且，`WHERE 子句` 在速度上佔有優勢的另外 1 個理由，便是 `WHERE 子句` 條件中的欄位如果有建立「 索引 (Index) 」，那麼處理速度還可以獲得大幅度的提升。作為 `DBMS` 提升效能的方法，這項名為 `索引` 的技術相當普及，而且產生的效果相當顯著。 

## 3-4 查詢結果排序
  ::: info 學習重點
  - 想要排列查詢結果需要使用 `ORDER BY 子句`。
  - 在 `ORDER BY 子句` 的欄位名稱後方，可加上 `ASC` 關鍵字指定升冪順序，或加上 `DESC` 關鍵字指定降冪順序。
  - `ORDER BY 子句` 當中可以指定多個排序鍵。
  - 當排序鍵欄位含有 `NULL` 的資料時，會被統一放在最前或最後。
  - `ORDER BY 子句` 中，可以使用 `SELECT 子句` 所取得的欄位別名。
  - `ORDER BY 子句` 中，可以使用 `SELECT 子句` 所沒有的欄位和彙總函數。
  - `ORDER BY 子句` 中，不能使用欄位編號。
  :::

### ORDER BY 子句
  ::: warning 範例 3-27
  列出商品ID、商品名稱、販售單價和購入單價
  ```SQL
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0001      | T恤         |       1000 |          500 |
  | 0002      | 打孔機      |        500 |          320 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0005      | 壓力鍋      |       6800 |         5000 |
  | 0006      | 叉子        |        500 |              |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0008      | 鋼珠筆      |        100 |              |

  乍看之下，似乎是由商品ID排序(升冪)，不過這只是偶然出現的狀況，排列順序其實是 `隨機決定` 的。
  :::

  一般來說，從資料表篩選資料的時候，如果沒有特別指定順序，將無法預料各筆紀錄會按照什麼樣的順序排列，即使是完全相同的 `SELECT 敘述`，每次執行的時候或許都會獲得不同的排列順序。

  可以在 `SELECT 敘述` 的最後加上 `ORDER BY 子句`，藉以明確指定各筆紀錄的排列順序。

  ::: warning 語法 3-4
  ORDER BY 子句
  ```SQL
  SELECT <欄位名稱1>, <欄位名稱2>, <欄位名稱3>,...
  FROM <資料表名稱>
  ORDER BY <排列基準的欄位名稱1>, <排列基準的欄位名稱2>,...;
  ```
  :::

  ::: warning 範例 3-28
  按照販售單價由低排至高 (升冪)
  ```SQL
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY sell_price;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0008      | 鋼珠筆      |        100 |              |
  | 0006      | 叉子        |        500 |              |
  | 0002      | 打孔機      |        500 |          320 |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0001      | T恤         |       1000 |          500 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0005      | 壓力鍋      |       6800 |         5000 |
  :::

  `ORDER BY 子句` 必須寫在整段 `SELECT 敘述` 的最後位置，對 `DBMS` 來說，排序各筆紀錄的步驟是回傳結果的最後 1 道手續。

  寫在 `ORDER BY 子句` 中的欄位名稱，稱為「 排序鍵 」。

  > 子句的撰寫順序
  > 1. `SELECT 子句`
  > 2. `FROM 子句`
  > 3. `WHERE 子句`
  > 4. `GROUP BY 子句`
  > 5. `HAVING 子句`
  > 6. `ORDER BY 子句`

  ::: tip 牢記的原則 3-15
  `ORDER BY 子句` 必定寫在 `SELECT 敘述` 的最後位置。
  :::

### 指定升冪或降冪
  `降冪` 的排序方式，在欄位名稱後方加上 `DESC` 關鍵字。

  ::: warning 範例 3-29
  按照販售單價由高排至低 (`降冪`)
  ```SQL
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY sell_price DESC;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0005      | 壓力鍋      |       6800 |         5000 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0001      | T恤         |       1000 |          500 |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0002      | 打孔機      |        500 |          320 |
  | 0006      | 叉子        |        500 |              |
  | 0008      | 鋼珠筆      |        100 |              |
  :::

  SQL 也備有名為 `ASC` 的關鍵字，不過沒有加上關鍵字的時候，預設即為 `升冪` 的排序方式。

  `ASC` 和 `DESC` 分別是英文單字 `Ascendent` 以及 `Descendent`。

  ::: tip 牢記的原則 3-16
  `ORDER BY 子句` 沒有特別指定順序時，預設為 `升冪` 排序。
  :::

  由於 `ASC` 和 `DESC` 關鍵字是分別附加在各欄位名稱之後，所以可以做到指定某個欄位為 `升冪`、同時另一個欄位 `降冪` 排序。

### 指定多個排序鍵
  指定一個排序鍵時，當有相同值的先後順序，還是會獲得 `隨機決定` 的順序。
  
  如果想針對這樣「 同順位 」的值，指定更加細緻的排列順序，需要再增加 1 個排序鍵。

  ::: warning 範例 3-30
  按照販售單價和商品 ID 做升冪排序
  ```SQL
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY sell_price, shohin_id;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0008      | 鋼珠筆      |        100 |              |
  | 0002      | 打孔機      |        500 |          320 |
  | 0006      | 叉子        |        500 |              |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0001      | T恤         |       1000 |          500 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0005      | 壓力鍋      |       6800 |         5000 |
  :::

  `ORDER BY 子句` 中可以指定多個排序鍵，左側的排序鍵會被優先拿來排列順序，如果該排序鍵欄位具有相同的數值資料，再參考其右側的排序鍵完成第 2 階段的排序。

### NULL 的順序
  不能對 `NULL` 使用比較運算子，也就是說，無法排出 `NULL` 和數值之間的先後順序，也無法和文字和日期做比較，因此，如果指定含有 `NULL` 的欄位作為排序鍵，那麼 `NULL` 會被統一放在最前面或最後面的位置。

  ::: warning 範例 3-31
  按照 購入單價 做升冪排序
  ```SQL
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY buying_price;
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0002      | 打孔機      |        500 |          320 |
  | 0001      | T恤         |       1000 |          500 |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0005      | 壓力鍋      |       6800 |         5000 |
  | 0006      | 叉子        |        500 |              |
  | 0008      | 鋼珠筆      |        100 |              |
  :::

  放在最前面或最後面並沒有一定的準則，由於其中也有些 `DBMS` 允許自行指定排在前面或後面，建議可以查閱目前所使用 `DBMS` 的功能說明。

  ::: tip 牢記的原則 3-17
  排序鍵含有 `NULL` 的時候，`NULL` 會被統一放在最前或最後。
  :::

### 使用欄位別名指定排序鍵
  `GROUP BY 子句` 中不能使用在 `SELECT 子句` 命名的欄位別名，不過 `ORDER BY 子句` 中可以使用欄位的別名。

  ::: warning 範例 3-32
  ORDER BY 子句中可以使用欄位別名
  ```SQL
  SELECT shohin_id AS id, shohin_name, sell_price AS sp, buying_price
  FROM Shohin
  ORDER BY sp, id;
  ```

  先按照販售單價 `升冪`、再按照商品ID `升冪`。

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0008      | 鋼珠筆      |        100 |              |
  | 0002      | 打孔機      |        500 |          320 |
  | 0006      | 叉子        |        500 |              |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0001      | T恤         |       1000 |          500 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0005      | 壓力鍋      |       6800 |         5000 |
  :::

  `SELECT 敘述` 的內部執行順序：
  
  `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY`。

  `GROUP BY 子句` 執行的時間點，`DBMS` 還不知道 `SELECT 子句` 中，替欄位取的別名。

  ::: tip 牢記的原則 3-18
  `ORDER BY 子句` 中可以使用在 `SELECT 子句` 取的欄位別名。 
  :::

### ORDER BY 子句可使用的欄位
  `ORDER BY 子句` 中，可以使用資料表的任意欄位當作排序鍵，即使該欄位沒有寫在 `SELECT 子句` 之中。

  ::: warning 範例 3-33
  SELECT 子句中沒有的欄位亦可寫入 ORDER BY 子句
  ```SQL
  SELECT shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY shohin_id;
  ```

  執行結果
  | shohin_name | sell_price | buying_price |
  |-------------|-----------:|-------------:|
  | T恤         |       1000 |          500 |
  | 打孔機      |        500 |          320 |
  | 襯衫        |       4000 |         2800 |
  | 菜刀        |       3000 |         2800 |
  | 壓力鍋      |       6800 |         5000 |
  | 叉子        |        500 |              |
  | 刨絲器      |        880 |          790 |
  | 鋼珠筆      |        100 |              |
  :::

  另外，`ORDER BY 子句` 中，也能使用彙總函數

  ::: warning 範例 3-34
  彙總函數可以用於 ORDER BY 子句中
  ```SQL
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY sshohin_catalg
  ORDER BY COUNT(*);
  ```

  執行結果
  | shohin_catalg | count |
  |---------------|------:|
  | 衣物          |     2 |
  | 辦公用品      |     2 |
  | 廚房用品      |     4 |
  :::

  ::: tip 牢記的原則 3-19
  `ORDER BY 子句` 中，也能使用 `SELECT 子句` 中沒有的欄位以及彙總函數。
  :::

### 請勿使用欄位編號
  `ORDER BY 子句` 中，其實可以使用 `SELECT 子句` 中各欄位對應的 `欄位編號`。
  
  `欄位編號`，指的是對 `SELECT 子句` 的各欄位由左邊開始依序賦予 1、2、3、... 編號，例如：第 1 個欄位為編號 1、第 2 個欄位為編號 2。

  ::: warning 範例 3-35
  ORDER BY 子句中可以使用欄位編號
  ```SQL
  -- 指定欄位名稱
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY sell_price DESC, shohin_id;

  -- 指定欄位編號
  SELECT shohin_id, shohin_name, sell_price, buying_price
  FROM Shohin
  ORDER BY 3 DESC, 1;
  -- 先按照 SELECT 子句 第 3 個欄位做 降冪、再按照 第 1 個欄位做 升冪排序
  ```

  執行結果
  | shohin_id | shohin_name | sell_price | buying_price |
  |-----------|-------------|-----------:|-------------:|
  | 0005      | 壓力鍋      |       6800 |         5000 |
  | 0003      | 襯衫        |       4000 |         2800 |
  | 0004      | 菜刀        |       3000 |         2800 |
  | 0001      | T恤         |       1000 |          500 |
  | 0007      | 刨絲器      |        880 |          790 |
  | 0002      | 打孔機      |        500 |          320 |
  | 0006      | 叉子        |        500 |              |
  | 0008      | 鋼珠筆      |        100 |              |
  :::

  基於下列 2 點理由，建議避免使用此種寫法。
  - 這樣的 SQL 敘述 `不易閱讀`。
  - 實際上，此項目編號的功能在 `SQL-92` 的規範中被列為「 將來應該刪除的功能 」，因此，即使現在沒有什麼問題，到了將來 `DBMS` 進行版本更新的時候，原本可以正常運作的 SQL 敘述可能會突然無法執行，導致嚴重的問題發生。

  ::: tip 牢記的原則 3-20
  `ORDER BY 子句` 中請勿使用 `欄位編號`。
  :::

## 自我練習
  - 3.1 下列的 SELECT 敘述在語法上有誤，請指出所有有問題的地方。
    ```SQL
    -- 此 SELECT 敘述有誤。
    SELECT shohin_id, SUM(shohin_name)
    FROM Shohin
    GROUP BY shohin_catalg
    
    WHERE reg_date > '2009-09-01';
    
    ```

    ::: details 練習
    - SELECT 子句中，SUM彙總函數的 shohin_name 無法加總，會得到 0
    - SELECT 子句 使用 GROUP BY 子句指定欄位以外的欄位 shohin_id，查詢結果會有誤
    - GROUP BY 必須寫在最後
    - 使用 GROUP BY 後，WHERE 無意義
    :::

  - 3.2 請試著撰寫 `SELECT 敘述`，列出販售單價 (sell_price 欄位) 總合比購入單價 (buying_price 欄位) 總和 多 1.5倍的商品分類，執行後的結果應該如下所示。
    | shohin_catalg | sum  | sum  |
    |---------------|-----:|-----:|
    | 衣物          | 5000 | 3300 |
    | 辦公用品      | 600  | 320  |

    ::: details 練習
    ```SQL
    SELECT shohin_catalg, SUM(sell_price), SUM(buying_price)
    FROM Shohin
    GROUP BY shohin_catalg
    HAVING SUM(buying_price) < 5000;
    ```
    :::

  - 3.3 假設您曾經執行過某段 `SELECT 敘述`，從 Shohin (商品) 資料表篩選出所有的紀錄，那個時候，您有利用 `ORDER BY 子句` 指定排序方式，不過現在卻忘記當時指定了什麼樣的規則，請參考下列的執行結果，思考一下該 `ORDER BY 子句` 的寫法。
    | shohin_id | shohin_name | shohin_catalg | sell_price | buying_price | reg_date   |
    |-----------|-------------|---------------|------------|--------------|------------|
    | 0003      | 襯衫        | 衣物          | 4000       | 2800         |            |
    | 0008      | 鋼珠筆      | 辦公用品      | 100        |              | 2009-11-11 |
    | 0006      | 叉子        | 廚房用品      | 500        |              | 2009-09-20 |
    | 0001      | T恤         | 衣物          | 1000       | 500          | 2009-09-20 |
    | 0004      | 菜刀        | 廚房用品      | 3000       | 2800         | 2009-09-20 |
    | 0002      | 打孔機      | 辦公用品      | 500        | 320          | 2009-09-11 |
    | 0005      | 壓力鍋      | 廚房用品      | 6800       | 5000         | 2009-01-15 |
    | 0007      | 刨絲器      | 廚房用品      | 880        | 790          | 2008-04-28 |
    
    ::: details 練習
    ```SQL
    SELECT *
    FROM Shohin
    ORDER BY reg_date DESC, sell_price;
    ```
    :::