---
title: 第 7 章 集合運算 (合併查詢)
---

# 第 7 章 集合運算 (合併查詢)

## 7-1 資料表的加法與減法運算
  ::: info 學習重點
  - 所謂的集合運算是對多筆紀錄執行相加或相減的動作，可以說是紀錄的四則運算。
  - 進行集合運算的時候，需要使用 `UNION (聯集)`、`INTERSECT (交集)` 和 `EXCEPT (差集)` 等集合運算子。
  - 集合運算子預設會排除重複的紀錄。
  - 使用集合運算子的時候，如果想列出重複的紀錄，需要加上 `ALL` 選項。
  :::

### 什麼是集合運算 (Set Operations)
  「 `集合 (Set)` 」這個名稱在數學的領域中代表著「 `(各種) 事物的集合體` 」，而在資料庫的世界指的是「 `紀錄的集合` 」。

  集合運算能對多筆紀錄執行相加或相減的動作，可以說是紀錄的四則運算。而用來執行集合運算的運算子就稱為「 `集合運算子` 」。

  關聯式資料庫的集合運算也特別稱為 `關聯式代數 (Relational Algebra)`。

### 資料表的加法運算 - UNION
  `UNION (聯集)`，便是用來執行紀錄加法運算。

  實際開始之前，請先另外新增 1 個練習用的資料表。

  ::: warning 範例 7-1
  建立 Shohin2 (商品2) 資料表
  ```SQL
  CREATE TABLE Shohin2
  (shohin_id CHAR(4) NOT NULL,
  shohin_name VARCHAR(100) NOT NULL,
  shohin_catalg VARCHAR(32) NOT NULL,
  sell_price INTEGER,
  buying_price INTEGER,
  reg_date DATE,
  PRIMARY KEY (shohin_id));
  ```

  並新增 5 筆紀錄

  - 專用語法：`MySQL`、`MariaDB`
  ```SQL
  START TRANSACTION;

    INSERT INTO Shohin2 VALUES ('0001', 'T恤', '衣物', 1000, 500, '2009-09-20');
    INSERT INTO Shohin2 VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11');
    INSERT INTO Shohin2 VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL);
    INSERT INTO Shohin2 VALUES ('0009', '手套', '衣物', 800, 500, NULL);
    INSERT INTO Shohin2 VALUES ('0010', '水壺', '廚房用品', 2000, 1700, '2009-09-20');

  COMMIT;
  ```
  :::

  ::: warning 專用語法
  各家 `DBMS` 交易功能的語法略有差異，如果在 `PostgreSQL` 或 `SQL Server` 執行 範例 6-1 的 `DML 敘述` 時，需要將「 `START TRANSACTION` 」改為「 `BEGIN TRANSACTION` 」，而在 `Oracle` 或 `DB2` 上執行的時候，不需要「 `START TRANSACTION` 」，直接刪除即可。
  :::

  試著針對這 2 個資料表執行「 Shohin 資料表 + Shohin2 資料表」的加法運算。

  ::: warning 範例 7-3
  以 UNION 執行資料表的加法運算
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  UNION
  SELECT shohin_id, shohin_name
  FROM Shohin2;
  ```

  執行結果
  | shohin_id | shohin_name |
  |-----------|-------------|
  | 0001      | T恤         |
  | 0002      | 打孔機       |
  | 0003      | 襯衫        |
  | 0004      | 菜刀        |
  | 0005      | 壓力鍋       |
  | 0006      | 叉子        |
  | 0007      | 刨絲器      |
  | 0008      | 鋼珠筆      |
  | 0009      | 手套        |
  | 0010      | 水壺        |
  :::

  ::: tip 牢記的原則 7-1
  `集合運算子` 會排除重複的紀錄。
  :::

### 集合運算的注意事項
  - #### 注意事項 1 - 運算對象的欄位數量必須相同
    由於一方的欄位數量不同，無法進行資料集合的加法運算。
    ::: danger
    ```SQL
    -- 因欄位數量不同而發生錯誤
    SELECT shohin_id, shohin_name
    FROM Shohin
    UNION
    SELECT shohin_id, shohin_name, sell_price
    FROM Shohin2;
    ```
    :::

  - #### 注意事項 2 - 對應欄位的資料型別必須一致
    從左側起算，處於相同位置的欄位，必須具有相同的資料型別。
    ::: danger
    ```SQL
    -- 因資料型別不一致而發生錯誤
    SELECT shohin_id, sell_price
    FROM Shohin
    UNION
    SELECT shohin_id, reg_date
    FROM Shohin2;
    ```
    :::

  - #### 注意事項 3 - SELECT 敘述可寫入各種子句，但 ORDER BY 子句只能寫在最後 1 處
    以 `UNION` 進行相加的 2 段 `SELECT 敘述` 可以寫入各種子句，不過，整段敘述只能有 1 個 `ORDER BY 子句`，而且必須寫在最後的位置。

    ::: warning 範例 7-4
    ORDER BY 子句只能寫在最後 1 處
    ```SQL
    SELECT shohin_id, shohin_name
    FROM Shohin
    WHERE shohin_catalg = '廚房用品'
    UNION
    SELECT shohin_id, shohin_name
    FROM Shohin2
    WHERE shohin_catalg = '廚房用品'
    ORDER BY shohin_id;
    ```

    執行結果
    | shohin_id | shohin_name |
    |-----------|-------------|
    | 0004      | 菜刀         |
    | 0005      | 壓力鍋       |
    | 0006      | 叉子         |
    | 0007      | 刨絲器       |
    | 0010      | 水壺         |
    :::

### 列出重複紀錄的集合運算 - ALL 選項
  要在 `UNION` 的結果中列出重複紀錄的語法，只要在 UNION 的後方加上「 ALL 」這個關鍵字即可。 `ALL 選項` 除了 `UNION` 之外，也適用於其他的集合運算子。

  ::: warning 範例 7-5
  不排除重複的紀錄
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  UNION ALL
  SELECT shohin_id, shohin_name
  FROM Shohin2;
  ```

  執行結果
  | shohin_id | shohin_name |
  |-----------|-------------|
  | 0001      | T恤         |
  | 0002      | 打孔機       |
  | 0003      | 襯衫        |
  | 0004      | 菜刀        |
  | 0005      | 壓力鍋       |
  | 0006      | 叉子        |
  | 0007      | 刨絲器      |
  | 0008      | 鋼珠筆      |
  | 0001      | T恤         |
  | 0002      | 打孔機       |
  | 0003      | 襯衫        |
  | 0009      | 手套        |
  | 0010      | 水壺         |
  :::

  ::: tip 牢記的原則 7-2
  使用集合運算子想列出重複的紀錄時，請加上 `ALL 選項`。
  :::

### 篩選出資料表的共通部分 - INTERSECT
  由於它能篩選出 2 組紀錄集合 (`SELECT 敘述` 的執行結果) 的共通部分，所以採用了 `INTERSECT (交集)` 這個關鍵字。

  ::: warning 範例 7-6
  以 `INTERSECT` 篩選資料表的共通部分

  - 專用語法：`Oracle`、`SQL Server`、`DB2`、`PostgreSQL`
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  INTERSECT
  SELECT shohin_id, shohin_name
  FROM Shohin2
  ORDER BY shohin_id;
  ```

  執行結果
  | shohin_id | shohin_name |
  |-----------|-------------|
  | 0001      | T恤         |
  | 0002      | 打孔機       |
  | 0003      | 襯衫        |
  :::

  `MySQL` 和 `MariaDB` 尚未實作 `INTERSECT` 的功能，所以無法使用。

  `MySQL` 和 `MariaDB` 可以用 `IN` 、 `EXISTS` 或 `JOIN` 等來替代，附上 1 個 `IN` 的寫法。

  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  WHERE shohin_id IN (
    SELECT shohin_id
    FROM Shohin2
  )
  ORDER BY shohin_id;
  ```

  `INTERSECT` 需要引用 2 個資料表篩選出共通的紀錄。

### 紀錄的減法運算 - EXCEPT
  減法運算的 `EXCEPT (差集)`，其語法也和 `UNION` 相同。

  `Oracle` 以 `MINUS` 取代 `EXCEPT`，`Oracle` 請直接把 `EXCEPT` 改為 `MINUS`。

  `MySQL`、`MariaDB` 尚未實作 `EXCEPT` 的功能，所以無法使用

  ::: warning 範例 7-7
  以 `EXCEPT` 執行紀錄的減法運算

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  EXCEPT
  SELECT shohin_id, shohin_name
  FROM Shohin2
  ORDER BY shohin_id;
  ```

  - 專用語法：`Oracle`
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  MINUS
  SELECT shohin_id, shohin_name
  FROM Shohin2
  ORDER BY shohin_id;
  ```

  - 專用語法：`MySQL`、`MariaDB`
  
  `MySQL`、`MariaDB` 可用 `NOT IN` 或 `NOT EXISTS` 等來替代
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin
  WHERE shohin_id NOT IN (
    SELECT shohin_id
    FROM Shohin2
  )
  ORDER BY shohin_id;
  ```

  執行結果
  | shohin_id | shohin_name |
  |-----------|-------------|
  | 0004      | 菜刀         |
  | 0005      | 壓力鍋       |
  | 0006      | 叉子         |
  | 0007      | 刨絲器       |
  | 0008      | 鋼珠筆       |

  此段敘述將 Shohin 資料表的紀錄減掉 Shohin2 資料表的紀錄。
  :::

  `EXCEPT` 的特點，需要特別留意，以何者減去何者將會獲得不同的結果。

  ::: warning 範例 7-8
  以 `EXCEPT` 執行紀錄的減法運算

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`
  ```SQL
  SELECT shohin_id, shohin_name
  FROM Shohin2
  EXCEPT
  SELECT shohin_id, shohin_name
  FROM Shohin
  ORDER BY shohin_id;
  ```

  執行結果
  | shohin_id | shohin_name |
  |-----------|-------------|
  | 0009      | 手套         |
  | 0010      | 水壺         |
  :::

## 7-2 結合 (聯結多個資料表欄位)
  ::: info 學習重點
  - `結合 (JOIN)` 能帶入其他資料表的欄位資料，可以說是「 `增加資料表欄位` 」的集合運算功能。相對於 `UNION` 是按照紀錄的方向 (縱向) 聯結不同資料表的資料，`結合` 則是順著欄位的方向 (橫向) 進行聯結。
  - 結合基本上可分為 `內部結合` 與 `外部結合` 等 2 種類型，請確實地掌握這 2 種方式。
  - 使用結合功能的時候，請勿使用舊式語法或專用語法，務必採用標準的 SQL 語法來撰寫。
  :::

### 什麼是結合
  `結合 (JOIN)` 運算，簡單描述它的功能，可以說是從其他的資料表帶入欄位、增加資料表欄位的操作，而這項操作適用的場合，在於想取得的資料 (欄位) 存在於多個資料表的狀況。實務上，所需的資料散布在多個資料表的狀況相當常見，利用 `結合功能` 就能從多個資料表篩選出所需的資料集合形式。

### 內部結合 - INNER JOIN
  `內部結合 (INNER JOIN)` 的功能，也是最常被使用的結合方式。

  做為練習對象的資料表除了一直使用的 `Shohin 資料表` 之外，還有在第 6 章所建立過的 `StoreShohin 資料表`。

  ::: tip 表 7-1
  Shohin (商品) 資料表
  |shohin_id (商品ID)|shohin_name (商品名稱)|shohin_catalg (商品分類)|sell_price (販售單價)|buying_price (購入單價)|reg_date (登錄日期)|
  |---------|-----------|-------------|----------|------------|----------|
  |0001     |T恤        |衣物          |1000      |500         |2009-09-20|
  |0002     |打孔機      |辦公用品      |500        |320         |2009-09-11|
  |0003     |襯衫        |衣物         |4000       |2800        |          |
  |0004     |菜刀        |廚房用品      |3000      |2800        |2009-09-20|
  |0005     |壓力鍋      |廚房用品      |6800       |5000        |2009-01-15|
  |0006     |叉子        |廚房用品      |500        |           |2009-09-20|
  |0007     |刨絲器      |廚房用品      |880        |790        |2008-04-28|
  |0008     |鋼珠筆      |辦公用品      |100        |            |2009-11-11|
  :::

  ::: tip 表 7-2
  StoreShohin (店鋪商品) 資料表
  | store_id (店鋪ID) | store_name (店鋪名稱) | shohin_id (商品ID) | s_amount (數量) |
  |---------:|:----------:|----------:|---------:|
  |     000A |    東京    |      0001 |       30 |
  |     000A |    東京    |      0002 |       50 |
  |     000A |    東京    |      0003 |       15 |
  |     000B |   名古屋   |      0002 |       30 |
  |     000B |   名古屋   |      0003 |      120 |
  |     000B |   名古屋   |      0004 |       20 |
  |     000B |   名古屋   |      0006 |       10 |
  |     000B |   名古屋   |      0007 |       40 |
  |     000C |    大阪    |      0003 |       20 |
  |     000C |    大阪    |      0004 |       50 |
  |     000C |    大阪    |      0006 |       90 |
  |     000C |    大阪    |      0007 |       70 |
  |     000D |    福岡    |      0001 |      100 |
  :::

  ::: tip 表 7-3
  2 個資料表的欄位 分別具有哪些欄位
  |          | Shohin | StoreShohin |
  |----------|:------:|:-----------:|
  | 商品ID    |   √    |      √      |
  | 商品名稱  |   √    |             |
  | 商品分類  |   √    |             |
  | 販售單價  |   √    |             |
  | 購入單價  |   √    |             |
  | 登錄日期  |   √    |             |
  | 店鋪ID   |        |      √      |
  | 店鋪名稱  |        |      √      |
  | 數量     |        |      √      |

  - 🅐 2 個資料表均具有欄位 ➝ 商品ID
  - 🅑 其中 1 個資料表才具有的欄位 ➝ 商品ID 之外的欄位

  將屬於 🅐 群組的欄位當作溝通的橋樑，讓屬於 🅑 群組的欄位能同時呈現於 1 組結果之中。
  :::

  ::: warning 範例 7-9
  將 2 個資料表做內部結合

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
  ```SQL
  SELECT SS.store_id, SS.store_name, SS.shohin_id, S.shohin_name, S.sell_price
  FROM StoreShohin AS SS INNER JOIN Shohin AS S
  ON SS.shohin_id = S.shohin_id
  ORDER BY store_id;
  ```

  執行結果
  | store_id | store_name | shohin_id | shohin_name | sell_price |
  |---------:|:----------:|----------:|-------------|-----------:|
  |     000A |    東京    |      0001 | T恤         |       1000 |
  |     000A |    東京    |      0002 | 打孔機      |        500 |
  |     000A |    東京    |      0003 | 襯衫        |       4000 |
  |     000B |   名古屋   |      0002 | 打孔機      |        500 |
  |     000B |   名古屋   |      0003 | 襯衫        |       4000 |
  |     000B |   名古屋   |      0004 | 菜刀        |       3000 |
  |     000B |   名古屋   |      0006 | 叉子        |        500 |
  |     000B |   名古屋   |      0007 | 刨絲器      |        880 |
  |     000C |    大阪    |      0003 | 襯衫        |       4000 |
  |     000C |    大阪    |      0004 | 菜刀        |       3000 |
  |     000C |    大阪    |      0006 | 叉子        |        500 |
  |     000C |    大阪    |      0007 | 刨絲器      |        880 |
  |     000D |    福岡    |      0001 | T恤         |       1000 |
  :::

  ::: warning 專用語法：`Oracle`
  `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 7-9 敘述的時候，
  請將「 `FROM StoreShohin AS SS INNER JOIN Shohin AS S` 」部分改為「 `FROM StoreShohin SS INNER JOIN Shohin S` 」(刪除 FROM 子句中的 AS)。
  :::

  - #### 關於內部結合，有 3 個重點需要特別留意：
    - ##### 內部結合的重點 1 - FROM 子句
      先前都只有寫著 1 個資料表名稱的 `FROM 子句`，在這裡需要寫入 `StoreShohin` 以及 `Shohin` 等 2 個資料表的名稱。
      ```SQL
      FROM StoreShohin AS SS INNER JOIN Shohin AS S
      ```
      此種寫法能成立的關鍵字正是「 `INNER JOIN` 」，而 `SS` 和 `S` 的部分為資料表的別名，賦予別名並非必要的寫法，在 `SELECT 子句` 中亦可採用 `StoreShohin.shohin_id` 的方式，不過會增加閱讀的困難度，一般習慣賦予較為簡潔的別名。

      ::: tip 牢記的原則 7-3
      進行結合的時候，`FROM 子句` 中需要寫入多個資料表名稱
      :::
      
    - ##### 內部結合的重點 2 - ON 子句
      結合條件
      ```SQL
      ON SS.shohin_id = S.shohin_id
      ```
      
      指定了用來聯結 2 個資料表的欄位，也就是所謂的 `結合鍵 (Join Key)`。而 `ON` 有如結合條件專用的 `WHERE 關鍵字`，由於和 `WHERE 子句` 同樣能指定多個結合鍵，所以也可以使用 `AND` 和 `OR` 等運算子。

      撰寫位置必須位於 FROM 和 WHERE 子句之間。

      ::: tip 牢記的原則 7-4
      內部結合必須有 `ON 子句`，其撰寫位置在 `FROM` 和 `WHERE` 子句之間。
      :::

    - ##### 內部結合的重點 3 - SELECT 子句
    ```SQL
    SELECT SS.store_id, SS.store_name, SS.shohin_id, S.shohin_name, S.sell_price
    ```

    `SELECT 子句` 中採用了 `SS.store_id` 或 `S.sell_price` 這樣的寫法，也就是 `<資料表名稱>.<欄位名稱>` 的格式來指定欄位，如此方能明確指定出需要的欄位。

    在語法的規定上，只有 2 個資料表都具有的欄位，才必須冠上資料表的名稱，不過為了容易閱讀理解，使用結合功能的時候，建議將 `SELECT 子句` 中的所有欄位都寫成 `<資料表名稱>.<欄位名稱>` 的格式。

    ::: tip 牢記的原則 7-5
    使用 `結合(JOIN)` 的時候，`SELECT 子句` 的欄位應當寫成 `<資料表名稱>.<欄位名稱>` 的格式。
    :::

  - #### 內部結合 與 WHERE 子句 組合使用
    如果不想 1 次取得全部的店舖，而只取得 東京店 (000A) 的資訊。

    ::: warning 範例 7-10
    組合使用 內部結合 與 WHERE 子句

    - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT SS.store_id, SS.store_name, SS.shohin_id, S.shohin_name, S.sell_price
    FROM StoreShohin AS SS INNER JOIN Shohin AS S
    ON SS.shohin_id = S.shohin_id
    WHERE SS.store_id = '000A';
    ```

    執行結果
    | store_id | store_name | shohin_id | shohin_name | sell_price |
    |---------:|:----------:|----------:|-------------|-----------:|
    |     000A |    東京    |      0001 | T恤         |       1000 |
    |     000A |    東京    |      0002 | 打孔機      |        500 |
    |     000A |    東京    |      0003 | 襯衫        |       4000 |
    :::

    ::: warning 專用語法：`Oracle`
    `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 7-10 敘述的時候，
    請將「 `FROM StoreShohin AS SS INNER JOIN Shohin AS S` 」部分改為「 `FROM StoreShohin SS INNER JOIN Shohin S` 」(刪除 FROM 子句中的 AS)。
    :::

    結合運算將 2 個資料表做結合之後，同樣可以附加使用先前介紹過的 `WHERE`、`GROUP BY`、`HAVING` 以及 `ORDER BY` 等輔助功能的子句。

### 外部結合 - OUTER JOIN
  `外部結合` 也是以 `ON 子句` 所指定的結合鍵來聯結 2 個資料表，而能同時篩選出不同資料表欄位，不同的地方僅在於執行結果的形式。

  ::: warning 範例 7-11
  將 2 個資料表進行 外部結合

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
  ```SQL
  SELECT SS.store_id, SS.store_name, S.shohin_id, S.shohin_name, S.sell_price
  FROM StoreShohin AS SS RIGHT OUTER JOIN Shohin AS S
  ON SS.shohin_id = S.shohin_id
  ORDER BY store_id;
  ```

  執行結果
  | store_id | store_name | shohin_id | shohin_name | sell_price |
  |---------:|:----------:|----------:|-------------|-----------:|
  |     000A |    東京    |      0001 | T恤         |       1000 |
  |     000A |    東京    |      0002 | 打孔機      |        500 |
  |     000A |    東京    |      0003 | 襯衫        |       4000 |
  |     000B |   名古屋   |      0002 | 打孔機      |        500 |
  |     000B |   名古屋   |      0003 | 襯衫        |       4000 |
  |     000B |   名古屋   |      0004 | 菜刀        |       3000 |
  |     000B |   名古屋   |      0006 | 叉子        |        500 |
  |     000B |   名古屋   |      0007 | 刨絲器      |        880 |
  |     000C |    大阪    |      0003 | 襯衫        |       4000 |
  |     000C |    大阪    |      0004 | 菜刀        |       3000 |
  |     000C |    大阪    |      0006 | 叉子        |        500 |
  |     000C |    大阪    |      0007 | 刨絲器      |        880 |
  |     000D |    福岡    |      0001 | T恤         |       1000 |
  |          |            |      0005 | 壓力鍋      |       6800 |
  |          |            |      0008 | 鋼珠筆      |        100 |
  :::

  ::: warning 專用語法：`Oracle`
  `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 7-11 敘述的時候，
  請將「 `FROM StoreShohin AS SS RIGHT OUTER JOIN Shohin AS S` 」部分改為「 `FROM StoreShohin SS RIGHT OUTER JOIN Shohin S` 」(刪除 FROM 子句中的 AS)。
  :::

  - #### 外部結合的重點 1 - 會輸出其中 1 個資料表的全部資訊
    `外部結合`，代表了「 `原資料表中沒有，需要以資料表外部的資訊加入結果之中` 」的意思。
    `內部結合`，只列出資料表內部既有資料的結合方式，只會篩選出 2 個資料表都具有的資訊。
    
  - #### 外部結合的重點 2 - 以哪個資料表為主？
    外部結合 的 篩選結果，會將被指定為主要資料表的所有資訊全部列出，而用來指定的關鍵字為「 `LEFT` 」、「 `RIGHT` 」，如果使用 `LEFT` 會指定 `FROM 子句` 中寫在左側的資料表為主要資料表，若使用 `RIGHT` 則會以右側資料表為主。

  ::: tip 牢記的原則 7-6
  外部結合 使用 LEFT 或 RIGHT 來指定主要的資料表。
  :::

### 使用 3個 以上資料表的結合
  參與結合的資料表數量，原則上沒有限制。

  請另外建立 表7-5，用來管理商品庫存的資料表。

  ::: tip 表 7-5
  StockShohin (庫存商品) 資料表
  | whouse_id (倉庫ID)  | shohin_id (商品ID)  | stock_amount (庫存數量)  |
  |--------------------|--------------------|------------------------:|
  | S001               | 0001               |                       0 |
  | S001               | 0002               |                     120 |
  | S001               | 0003               |                     200 |
  | S001               | 0004               |                       3 |
  | S001               | 0005               |                       0 |
  | S001               | 0006               |                      99 |
  | S001               | 0007               |                     999 |
  | S001               | 0008               |                     200 |
  | S002               | 0001               |                      10 |
  | S002               | 0002               |                      25 |
  | S002               | 0003               |                      34 |
  | S002               | 0004               |                      19 |
  | S002               | 0005               |                      99 |
  | S002               | 0006               |                       0 |
  | S002               | 0007               |                       0 |
  | S002               | 0008               |                      18 |
  :::

  ::: warning 範例 7-13
  建立 StockShohin 資料表與存入資料
  ```SQL
  -- DDL：建立資料表
  CREATE TABLE StockShohin
  (whouse_id CHAR(4) NOT NULL,
   shohin_id CHAR(4) NOT NULL,
   stock_amount INTEGER NOT NULL,
   PRIMARY KEY (whouse_id, shohin_id));
  ```

  - 專用語法：`MySQL`、`MariaDB`
  ```SQL
  -- DML：存入資料
  START TRANSACTION;

  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0001', 0);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0002', 120);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0003', 200);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0004', 3);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0005', 0);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0006', 99);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0007', 999);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S001', '0008', 200);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0001', 10);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0002', 25);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0003', 34);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0004', 19);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0005', 99);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0006', 0);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0007', 0);
  INSERT INTO StockShohin (whouse_id, shohin_id, stock_amount) VALUES ('S002', '0008', 18);

  COMMIT;
  ```
  :::

  ::: warning 專用語法
  各家 `DBMS` 交易功能的語法略有差異，如果在 `PostgreSQL` 或 `SQL Server` 執行 範例 7-13 的 `DML 敘述` 時，需要將「 `START TRANSACTION` 」改為「 `BEGIN TRANSACTION` 」，而在 `Oracle` 或 `DB2` 上執行的時候，不需要「 `START TRANSACTION` 」，直接刪除即可。
  :::

  ::: warning 範例 7-14
  以 3 個資料表做內部結合

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
  ```SQL
  SELECT SS.store_id, SS.store_name, SS.shohin_id, S.shohin_name, S.sell_price, ZS.stock_amount
  FROM StoreShohin AS SS
    INNER JOIN Shohin AS S
    ON SS.shohin_id = S.shohin_id
    INNER JOIN StockShohin AS ZS
    ON SS.shohin_id = ZS.shohin_id
  WHERE ZS.whouse_id = 'S001'
  ORDER BY store_id;
  ```

  執行結果
  | store_id | store_name | shohin_id | shohin_name | sell_price | stock_amount |
  |---------:|:----------:|----------:|-------------|-----------:|-------------:|
  |     000A |    東京    |      0001 | T恤          |       1000 |            0 |
  |     000A |    東京    |      0002 | 打孔機        |        500 |          120 |
  |     000A |    東京    |      0003 | 襯衫          |       4000 |          200 |
  |     000B |   名古屋   |      0002 | 打孔機        |        500 |          120 |
  |     000B |   名古屋   |      0003 | 襯衫          |       4000 |          200 |
  |     000B |   名古屋   |      0004 | 菜刀          |       3000 |            3 |
  |     000B |   名古屋   |      0006 | 叉子          |        500 |           99 |
  |     000B |   名古屋   |      0007 | 刨絲器        |        880 |          999 |
  |     000C |    大阪    |      0003 | 襯衫         |       4000 |          200 |
  |     000C |    大阪    |      0004 | 菜刀         |       3000 |            3 |
  |     000C |    大阪    |      0006 | 叉子         |        500 |           99 |
  |     000C |    大阪    |      0007 | 刨絲器        |        880 |          999 |
  |     000D |    福岡    |      0001 | T恤          |       1000 |            0 |

  在原本進行內部結合的 `FROM 子句` 後方，再度以 `INNER JOIN` 加上 `StockShohin 資料表` 的資料。
  :::

  ::: warning 專用語法：`Oracle`
  `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 7-14 敘述的時候，
  請將「 `FROM StoreShohin AS SS INNER JOIN Shohin AS S` 」部分改為「 `FROM StoreShohin SS INNER JOIN Shohin S` 」，將「 `INNER JOIN StockShohin AS ZS` 」部分改為「 `INNER JOIN StockShohin ZS` 」(刪除 FROM 子句中的 AS)。
  :::

### 交叉結合 - CROSS JOIN
  交叉結合 (CROSS JOIN) 在實務上幾乎不會使用，但交叉結合是所有結合運算的基礎。

  ::: warning 範例 7-15
  2 個資料表進行交叉結合

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
  ```SQL
  SELECT SS.store_id, SS.store_name, SS.shohin_id, S.shohin_name
  FROM StoreShohin AS SS CROSS JOIN Shohin AS S;
  ```

  執行結果
  | store_id | store_name | shohin_id | shohin_name |
  |---------:|:----------:|----------:|-------------|
  |     000A |    東京    |      0001 | T恤         |
  |     000A |    東京    |      0002 | T恤         |
  |     000A |    東京    |      0003 | T恤         |
  |     000B |   名古屋   |      0002 | T恤         |
  |     000B |   名古屋   |      0003 | T恤         |
  |     000B |   名古屋   |      0004 | T恤         |
  |     000B |   名古屋   |      0006 | T恤         |
  |     000B |   名古屋   |      0007 | T恤         |
  |     000C |    大阪    |      0003 | T恤         |
  |     000C |    大阪    |      0004 | T恤         |
  |     000C |    大阪    |      0006 | T恤         |
  |     000C |    大阪    |      0007 | T恤         |
  |     000D |    福岡    |      0001 | T恤         |
  |     000A |    東京    |      0001 | 打孔機      |
  |     000A |    東京    |      0002 | 打孔機      |
  |     000A |    東京    |      0003 | 打孔機      |
  |     000B |   名古屋   |      0002 | 打孔機      |
  |     000B |   名古屋   |      0003 | 打孔機      |
  |     000B |   名古屋   |      0004 | 打孔機      |
  |     000B |   名古屋   |      0006 | 打孔機      |
  |     000B |   名古屋   |      0007 | 打孔機      |
  |     000C |    大阪    |      0003 | 打孔機      |
  |     000C |    大阪    |      0004 | 打孔機      |
  |     000C |    大阪    |      0006 | 打孔機      |
  |     000C |    大阪    |      0007 | 打孔機      |
  |     000D |    福岡    |      0001 | 打孔機      |
  |     000A |    東京    |      0001 | 襯衫        |
  |     000A |    東京    |      0002 | 襯衫        |
  |     000A |    東京    |      0003 | 襯衫        |
  |     000B |   名古屋   |      0002 | 襯衫        |
  |     000B |   名古屋   |      0003 | 襯衫        |
  |     000B |   名古屋   |      0004 | 襯衫        |
  |     000B |   名古屋   |      0006 | 襯衫        |
  |     000B |   名古屋   |      0007 | 襯衫        |
  |     000C |    大阪    |      0003 | 襯衫        |
  |     000C |    大阪    |      0004 | 襯衫        |
  |     000C |    大阪    |      0006 | 襯衫        |
  |     000C |    大阪    |      0007 | 襯衫        |
  |     000D |    福岡    |      0001 | 襯衫        |
  |     000A |    東京    |      0001 | 菜刀        |
  |     000A |    東京    |      0002 | 菜刀        |
  |     000A |    東京    |      0003 | 菜刀        |
  |     000B |   名古屋   |      0002 | 菜刀        |
  |     000B |   名古屋   |      0003 | 菜刀        |
  |     000B |   名古屋   |      0004 | 菜刀        |
  |     000B |   名古屋   |      0006 | 菜刀        |
  |     000B |   名古屋   |      0007 | 菜刀        |
  |     000C |    大阪    |      0003 | 菜刀        |
  |     000C |    大阪    |      0004 | 菜刀        |
  |     000C |    大阪    |      0006 | 菜刀        |
  |     000C |    大阪    |      0007 | 菜刀        |
  |     000D |    福岡    |      0001 | 菜刀        |
  |     000A |    東京    |      0001 | 壓力鍋      |
  |     000A |    東京    |      0002 | 壓力鍋      |
  |     000A |    東京    |      0003 | 壓力鍋      |
  |     000B |   名古屋   |      0002 | 壓力鍋      |
  |     000B |   名古屋   |      0003 | 壓力鍋      |
  |     000B |   名古屋   |      0004 | 壓力鍋      |
  |     000B |   名古屋   |      0006 | 壓力鍋      |
  |     000B |   名古屋   |      0007 | 壓力鍋      |
  |     000C |    大阪    |      0003 | 壓力鍋      |
  |     000C |    大阪    |      0004 | 壓力鍋      |
  |     000C |    大阪    |      0006 | 壓力鍋      |
  |     000C |    大阪    |      0007 | 壓力鍋      |
  |     000D |    福岡    |      0001 | 壓力鍋      |
  |     000A |    東京    |      0001 | 叉子        |
  |     000A |    東京    |      0002 | 叉子        |
  |     000A |    東京    |      0003 | 叉子        |
  |     000B |   名古屋   |      0002 | 叉子        |
  |     000B |   名古屋   |      0003 | 叉子        |
  |     000B |   名古屋   |      0004 | 叉子        |
  |     000B |   名古屋   |      0006 | 叉子        |
  |     000B |   名古屋   |      0007 | 叉子        |
  |     000C |    大阪    |      0003 | 叉子        |
  |     000C |    大阪    |      0004 | 叉子        |
  |     000C |    大阪    |      0006 | 叉子        |
  |     000C |    大阪    |      0007 | 叉子        |
  |     000D |    福岡    |      0001 | 叉子        |
  |     000A |    東京    |      0001 | 刨絲器      |
  |     000A |    東京    |      0002 | 刨絲器      |
  |     000A |    東京    |      0003 | 刨絲器      |
  |     000B |   名古屋   |      0002 | 刨絲器      |
  |     000B |   名古屋   |      0003 | 刨絲器      |
  |     000B |   名古屋   |      0004 | 刨絲器      |
  |     000B |   名古屋   |      0006 | 刨絲器      |
  |     000B |   名古屋   |      0007 | 刨絲器      |
  |     000C |    大阪    |      0003 | 刨絲器      |
  |     000C |    大阪    |      0004 | 刨絲器      |
  |     000C |    大阪    |      0006 | 刨絲器      |
  |     000C |    大阪    |      0007 | 刨絲器      |
  |     000D |    福岡    |      0001 | 刨絲器      |
  |     000A |    東京    |      0001 | 鋼珠筆      |
  |     000A |    東京    |      0002 | 鋼珠筆      |
  |     000A |    東京    |      0003 | 鋼珠筆      |
  |     000B |   名古屋   |      0002 | 鋼珠筆      |
  |     000B |   名古屋   |      0003 | 鋼珠筆      |
  |     000B |   名古屋   |      0004 | 鋼珠筆      |
  |     000B |   名古屋   |      0006 | 鋼珠筆      |
  |     000B |   名古屋   |      0007 | 鋼珠筆      |
  |     000C |    大阪    |      0003 | 鋼珠筆      |
  |     000C |    大阪    |      0004 | 鋼珠筆      |
  |     000C |    大阪    |      0006 | 鋼珠筆      |
  |     000C |    大阪    |      0007 | 鋼珠筆      |
  |     000D |    福岡    |      0001 | 鋼珠筆      |
  :::

  ::: warning 專用語法：`Oracle`
  `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 7-15 敘述的時候，
  請將「 `FROM StoreShohin AS SS CROSS JOIN Shohin AS S` 」部分改為「 `FROM StoreShohin SS CROSS JOIN Shohin S` 」(刪除 FROM 子句中的 AS)。
  :::

  `交叉結合` 用來連結 2 個資料表的集合運算子為「 `CROSS JOIN (笛卡兒乘積)` 」，進行 `交叉結合` 的時候，不能以先前內部或外部結合使用過的 `ON 子句` 來指定條件。

  `交叉結合` 運算時會針對 2 個資料表的全部紀錄，逐一列出所有的組合方式，因此其執行結果的紀錄筆數一定是 2 個資料表紀錄筆數的乘積 ( `A 資料表筆數` X `B 資料表筆數` )。

  `內部結合` 的結果 包含在交叉結合的結果 `之內`。

  `外部結合` 的結果 含有交叉結合結果 `以外` 的部分。

### 結合的專用語法和舊化語法
  `內部結合` 和 `外部結合` 的語法，皆為 `標準 SQL` 所訂定的正式寫法，可以在所有的 `DBMS` 上執行。

  ::: warning 範例 7-16
  使用舊式語法的 `內部結合` (執行結果與 範例 7-9 相同)

  - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
  ```SQL
  SELECT SS.store_id, SS.store_name, SS.shohin_id, S.shohin_name, S.sell_price
  FROM StoreShohin SS, Shohin S
  WHERE SS.shohin_id = S.shohin_id
  AND SS.store_id = '000A';
  ```
  :::

  雖然可以正常執行，不過此種寫法除了較為過時之外，還具有其他許多問題，建議不要再使用這些語法，其主要原因有下列 3 項理由。
  - 第 1 個，此種寫法比較難以讓人一目了然，其結合的類型到底是 `內部結合` 或 `外部結合` (或其他的結合方式)。
  - 第 2 個，由於結合的條件是寫在 `WHERE 子句` 之中，所以比較難以看出哪裡是結合條件，哪裡又是篩選紀錄的限制條件。
  - 第 3 個，沒有人能確定此語法可以使用到什麼時候。各家 `DBMS` 的開發廠商正在考慮捨棄此舊式語法，只支援新的語法。

  ::: tip 牢記的原則 7-7
  請勿再使用結合的 `舊式語法` 或 `專用語法`，不過還是需要具備解讀的能力。
  :::

  > ### COLUMN 關聯式除法運算
  >   這個章節學習過了下列 4 個集合運算子的相關使用方式。
  >   - `UNION (聯集)` (加)
  >   - `EXCEPT (差集)` (減)
  >   - `INTERSECT (交集)` (重複的部分)
  >   - `CROSS JOIN (笛卡兒乘積)` (乘)
  >  在集合運算中的除法運算一般稱為「 關聯式除法運算 (Relational Division) 」，其中關聯式的稱呼來自於目前主流資料庫的關聯式模型。
  >  
  >  後面會使用到 `表7-A` 和 `表7-B`
  >  ::: tip 表 7-A
  >  SKILLs (技能) 資料表：關聯式除法運算的除數
  >  | Skill  |
  >  |--------|
  >  | Oracle |
  >  | UNIX   |
  >  | Java   |
  >  :::
  >  
  >  ::: tip 表 7-B
  >  EmpSkills (員工技能) 資料表：關聯式除法運算的被除數
  >  | emp    | skill  |
  >  |--------|--------|
  >  | 相田   | Oracle |
  >  | 相田   | UNIX   |
  >  | 相田   | Java   |
  >  | 相田   | C#     |
  >  | 神崎   | Oracle |
  >  | 神崎   | UNIX   |
  >  | 神崎   | Java   |
  >  | 平井   | UNIX   |
  >  | 平井   | Oracle |
  >  | 平井   | PHP    |
  >  | 平井   | Perl   |
  >  | 平井   | C++    |
  >  | 若田部 | Perl   |
  >  | 渡來   | Oracle |
  >  :::
  >
  >  ::: warning 範例 7-A
  >  建立 Skills/EmpSkills 資料表與存入資料
  >  ```SQL
  >  -- DDL：建立資料表
  >  CREATE TABLE Skills
  >  (skill VARCHAR(32),
  >   PRIMARY KEY (skill));
  >  
  >  CREATE TABLE EmpSkills
  >  (emp VARCHAR(32),
  >   skill VARCHAR(32),
  >   PRIMARY KEY (emp, skill));
  >  ```
  >  
  >  - 專用語法：`MySQL`、`MariaDB`
  >  ```SQL
  >  -- DML：存入資料
  >  START TRANSACTION;
  >  
  >  INSERT INTO Skills VALUES ('Oracle');
  >  INSERT INTO Skills VALUES ('UNIX');
  >  INSERT INTO Skills VALUES ('Java');
  >  
  >  INSERT INTO EmpSkills VALUES ('相田', 'Oracle');
  >  INSERT INTO EmpSkills VALUES ('相田', 'UNIX');
  >  INSERT INTO EmpSkills VALUES ('相田', 'Java');
  >  INSERT INTO EmpSkills VALUES ('相田', 'C#');
  >  INSERT INTO EmpSkills VALUES ('神崎', 'Oracle');
  >  INSERT INTO EmpSkills VALUES ('神崎', 'UNIX');
  >  INSERT INTO EmpSkills VALUES ('神崎', 'Java');
  >  INSERT INTO EmpSkills VALUES ('平井', 'UNIX');
  >  INSERT INTO EmpSkills VALUES ('平井', 'Oracle');
  >  INSERT INTO EmpSkills VALUES ('平井', 'PHP');
  >  INSERT INTO EmpSkills VALUES ('平井', 'Perl');
  >  INSERT INTO EmpSkills VALUES ('平井', 'C++');
  >  INSERT INTO EmpSkills VALUES ('若田部', 'Perl');
  >  INSERT INTO EmpSkills VALUES ('渡來', 'Oracle');
  >  
  >  COMMIT;
  >  ```
  >  :::
  >  
  >  ::: warning 專用語法
  >  各家 `DBMS` 交易功能的語法略有差異，如果在 `PostgreSQL` 或 `SQL Server` 執行 範例 7-A 的`DML 敘述` 時，需要將「 `START TRANSACTION` 」改為「 `BEGIN TRANSACTION` 」，而在 `Oracle` 或 `DB2` 上執行的時候，不需要「 `START TRANSACTION` 」，直接刪除即可。
  >  :::
  >
  >  這裡所要達成的目標，是根據 EmpSkills 資料表的內容，篩選出「 同時兼具 」Skills 資料表所列 3 種技能的員工名字。
  > 
  >  ::: warning 範例 7-B
  >  篩選出兼具 3 種技能的員工
  >
  >  - 專用語法：`MySQL`、`MariaDB`
  >  ```SQL
  >  SELECT DISTINCT emp
  >  FROM EmpSkills AS ES1
  >  WHERE NOT EXISTS (
  >    SELECT skill
  >    FROM Skills
  >    WHERE skill NOT IN (
  >      SELECT skill
  >      FROM EmpSkills AS ES2
  >      WHERE ES1.emp = ES2.emp
  >    )
  >  );
  >  ```
  >
  >  執行結果
  >  | emp  |
  >  |------|
  >  | 神崎 |
  >  | 相田 |
  >  :::

## 自我練習
  - 7.1 下列 SELECT 敘述執行之後會獲得什麼樣的結果呢？
    ```SQL
    -- 使用主文中的 Shohin 資料表
    SELECT *
    FROM Shohin
    UNION
    SELECT *
    FROM Shohin
    WHERE shohin_id IN (
      SELECT shohin_id
      FROM Shohin
    )
    ORDER BY shohin_id;
    ```

    ::: details 練習
    | shohin_id | shohin_name | shohin_catalg | sell_price | buying_price | reg_date   |
    |----------:|-------------|---------------|-----------:|-------------:|------------|
    |      0001 | T恤         | 衣物           |       1000 |          500 | 2009-09-20 |
    |      0002 | 打孔機       | 辦公用品       |        500 |          320 | 2009-09-11 |
    |      0003 | 襯衫         | 衣物          |       4000 |         2800 |            |
    |      0004 | 菜刀         | 廚房用品       |       3000 |         2800 | 2009-09-20 |
    |      0005 | 壓力鍋       | 廚房用品       |       6800 |         5000 | 2009-01-15 |
    |      0006 | 叉子         | 廚房用品       |        500 |              | 2009-09-20 |
    |      0007 | 刨絲器       | 廚房用品       |        880 |          790 | 2008-04-28 |
    |      0008 | 鋼珠筆       | 辦公用品       |        100 |              | 2009-11-11 |
    :::

  - 7.2 7-2節範例7-11 進行外部結合的結果中，壓力鍋和鋼珠筆這 2 筆紀錄的店舖 ID (store_id) 和店舖名稱 (store_name) 為 NULL，請試著將這些 NULL 都轉換成 「 未知 」的字串，最後的結果如下所示。
    執行結果
    | store_id | store_name | shohin_id | shohin_name | sell_price |
    |---------:|:----------:|----------:|-------------|-----------:|
    |     000A |    東京    |      0001 | T恤         |       1000 |
    |     000A |    東京    |      0002 | 打孔機      |        500 |
    |     000A |    東京    |      0003 | 襯衫        |       4000 |
    |     000B |   名古屋   |      0002 | 打孔機      |        500 |
    |     000B |   名古屋   |      0003 | 襯衫        |       4000 |
    |     000B |   名古屋   |      0004 | 菜刀        |       3000 |
    |     000B |   名古屋   |      0006 | 叉子        |        500 |
    |     000B |   名古屋   |      0007 | 刨絲器      |        880 |
    |     000C |    大阪    |      0003 | 襯衫        |       4000 |
    |     000C |    大阪    |      0004 | 菜刀        |       3000 |
    |     000C |    大阪    |      0006 | 叉子        |        500 |
    |     000C |    大阪    |      0007 | 刨絲器      |        880 |
    |     000D |    福岡    |      0001 | T恤         |       1000 |
    |     未知  |    未知    |      0005 | 壓力鍋      |       6800 |
    |     未知  |    未知    |      0008 | 鋼珠筆      |        100 |

    ::: details 練習
    ```SQL
    -- COALESCE 會逐一回傳 不是 NULL 的值
    SELECT COALESCE(SS.store_id, "未知") AS s_id, COALESCE(SS.store_name, "未知") AS s_name, S.shohin_id, S.shohin_name, S.sell_price
    FROM StoreShohin AS SS RIGHT OUTER JOIN Shohin AS S
    ON SS.shohin_id = S.shohin_id
    ORDER BY store_id;
    ```
    :::