---
title: 第 6 章 函數、述詞、CASE 運算式
---

# 第 6 章 函數、述詞、CASE 運算式

## 6-1 各式各樣的函數
  ::: info 學習重點
  - 函數按照其用途類別，大致上可分為 `數學函數`、`字串函數`、`日期函數`、`轉換函數`、以及 `彙總函數` 等類型。
  - 由於函數的數量非常多，所以不必勉強全部記住，只要先學會經常使用的代表性函數，其他函數在需要的時候再查詢用法即可。
  :::

### 函數的類型
  所謂的函數，即是「 若 `輸入` 某個值，便會 `輸出` 對應值 」的功能。

  此時的輸入值被稱為「 `參數 ( Parameter )` 」，而輸出的值則被稱為「 `回傳值` 」。

  SQL 的函數大致上可分為下列幾種類型：
  - `數學函數` ( 用來計算數值的函數 )
  - `字串函數` ( 用來操作字串的函數 )
  - `日期函數` ( 用來操作日期的函數 )
  - `轉換函數` ( 轉換資料型別或內容值的函數 )
  - `彙總函數` ( 用來統計資料的函數 )

### 數學函數
  - `+` ( 加法運算 )
  - `-` ( 減法運算 )
  - `*` ( 乘法運算 )
  - `/` ( 除法運算 )

  因為這些運算子也具有「 針對輸入、回應輸出 」的功能，所以毫無疑問地屬於數學函數。

  資料型別「 `NUMERIC (整體位數，小數位數)` 」的形式來指定數值大小。

  ::: warning 範例 6-1
  建立 SampleMath 資料表
  ```SQL
  -- DDL：建立資料表
  CREATE TABLE SampleMath
  (m NUMERIC (10,3),
   n NUMERIC,
   p NUMERIC);
  ```

  - 專用語法：`MySQL`、`MariaDB`
  ```SQL
  -- DML：存入資料
  START TRANSACTION;

  INSERT INTO SampleMath(m, n, p) VALUES (500, 0, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (-180, 0, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (NULL, NULL, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (NULL, 7, 3);
  INSERT INTO SampleMath(m, n, p) VALUES (NULL, 5, 2);
  INSERT INTO SampleMath(m, n, p) VALUES (NULL, 4, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (8, NULL, 3);
  INSERT INTO SampleMath(m, n, p) VALUES (2.27, 1, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (5.555, 2, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (NULL, 1, NULL);
  INSERT INTO SampleMath(m, n, p) VALUES (8.76, NULL, NULL);

  COMMIT;
  ```
  :::

  ::: warning 專用語法
  各家 `DBMS` 交易功能的語法略有差異，如果在 `PostgreSQL` 或 `SQL Server` 執行 範例 6-1 的 `DML 敘述` 時，需要將「 `START TRANSACTION` 」改為「 `BEGIN TRANSACTION` 」，而在 `Oracle` 或 `DB2` 上執行的時候，不需要「 `START TRANSACTION` 」，直接刪除即可。
  :::

  - #### ABS - 絕對值
    ::: warning 語法 6-1
    ABS 函數
    ```SQL
    ABS(數值)
    ```
    :::

    `ABS` 是能求得絕對值的函數，而 `絕對值 (Absolute Value)` 不考慮數值的正負，是用來表達和零之間距離大小的數值。

    ::: warning 範例 6-2
    求得數值的絕對值
    ```SQL
    SELECT m, ABS(m) AS abs_col
    FROM SampleMath;
    ```

    執行結果
    |        m | abs_col |
    |---------:|--------:|
    |  500.000 | 500.000 |
    | -180.000 | 180.000 |
    |          |         |
    |          |         |
    |          |         |
    |          |         |
    |    8.000 |   8.000 |
    |    2.270 |   2.270 |
    |    5.555 |   5.555 |
    |          |         |
    |    8.760 |   8.760 |
    :::

  - #### MOD - 餘數
    ::: warning 語法 6-2
    MOD 函數
    ```SQL
    MOD(被除數, 除數)
    ```
    :::

    `MOD` 是用來求得除法運算餘數的函數，其名稱來自於 `Modulo` 的縮寫。它的使用方式若舉例來說，由於「 `7 ÷ 3` 」的餘數為 1，所以「 `MOD(7, 3)` = 1 」。另外，因為帶有小數的數值在運算上沒有「 餘數 」的概念，因此能適用 `MOD 函數`的只有 `整數型別` 的欄位。

    ::: warning 範例 6-3
    求得除法運算 (n ÷ p) 的餘數
    ```SQL
    SELECT n, p, MOD(n, p) AS mod_col
    FROM SampleMath;
    ```

    執行結果
    | m | p | mod_col |
    |:-:|:-:|:-------:|
    | 0 |   |         |
    | 0 |   |         |
    |   |   |         |
    | 7 | 3 |    1    |
    | 5 | 2 |    1    |
    | 4 |   |         |
    |   | 3 |         |
    | 1 |   |         |
    | 2 |   |         |
    | 1 |   |         |
    |   |   |         |
    :::

    這裡需要特別注意的地方，在目前主要的各家 `DBMS` 之中，只有 `SQL Server` 無法使用此 `MOD 函數`。

    ::: warning 專用語法：`SQL Server`
    想在 `SQL Server` 上求得餘數的時候，需要改用「 `%` 」這個特殊的運算符 (函數)，只要使用下列的 `SQL Server` 專用語法，便能獲得相同的結果，雖然有點麻煩。
    ```SQL
    SELECT n, p, n%p AS mod_col
    FROM SampleMath;
    ```
    :::

  - #### ROUND - 四捨五入
    ::: warning 語法 6-3
    ROUND 函數
    ```SQL
    ROUND(對象數值, 做捨入的小數位數)
    ```
    :::

    四捨五入可以透過名為 `ROUND` 的函數來完成。四捨五入是相當常見的數值簡化做法，英文中使用 `Round` 這個單字因而得名。如果指定做捨入的位數為 1，那麼會在小數第 1 位後面做捨入。

    ::: warning 範例 6-4
    對 m 欄位的數值在 n 欄位的位數作四捨五入
    ```SQL
    SELECT ｍ, n, ROUND(m, n) AS round_col
    FROM SampleMath;
    ```

    執行結果
    |        m | n | round_col |
    |---------:|:-:|----------:|
    |  500.000 | 0 |       500 |
    | -180.000 | 0 |      -180 |
    |          |   |           |
    |          | 7 |           |
    |          | 5 |           |
    |          | 4 |           |
    |    8.000 |   |           |
    |    2.270 | 1 |       2.3 |
    |    5.555 | 2 |      5.56 |
    |          | 1 |           |
    |    8.760 |   |           |
    :::

### 字串函數
  為了便於練習字串函數的功能，需要另外建立名為 `SampleStr` 的資料表。

  ::: warning 範例 6-5
  建立 SampleStr 資料表
  ```SQL
  -- DDL：建立資料表
  CREATE TABLE SampleStr
  (str1 VARCHAR(40),
   str2 VARCHAR(40),
   str3 VARCHAR(40));
  ```
  
  - 專用語法：`SQL Server`、`PostgreSQL`
  ```SQL
  -- DML：存入資料
  START TRANSACTION;

  INSERT INTO SampleStr(str1, str2, str3) VALUES ('一二三', '四五', NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('abc', 'def', NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('山田', '太郎', '是也');
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('aaa', NULL, NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES (NULL, '甲乙丙', NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('@!#$%', NULL, NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('ABC', NULL, NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('aBC', NULL, NULL);
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('abc 太郎', 'abc', 'ABC');
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('abcdefabc', 'abc', 'ABC');
  INSERT INTO SampleStr(str1, str2, str3) VALUES ('言必信行必果', '必', '不');

  SELECT * FROM SampleStr;

  COMMIT;
  ```

  執行結果
  | str1         | str2   | str3 |
  |--------------|--------|------|
  | 一二三        | 四五    |      |
  | abc          | def    |      |
  | 山田          | 太郎    | 是也 |
  | aaa          |        |      |
  |              | 甲乙丙  |      |
  | @!#$%        |        |      |
  | ABC          |        |      |
  | aBC          |        |      |
  | abc 太郎      | abc    | ABC  |
  | abcdefabc    | abc    | ABC  |
  | 言必信行必果   | 必      | 不   |
  :::

  - #### CONCAT - 字串連接
    ::: warning 語法 6-4
    CONCAT 函數
    ```SQL
    CONCAT(字串1, 字串2, ...)
    ```
    :::

    在 `MySQL`、`MariaDB`、`SQL SERVER 2012 之後的版本`，可以使用 `CONCAT` 的函數

    ::: warning 範例 6-6
    連接 2 個字串 (str1 + str2)

    - 專用語法：`MySQL`、`MariaDB`、`SQL Server 2012 以後`
    ```SQL
    SELECT str1, str2, CONCAT(str1, str2) AS str_concat
    FROM SampleStr;
    ```

    執行結果
    | str1         | str2   | str_concat     |
    |--------------|--------|----------------|
    | 一二三        | 四五    | 一二三四五      |
    | abc          | def    | abcdef         |
    | 山田          | 太郎   | 山田太郎        |
    | aaa          |        |                |
    |              | 甲乙丙  |                |
    | @!#$%        |        |                |
    | ABC          |        |                |
    | aBC          |        |                |
    | abc 太郎      | abc    | abc 太郎abc    |
    | abcdefabc    | abc    | abcdefabcabc   |
    | 言必信行必果   | 必      | 言必信行必果必  |
    :::

    連接字串的時候，如果連接的對象當中有 `NULL`，那麼結果也必定為 `NULL`。另外，`CONCAT 函數` 也適用於連接 3 個以上的字串。

    ::: warning 範例 6-7
    連接 3 個字串 (str1 + str2 + str3)

    - 專用語法：`MySQL`、`MariaDB`、`SQL Server 2012 以後`
    ```SQL
    SELECT str1, str2, str3,
           CONCAT(str1, str2, str3) AS str_concat
    FROM SampleStr
    WHERE str1 = '山田';
    ```

    執行結果
    | str1 | str2 | str3 | str_concat   |
    |------|------|------|--------------|
    | 山田  | 太郎  | 是也 | 山田太郎是也   |
    :::

    這裡有個需要注意的地方，那便是 `Oracle` 的 `CONCAT 函數` 只能寫入 2 個參數 (1 次 只能連接 2 個字串)，而 `DB2`、`PostgreSQL` 和 `舊版的 SQL Server` 無法使用此函數。

    ::: warning 專用語法：`Oracle`、`DB2`、`PostgreSQL`、`SQL Server`
    在 `Oracle`、`DB2`、`PostgreSQL` 連接字串的時候，請改用「 `||` 」這個運算子，
    
    而 `SQL Server` 還可以使用「 `+` 」運算子，
    
    這些運算子的作用和函數完全相同，因此亦可視為特殊形式的函數。

    - 專用語法：`Oracle`、`DB2`、`PostgreSQL`
    ```SQL
    SELECT str1, str2, str3,
           str1 || str2 || str3 AS str_concat
    FROM SampleStr
    WHERE str1 = '山田';
    ```

    - 專用語法：`SQL Server`
    ```SQL
    SELECT str1, str2, str3,
           str1 + str2 + str3 AS str_concat
    FROM SampleStr
    WHERE str1 = '山田';
    ```
    :::

  - #### LENGTH - 字串長度
    ::: warning 語法 6-5
    LENGTH 函數
    ```SQL
    LENGTH(字串)
    ```
    :::

    想要查詢某個字串有幾個文字的時候，可以使用功能如同其名稱的 `LENGTH (長度) 函數`。

    ::: warning 範例 6-8
    查詢字串的長度

    - 專用語法：`Oracle`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT str1, LENGTH(str1) AS len_str
    FROM SampleStr;
    ```

    執行結果
    | str1         | len_str |
    |--------------|:-------:|
    | 一二三        |    3    |
    | abc          |    3    |
    | 山田          |    2    |
    | aaa          |    3    |
    |              |         |
    | @!#$%        |    5    |
    | ABC          |    3    |
    | aBC          |    3    |
    | abc 太郎      |    5    |
    | abcdefabc    |    9    |
    | 言必信行必果   |    6    |
    :::

    另外，請注意 `此 LENGTH 函數，無法在 SQL Server 上使用`。

    ::: warning 專用語法：`SQL Server`
    取而代之地，`SQL Server` 準備了名為 `LEN` 的函數。

    ```SQL
    SELECT str1, LEN(str1) AS len_str
    FROM SampleStr;
    ```
    :::

> ### COLUMN - 也有 LENGTH 函數會將 1 個中文字的長度視為大於 1
> - 關於 `LENGTH 函數` 還有另外 1 個需要特別注意的事項，雖然這涉及了較為進階的內容，不過簡單來說就是 `LENGTH 函數` 以何種單位當作「 長度 1 」。
>
> - 相對於 1 個半形英文字母會佔用 1 個 `位元組` 的空間，全形中文字在呈現上需要佔用 2 個或 2 個以上的位元組空間 (亦被稱為 `多位元組文字`)，因此，如果像 `MySQL` 或 `MariaDB` 這樣，其 `LENGTH 函數` 是以 1 個位元組來當作計算單位，那麼「 LENGTH('山田') 」將會回傳 4 的數值，即使是相同名稱的 `LENGTH 函數`，在不同的 `DBMS` 或環境狀況之下也可能得到不同的結果。
>
>   - `MySQL` 和 `MariaDB` 另外備有以 文字數量為計算單位的 `CHAR_LENGTH 函數`
>
> - 雖然容易造成混亂，不過還是請先記得可能會遇到這樣的狀況

  - #### LOWER - 轉為小寫
    ::: warning 語法 6-6
    LOWER 函數
    ```SQL
    LOWER(字串)
    ```
    :::

    `LOWER` 是針對英文字母所設計的函數，能將參數的字串全部轉換成小寫，因此，英文字母以外的文字不會發生變化，而原本就是小寫的字母也不會受到影響。

    ::: warning 範例 6-9
    將大寫字母轉為小寫
    ```SQL
    SELECT str1, LOWER(str1) AS low_str
    FROM SampleStr
    WHERE str1 IN ('ABC', 'aBC', 'abc', '山田');
    ```

    執行結果
    | str1 | low_str |
    |------|---------|
    | abc  | abc     |
    | 山田  | 山田    |
    | ABC  | abc     |
    | aBC  | abc     |
    :::

  - #### REPLACE - 字串置換
    ::: warning 語法 6-7
    REPLACE 函數
    ```SQL
    REPLACE(置換對象字串, 置換前的部分字串, 置換後的部分字串)
    ```
    :::

    `REPLACE 函數` 的使用時機，在於想將字串中的部分字串，置換成其他字串的時候。

    ::: warning 範例 6-10
    置換字串中的部分文字
    ```SQL
    SELECT str1, str2, str3, REPLACE(str1, str2, str3) AS rep_str
    FROM SampleStr
    ```

    執行結果
    | str1       | str2  | str3| rep_str    |
    |------------|-------|-----|------------|
    | 一二三      | 四五   |     |            |
    | abc        | def   |     |            |
    | 山田        | 太郎  | 是也 | 山田        |
    | aaa        |       |     |            |
    |            | 甲乙丙 |     |            |
    | @!#$%      |       |     |            |
    | ABC        |       |     |            |
    | aBC        |       |     |            |
    | abc 太郎    | abc   | ABC | ABC 太郎   |
    | abcdefabc  | abc   | ABC | ABCdefABC  |
    | 言必信行必果 | 必    | 不   | 言不信行不果 |
    :::

  - #### SUBSTRING - 文字擷取
    ::: warning 語法 6-8
    SUBSTRING 函數

    - 專用語法 `PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SUBSTRING(擷取對象字串 FROM 擷取開始位置 FOR 擷取文字數量)
    ```
    :::

    `SUBSTRING 函數` 用於從原本的字串擷取出一部分字串，參數中的 `擷取開始位置` 指的是「 從左邊起算的第幾個文字 」。
      - 不過請注意，這和 `LENGTH 函數` 同樣有多位元組文字的問題存在。

    ::: warning 範例 6-11
    擷取出字串左邊起算的第 3 和 第 4 個文字

    - 專用語法：`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT str1, SUBSTRING(str1 FROM 3 FOR 2) AS sub_str
    FROM SampleStr;
    ```

    執行結果
    | str1       | sub_str |
    |------------|---------|
    | 一二三      | 三      |
    | abc        | c       |
    | 山田        |         |
    | aaa        | a       |
    |            |         |
    | @!#$%      | #$      |
    | ABC        | C       |
    | aBC        | C       |
    | abc 太郎    | c 太    |
    | abcdefabc  | cd      |
    | 言必信行必果 | 信行     |
    :::

    此 `SUBSTRING 函數` 雖然是標準 SQL 所認可的正式語法，不過在目前的時間點上，只有 `PostgreSQL`、`MySQL` 和 `MariaDB` 能使用此函數。

    ::: warning 專用語法：`SQL Server`、`Oracle`、`DB2`
    `SQL Server` 採用了稍微簡略一些的語法。
    ```SQL
    SUBSTRING(擷取對象字串, 擷取開始位置, 擷取文字數量)
    ```

    而 `Oracle` 和 `DB2` 改採更為簡略的語法。
    ```SQL
    SUBSTR(擷取對象字串, 擷取開始位置, 擷取文字數量)
    ```

    對於專用語法這麼多的狀況，真的會讓人覺得相當困擾。如果想獲得和範例相同的結果，其他 `DBMS` 的寫法範例如下所示。

    - 專用語法：`SQL Server`
    ```SQL
    SELECT str1, SUBSTRING(str1, 3, 2) AS sub_str
    FROM SampleStr;
    ```

    - 專用語法：`Oracle`、`DB2`
    ```SQL
    SELECT str1, SUBSTR(str1, 3, 2) AS sub_str
    FROM SampleStr;
    ```
    :::

  - #### UPPER - 轉為大寫
    ::: warning 語法 6-9
    UPPER 函數
    ```SQL
    UPPER(字串);
    ```
    :::

    `UPPER` 也是只作用於英文字母的函數，能將參數所帶入的字串全部改為大寫，因此，英文字母以外的文字不會發生任何改變，而且原本即是大寫的字母也不會有變化。

    ::: warning 範例 6-12
    將小寫字母轉為大寫
    ```SQL
    SELECT str1, UPPER(str1) AS up_str
    FROM SampleStr
    WHERE str1 IN ('ABC', 'aBC', 'abc', '山田');
    ```

    執行結果
    | str1 | up_str |
    |------|--------|
    | abc  | ABC    |
    | 山田  | 山田   |
    | ABC  | ABC    |
    | aBC  | ABC    |
    :::

### 日期函數
  `SQL` 設定了許多可以用來處理日期資料的 `日期函數`，不過大部分的 `日期函數 `在各家 `DBMS` 上的實際用法仍然相當分歧，因為這樣的緣故，無法以較為統一的方式來說明。

  以下挑選「 標準 `SQL` 中有訂定，而且幾乎所有的 `DBMS` 都能使用 」的常用函數來介紹。

  - #### CURRENT_DATE - 今天的日期
    ::: warning 語法 6-10
    CURRENT_DATE 函數
    ```SQL
    CURRENT_DATE
    ```
    :::

    `CURRENT_DATE 函數` 會回傳此 `SQL` 執行時，也就是此函數執行時的當天日期，因為不必指定參數，所以不需要名稱後方的括號()。

    ::: warning 範例 6-13
    取得當天的日期

    - 專用語法：`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT CURRENT_DATE;
    ```

    執行結果
    | date       |
    |------------|
    | 2016-05-25 |
    :::

    另外，`SQL Server 無法使用此函數`，而 `Oracle` 和 `DB2` 上的語法有點不同

    ::: warning 專用語法：`SQL Server`
    若想在 `SQL Server` 取得當天的日期，需要像下面一樣利用 `CURRENT_TIMESTAMP 函數` 的功能。

    - 專用語法：`SQL Server`
    ```SQL
    -- 利用 CAST 將 CURRENT_TIMESTAMP 轉換成日期型別
    SELECT CAST(CURRENT_TIMESTAMP AS DATE) AS CUR_DATE;
    ```

    執行結果
    | CUR_DATE   |
    |------------|
    | 2016-05-25 |
    ::: 

    ::: warning 專用語法：`Oracle`、`DB2`
    `Oracle` 的語法必須以 `FORM 子句` 指定 `虛擬資料表 (DUAL)`，相對於此， `DB2` 的 `CURRENT` 和 `DATE` 這 2 個單字是以半形空白隔開，而且需要指定名為「 `SYSIBM.SYSDUMMY1` 」的虛擬資料表 (相當於 `Oracle` 的 `DUAL`)，請注意別搞混了。

    - 專用語法：`Oracle`
    ```SQL
    SELECT CURRENT_DATE
    FROM dual;
    ```

    - 專用語法：`DB2`
    ```SQL
    SELECT CURRENT DATE
    FROM SYSIBM.SYSDUMMY1;
    ```
    :::

  - #### CURRENT_TIME - 目前的時刻
    ::: warning 語法 6-11
    CURRENT_TIME 函數
    ```SQL
    CURRENT_TIME
    ```
    :::

    `CURRENT_TIME 函數` 會回傳此 `SQL` 執行時，也就是此函數執行時的時刻，一樣不必指定參數所以不需要括號()。

    ::: warning 範例 6-14
    取得目前的時刻

    - 專用語法：`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT CURRENT_TIME;
    ```

    執行結果
    | timetz          |
    |-----------------|
    | 17:26:50.995+09 |
    :::

    `SQL Server` 同樣無法使用此函數，而 `Oracle` 和 `DB2` 上的語法也稍有差異。

    ::: warning 專用語法：`SQL Server`
    如果想在 `SQL Server` 上想取得目前的時刻，需要像下面一樣利用 `CURRENT_TIMESTAMP 函數`。 

    - 專用語法：`SQL Server`
    ```SQL
    -- 利用 CAST 將 CURRENT_TIMESTAMP 轉換成時間型別
    SELECT CAST(CURRENT_TIMESTAMP AS TIME) AS CUR_TIME;
    ```

    執行結果
    | CUR_TIME         |
    |------------------|
    | 21:33:59.3400000 |
    ::: 

    ::: warning 專用語法：`Oracle`、`DB2`
    `Oracle` 和 `DB2` 必須使用下列的寫法，需要注意的地方和先前的 `CURRENT_DATE 函數` 相同，不過 `Oracle` 只能以包含日期的格式輸出結果。

    - 專用語法：`Oracle`
    ```SQL
    -- 指定虛擬資料表 (DUAL)
    SELECT CURRENT_TIMESTAMP
    FROM dual;
    ```

    - 專用語法：`DB2`
    ```SQL
    /* CURRENT 和 TIME 之間為半形空白，
       而且需要指定 SYSIBM.SYSDUMMY1 虛擬資料表 */
    SELECT CURRENT TIME
    FROM SYSIBM.SYSDUMMY1;
    ```
    :::

  - #### CURRENT_TIMESTAMP - 現在的日期和時刻
    ::: warning 語法 6-12
    CURRENT_TIMESTAMP 函數
    ```SQL
    CURRENT_TIMESTAMP
    ```
    :::

    `CURRENT_TIMESTAMP 函數` 相當於 `CURRENT_DATE` 加上 `CURRENT_TIME` 的功能，使用此函數可以一併取得現在的日期和時刻，而針對回傳的結果，也能單純擷取出日期或時刻的部分。

    ::: warning 範例 6-15
    取得現在的日期和時刻

    - 專用語法：`SQL Server`、`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT CURRENT_TIMESTAMP;
    ```

    執行結果
    | now                        |
    |----------------------------|
    | 2018-04-25 18:31:03.704+09 |
    :::

    此函數的優點在於包含 `SQL Server` 在內的主要 `DBMS` 都能使用，不過 `Oracle` 和 `DB2` 上的語法同樣有些差異。

    ::: warning 專用語法：`Oracle`、`DB2`
    - 專用語法：`Oracle`
    ```SQL
    -- 指定虛擬資料表 (DUAL)
    SELECT CURRENT_TIMESTAMP
    FROM dual;
    ```

    - 專用語法：`DB2`
    ```SQL
    /* CURRENT 和 TIMESTAMP 之間為半形空白，
       而且需要指定 SYSIBM.SYSDUMMY1 虛擬資料表 */
    SELECT CURRENT TIMESTAMP
    FROM SYSIBM.SYSDUMMY1;
    ```
    :::

  - #### EXTRACT - 擷取日期元素
    ::: warning 語法 6-13
    EXTRACT 函數
    ```SQL
    EXTRACT(日期元素 FROM 日期資料)
    ```
    :::
    
    `EXTRACT 函數` 能從完整的日期資料擷取出某個部分，不過，它的回傳值並非日期型別，而是 `數值型別`。

    ::: warning 範例 6-16
    擷取日期元素

    - 專用語法：`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT CURRENT_TIMESTAMP,
           EXTARACT(YEAR   FROM CURRENT_TIMESTAMP) AS year,
           EXTARACT(MONTH  FROM CURRENT_TIMESTAMP) AS month,
           EXTARACT(DAY    FROM CURRENT_TIMESTAMP) AS day,
           EXTARACT(HOUR   FROM CURRENT_TIMESTAMP) AS hour,
           EXTARACT(MINUTE FROM CURRENT_TIMESTAMP) AS minute,
           EXTARACT(SECOND FROM CURRENT_TIMESTAMP) AS second;
    ```

    執行結果
    | now                        | year | month | day | hour | minute | second |
    |----------------------------|-----:|------:|----:|-----:|-------:|-------:|
    | 2018-04-25 19:07:33.987+09 | 2018 |     5 |  25 |   19 |      7 | 33.987 |
    :::

    請注意，`SQL Server` 無法使用此函數。

    ::: warning 專用語法：`SQL Server`、`Oracle`、`DB2`
    如果想在 `SQL Server` 獲得相同結果，需要使用名為 `DATEPART` 的專有函數。

    - 專用語法：`SQL Server`
    ```SQL
    SELECT CURRENT_TIMESTAMP,
           DATEPART(YEAR   FROM CURRENT_TIMESTAMP) AS year,
           DATEPART(MONTH  FROM CURRENT_TIMESTAMP) AS month,
           DATEPART(DAY    FROM CURRENT_TIMESTAMP) AS day,
           DATEPART(HOUR   FROM CURRENT_TIMESTAMP) AS hour,
           DATEPART(MINUTE FROM CURRENT_TIMESTAMP) AS minute,
           DATEPART(SECOND FROM CURRENT_TIMESTAMP) AS second;
    ```

    - 專用語法：`Oracle`
    ```SQL
    -- 在 FROM 子句指定虛擬資料表 (DUAL)
    SELECT CURRENT_TIMESTAMP,
           EXTARACT(YEAR   FROM CURRENT_TIMESTAMP) AS year,
           EXTARACT(MONTH  FROM CURRENT_TIMESTAMP) AS month,
           EXTARACT(DAY    FROM CURRENT_TIMESTAMP) AS day,
           EXTARACT(HOUR   FROM CURRENT_TIMESTAMP) AS hour,
           EXTARACT(MINUTE FROM CURRENT_TIMESTAMP) AS minute,
           EXTARACT(SECOND FROM CURRENT_TIMESTAMP) AS second
    FROM DUAL;
    ```

    - 專用語法：`DB2`
    ```SQL
    /* CURRENT 和 TIMESTAMP 之間為半形空白，
       而且需要指定 SYSIBM.SYSDUMMY1 虛擬資料表 */
    SELECT CURRENT_TIMESTAMP,
           EXTARACT(YEAR   FROM CURRENT_TIMESTAMP) AS year,
           EXTARACT(MONTH  FROM CURRENT_TIMESTAMP) AS month,
           EXTARACT(DAY    FROM CURRENT_TIMESTAMP) AS day,
           EXTARACT(HOUR   FROM CURRENT_TIMESTAMP) AS hour,
           EXTARACT(MINUTE FROM CURRENT_TIMESTAMP) AS minute,
           EXTARACT(SECOND FROM CURRENT_TIMESTAMP) AS second
    FROM SYSIBM.SYSDUMMY1;
    ```
    ::: 

### 轉換函數
  「 `轉換` 」這個詞彙的意義相當多，不過在 `SQL` 中大致上有 2 種意思：
  1 個是 `資料型別的轉換`，一般簡稱為「 `型別轉換` 」或使用英文的「 `CAST` 」單字，另外 1 個則是 `內容值的轉換`。

  - #### CAST - 型別轉換
    ::: warning 語法 6-14
    CAST 函數
    ```SQL
    CAST(轉換前的值 AS 轉換後的型別)
    ```
    :::

    轉換型別可以透過名為 `CAST` 的函數來完成。
    
    想把不符合欄位型別的資料存入資料表、或執行某些運算的時候，如果資料型別不一致可能會導致錯誤發生、或是因為 `DBMS` 自動以隱含方式進行型別轉換而造成處理效能低落，遇到這類狀況時，就必須預先將資料轉換成適當的型別。

    ::: warning 範例 6-17
    從 字串型別 轉換成 數值型別

    - 專用語法：`SQL Server`、`PostgreSQL`
    ```SQL
    SELECT CAST('0001' AS INTEGER) AS int_col;
    ```

    - 專用語法：`MySQL`、`MariaDB`
    ```SQL
    SELECT CAST('0001' AS SIGNED INTEGER) AS int_col;
    ```
    
    - 專用語法：`Oracle`
    ```SQL
    SELECT CAST('0001' AS INTEGER) AS int_col
    FROM DUAL;
    ```
    
    - 專用語法：`DB2`
    ```SQL
    SELECT CAST('0001' AS INTEGER) AS int_col
    FROM SYSIBM.SYSDUMMY1;
    ```

    執行結果
    | int_col |
    |---------|
    | 1       |
    :::

    ::: warning 範例 6-18
    從 字串型別 轉換成 日期型別

    - 專用語法：`SQL Server`、`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT CAST('2009-12-14' AS DATE) AS date_col;
    ```
    
    - 專用語法：`Oracle`
    ```SQL
    SELECT CAST('2009-12-14' AS DATE) AS date_col
    FROM DUAL;
    ```
    
    - 專用語法：`DB2`
    ```SQL
    SELECT CAST('2009-12-14' AS DATE) AS date_col
    FROM SYSIBM.SYSDUMMY1;
    ```

    執行結果
    | date_col   |
    |------------|
    | 2009-12-14 |
    :::

  - #### COALESCE - 將 NULL 替換成特定值
    `COALESCE` 是 `SQL` 所特有的函數，它屬於參數個數可變的函數 (Variadic Function)，執行之後會從左邊開始回傳 1 個不是 `NULL` 的值，由於其參數個數可變，所以可以視需求填入多個參數。

    ::: warning 語法 6-15
    COALESCE 函數
    ```SQL
    COALESCE(資料1, 資料2, 資料3, ...)
    ```
    :::

    最常見的便是在 `SQL 敘述` 中，需要以其他的值取代 `NULL` 的狀況。

    ::: warning 範例 6-19
    將 NULL 替換成特定值

    - 專用語法：`SQL Server`、`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    SELECT COALESCE(NULL, 1) AS col_1,
           COALESCE(NULL, 'test', NULL) AS col_2,
           COALESCE(NULL, NULL, '2009-11-01') AS col_3;
    ```
    
    - 專用語法：`Oracle`
    ```SQL
    SELECT COALESCE(NULL, 1) AS col_1,
           COALESCE(NULL, 'test', NULL) AS col_2,
           COALESCE(NULL, NULL, '2009-11-01') AS col_3;
    FROM DUAL;
    ```
    
    - 專用語法：`DB2`
    ```SQL
    SELECT COALESCE(NULL, 1) AS col_1,
           COALESCE(NULL, 'test', NULL) AS col_2,
           COALESCE(NULL, NULL, '2009-11-01') AS col_3;
    FROM SYSIBM.SYSDUMMY1;
    ```

    執行結果
    | col_1 | col_2 |   col_3    |
    |:-----:|:-----:|:----------:|
    |   1   | test  | 2009-11-01 |
    :::

    ::: warning 範例 6-20
    篩選出 SampleStr 資料表 str2 欄位的資料

    ```SQL
    SELECT COALESCE(str2, '此為NULL'),
    FROM SampleStr;
    ```

    執行結果
    | coalesce |
    |----------|
    | 四五     |
    | def      |
    | 太郎     |
    | 此為NULL |
    | 甲乙丙   |
    | 此為NULL |
    | 此為NULL |
    | 此為NULL |
    | abc      |
    | abc      |
    | 必       |
    :::

## 6-2 述詞
  ::: info 學習重點
  - 述詞 是 回傳值為真偽值的函數。
  - 請熟練 `LIKE` 的 3 種使用方式 (起始一致、中間一致、結尾一致)。
  - 請注意 `BETWEEN` 需要指定 3 個參數。
  - 想篩選出 `NULL` 的資料時，必須使用 `IS NULL`。
  - `IN`、`EXISTS` 能將子查詢當作參數。
  :::

### 什麼是述詞
  `述詞 (Predicate)`，是具有特殊條件的函數，「 `回傳值為真偽值` 」。

  具體來說，會有下列述詞：
  - `LIKE`
  - `BETWEEN`
  - `IS NULL`、`IS NOT NULL`
  - `IN`
  - `EXISTS`

### LIKE 述詞 - 搜尋相同的字串
  `LIKE 述詞`，允許較為模糊的條件，可用於對字串進行 `部分一致搜尋` 的需求。

  `部分一致` 大致上可以分為 `起始一致`、`中間一致`、`結尾一致` 等 3 種類型。

  ::: warning 範例 6-21
  建立 SampleLike 資料表

  ```SQL
  -- DDL：建立資料表
  CREATE TABLE SampleLike
  ( strcol VARCHAR(6) NOT NULL,
    PRIMARY KEY (strcol));
  ```

  - 專用語法：`MySQL`、`MariaDB`
  ```SQL
  -- DML：存入資料
  START TRANSACTION;

  INSERT INTO SampleLike (strcol) VALUES ('abcddd');
  INSERT INTO SampleLike (strcol) VALUES ('dddabc');
  INSERT INTO SampleLike (strcol) VALUES ('abdddc');
  INSERT INTO SampleLike (strcol) VALUES ('abcdd');
  INSERT INTO SampleLike (strcol) VALUES ('ddabc');
  INSERT INTO SampleLike (strcol) VALUES ('abddc');

  COMMIT;
  ```
  :::

  ::: warning 專用語法
  各家 `DBMS` 交易功能的語法略有差異，如果在 `PostgreSQL` 或 `SQL Server` 執行 範例 6-1 的 `DML 敘述` 時，需要將「 `START TRANSACTION` 」改為「 `BEGIN TRANSACTION` 」，而在 `Oracle` 或 `DB2` 上執行的時候，不需要「 `START TRANSACTION` 」，直接刪除即可。
  :::

  - ##### `起始一致`：篩選出「 dddabc 」
    會針對搜尋條件的部分字串，僅篩選出搜尋對象欄位內容的開頭為此字串的紀錄。
    
  - ##### `中間一致`：篩選出「 abcddd 」、「 dddabc 」和「 abdddc 」
    會針對搜尋條件的部分字串，篩選出搜尋對象欄位內容的「 某個位置 」有此字串的紀錄，無論是位於起始、結尾或中間位置都會被篩選出來。

  - ##### `結尾一致`：篩選出「 abcddd 」
    會針對搜尋條件的部分字串，僅篩選出搜尋對象欄位內容的結尾為此字串的紀錄。

  這樣的搜尋方式並非以「 `=` 」來指定條件的字串，而是根據搜尋對象欄位所包含的規則進行搜尋，所以被稱為「 `模式一致 (Pattern Matching)` 」的方式，這裡的模式相當於「 `規則` 」的意思。

  - #### 執行「 起始一致 」搜尋
    ::: warning 範例 6-22
    以 LIKE 執行起始一致搜尋

    ```SQL
    SELECT *
    FROM SampleLike
    WHERE strcol LIKE 'ddd%';
    ```

    執行結果
    | strcol |
    |--------|
    | dddabc |
    :::

    「 `%` 」是代表「 0 個文字以上字串 」的特殊符號。

  - #### 「 中間一致 」搜尋
    ::: warning 範例 6-23
    以 LIKE 執行中間一致搜尋

    ```SQL
    SELECT *
    FROM SampleLike
    WHERE strcol LIKE '%ddd%';
    ```

    執行結果
    | strcol |
    |--------|
    | abcddd |
    | dddabc |
    | abdddc |
    :::

  - #### 「 結尾一致 」搜尋
    ::: warning 範例 6-24
    以 LIKE 執行結尾一致搜尋

    ```SQL
    SELECT *
    FROM SampleLike
    WHERE strcol LIKE '%ddd';
    ```

    執行結果
    | strcol |
    |--------|
    | abcddd |
    :::

    另外，除了「 `%` 」之外，`LIKE` 的條件句還能使用「 `_(底線)` 」符號，此符號代表「 `任意 1 個文字` 」的意思。

    ::: warning 範例 6-25
    以 LIKE 和 _(底線) 執行起始一致搜尋

    ```SQL
    SELECT *
    FROM SampleLike
    WHERE strcol LIKE 'abc__';    -- abc + 任意 2 個文字
    ```

    執行結果
    | strcol |
    |--------|
    | abcdd  |
    :::

    ::: warning 範例 6-26
    搜尋「 abc + 任意 3 個文字 」

    ```SQL
    SELECT *
    FROM SampleLike
    WHERE strcol LIKE 'abc___';    -- abc + 任意 3 個文字
    ```

    執行結果
    | strcol |
    |--------|
    | abcddd |
    :::

### BETWEEN - 範圍搜尋
  利用 `BETWEEN` 即可進行 `範圍搜尋`，這個述詞和其他述詞或函數有些不同，它需要使用到 3 個參數，也就是 `目標欄位名稱`、`起始值` 和 `結束值`。

  ::: warning 範例 6-27
  篩選出販售單價為 100 ~ 1000 元的商品

  ```SQL
  SELECT shohin_name, sell_price
  FROM Shohin
  WHERE sell_price BETWEEN 100 AND 1000;
  ```

  執行結果
  | shohin_name | sell_price |
  |-------------|------------|
  | T恤         | 1000       |
  | 打孔機       | 500        |
  | 叉子         | 500        |
  | 刨絲器       | 880        |
  | 鋼珠筆       | 100        |
  :::

  `BETWEEN` 有個需要注意的地方，那便是符合 100 和 1000 這 2 側數值的紀錄也會出現在結果中，假若想排除符合 2 側數值的紀錄，必須改用 `<` 和 `>` 來撰寫條件。

  ::: warning 範例 6-28
  篩選出販售單價為 101 ~ 999 元的商品

  ```SQL
  SELECT shohin_name, sell_price
  FROM Shohin
  WHERE sell_price > 100
    AND sell_price < 1000;
  ```

  執行結果
  | shohin_name | sell_price |
  |-------------|------------|
  | 打孔機       | 500        |
  | 叉子         | 500        |
  | 刨絲器       | 880        |
  :::

### IS NULL、IS NOT NULL - 判斷是否為 NULL
  想篩選出某個欄位為 `NULL` 的紀錄時，無法使用「 `=` 」來達成目的，必須改用 `IS NULL` 這個特殊的述詞。

  ::: warning 範例 6-29
  篩選出購入單價 (buying_price) 為 NULL 的商品
  ```SQL
  SELECT shohin_name, buying_price
  FROM Shohin
  WHERE buying_price IS NULL;
  ```

  執行結果
  | shohin_name | buying_price |
  |-------------|--------------|
  | 叉子         |              |
  | 鋼珠筆       |              |
  :::

  如果需要篩選出欄位為 `NULL` 以外的紀錄，則需要改用 `IS NOT NULL 述詞`。

  ::: warning 範例 6-30
  篩選出購入單價 (buying_price) 非 NULL 的商品
  ```SQL
  SELECT shohin_name, buying_price
  FROM Shohin
  WHERE buying_price IS NOT NULL;
  ```

  執行結果
  | shohin_name | buying_price |
  |-------------|-------------:|
  | T恤         |          500 |
  | 打孔機       |          320 |
  | 襯衫         |         2800 |
  | 菜刀         |         2800 |
  | 壓力鍋       |         5000 |
  | 刨絲器       |          790 |
  :::

### IN 述詞 - OR 的簡便形式
  ::: warning 範例 6-31
  以 OR 搜尋多個特定的購入單價
  ```SQL
  SELECT shohin_name, buying_price
  FROM Shohin
  WHERE buying_price =  320
        buying_price =  500
        buying_price = 5000;
  ```

  執行結果
  | shohin_name | buying_price |
  |-------------|-------------:|
  | T恤         |          500 |
  | 打孔機       |          320 |
  | 壓力鍋       |         5000 |
  :::

  這樣當然也能達成目的，不過此寫法有個缺點，當篩選條件的數量越來越多時，`SQL 敘述` 的長度也會隨之變長，增加未來閱讀理解上的負擔。可以改以「 `IN (值1, 值2, ...)` 」的形式寫成較為清爽的樣子。

  ::: warning 範例 6-32
  以 IN 指定多個特定的購入單價
  ```SQL
  SELECT shohin_name, buying_price
  FROM Shohin
  WHERE buying_price IN (320, 500, 5000);
  ```

  執行結果
  | shohin_name | buying_price |
  |-------------|-------------:|
  | T恤         |          500 |
  | 打孔機       |          320 |
  | 壓力鍋       |         5000 |
  :::

  相反地，假如想篩選出「 購入單價為 320 元、 500 元以及 5000 元以外 」的商品紀錄，需要使用否定形的 `NOT IN`。

  ::: warning 範例 6-33
  以 IN 指定多個特定的購入單價
  ```SQL
  SELECT shohin_name, buying_price
  FROM Shohin
  WHERE buying_price NOT IN (320, 500, 5000);
  ```

  執行結果
  | shohin_name | buying_price |
  |-------------|-------------:|
  | 襯衫         |         2800 |
  | 菜刀         |         2800 |
  | 刨絲器       |          790 |
  :::

  不過請特別注意，無論是使用 `IN` 或 `NOT IN`，`都無法篩選出該欄位為 NULL 的紀錄`，`NULL` 必須以 `IS NULL` 和 `IS NOT NULL` 來判斷。

### 指定子查詢作為 IN 述詞的參數
  `IN 述詞` (以及 `NOT IN 述詞`) 具有其他述詞所不具備的特殊使用方式，那便是指定 `子查詢` 作為其參數的使用方式。`IN 能指定資料表、檢視表作為其參數`。

  為了介紹其具體操作方式，這裡需要另外建立 1 個新的資料表。

  ::: warning 範例 6-34
  建立 StoreShohin (商品店鋪) 資料表的 CREATE TABLE 敘述
  ```SQL
  CREATE TABLE StoreShohin
  (store_id CHAR(4) NOT NULL,
  store_name VARCHAR(200) NOT NULL,
  shohin_id CHAR(4) NOT NULL,
  s_amount INTEGER NOT NULL,
  PRIMARY KEY (store_id, shohin_id));
  ```
  :::

  ::: warning 範例 6-35
  - 專用語法：`MySQL`、`MariaDB`
  ```SQL
  START TRANSACTION;

  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000A', '東京', '0001', 30);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000A', '東京', '0002', 50);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000A', '東京', '0003', 15);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000B', '名古屋', '0002', 30);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000B', '名古屋', '0003', 120);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000B', '名古屋', '0004', 20);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000B', '名古屋', '0006', 10);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000B', '名古屋', '0007', 40);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000C', '大阪', '0003', 20);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000C', '大阪', '0004', 50);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000C', '大阪', '0006', 90);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000C', '大阪', '0007', 70);
  INSERT INTO StoreShohin (store_id, store_name, shohin_id, s_amount) VALUES ('000D', '福岡', '0001', 100);

  COMMIT;
  ```

  執行結果
  | store_id | store_name | shohin_id | s_amount |
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

  此 `CREATE TABLE 敘述` 的特點在於指定了 2 個欄位作為主鍵 (Primary Key)，組合了兩個欄位避免重複。
  :::

  ::: warning 專用語法
  各家 `DBMS` 交易功能的語法略有差異，如果在 `PostgreSQL` 或 `SQL Server` 執行 範例 6-1 的 `DML 敘述` 時，需要將「 `START TRANSACTION` 」改為「 `BEGIN TRANSACTION` 」，而在 `Oracle` 或 `DB2` 上執行的時候，不需要「 `START TRANSACTION` 」，直接刪除即可。
  :::
  
  - #### IN 與 子查詢
    試著 列出大阪店 (`000C`) 現有的商品 (`shohin_id`) 以及各商品的販售單價 (`sell_price`)
    1. 從 `StoreShohin 資料表` 篩選出大阪店 (`store_id = '000C'`) 的現貨商品ID (`shohin_id`)。
    2. 針對 1. 所取得的商品ID (`shohin_id`)，從 `Shohin 資料表` 篩選出對應的販售單價 (`sell_price`)。

    ::: warning 範例 6-36
    在 IN 的參數位置使用子查詢
    ```SQL
    -- 列出「 大阪店現有的商品和販售單價 」
    SELECT shohin_name, sell_price
    FROM Shohin
    WHERE shohin_id IN (
      SELECT shohin_id
      FROM StoreShohin
      WHERE store_id = '000C'
    );
    ```

    執行結果
    | shohin_name | sell_price |
    |-------------|-----------:|
    | 叉子         |        500 |
    | 襯衫         |       4000 |
    | 菜刀         |       3000 |
    | 刨絲器       |        880 |

    子查詢會從內部開始執行，因此這段 SELECT 敘述一開始會先執行內部的子查詢
    :::

  - #### NOT IN 與 子查詢
    `NOT IN` 同樣可以使用子查詢當作參數，其語法和 `IN` 使用方式相同

    ::: warning 範例 6-37
    在 NOT IN 的參數位置使用子查詢
    ```SQL
    -- 列出「 東京店(000A)現有的商品(shohin_id)以外的販售單價(sell_price) 」
    SELECT shohin_name, sell_price
    FROM Shohin
    WHERE shohin_id NOT IN (
      SELECT shohin_id
      FROM StoreShohin
      WHERE store_id = '000A'
    );
    ```

    執行結果
    | shohin_name | sell_price |
    |-------------|-----------:|
    | 菜刀         |       3000 |
    | 壓力鍋       |       6800 |
    | 叉子         |        500 |
    | 刨絲器       |        880 |
    | 鋼珠筆       |        100 |

    子查詢會從內部開始執行，因此這段 SELECT 敘述一開始會先執行內部的子查詢
    :::

### EXISTS 述詞
  雖然有時候還是必須使用到 `EXISTS 述詞`，不過許多狀況下都可以改用 `IN 述詞` 來取代。

  - #### EXISTS 述詞的使用方式
    「 查詢 "符合某些條件的紀錄是否存在" 」，當這樣的紀錄存在的時候回傳 `真(TRUE)`，不存在的時候則回傳 `偽(FALSE)`，而 `EXISTS (存在)` 這個述詞針對的主詞即為「 紀錄 」。

    ::: warning 範例 6-38
    以 EXISTS 列出「 大阪店內商品的販售單價 」

    - 專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`、`MariaDB`
    ```SQL
    -- 列出「 大阪店現有的商品和販售單價 」
    SELECT shohin_name, sell_price
    FROM Shohin AS S
    WHERE EXISTS (
      SELECT *
      FROM StoreShohin AS SS
      WHERE SS.store_id = '000C' AND SS.shohin_id = S.shohin_id
    );
    ```

    執行結果
    | shohin_name | sell_price |
    |-------------|-----------:|
    | 叉子         |        500 |
    | 襯衫         |       4000 |
    | 菜刀         |       3000 |
    | 刨絲器       |        880 |
    :::

    ::: warning 專用語法：`Oracle`
    `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 6-38 敘述的時候，
    請將「 `FROM Shohin AS S` 」部分改為「 `FROM Shohin S` 」，
    將「 `FROM StoreShohin AS SS` 」部分改為「 `FROM StoreShohin SS` 」(刪除 FROM 子句中的 AS)。
    :::

  - #### EXISTS 的參數
    `EXISTS` 是僅需要 1 個參數的述詞。

    `EXISTS` 只會在其右側寫上 1 個參數，而且此參數大多為子查詢。
    如：
    ```SQL
    (
      SELECT *
      FROM StoreShohin AS SS
      WHERE SS.store_id = '000C' AND SS.shohin_id = S.shohin_id
    )
    ```

    當中的「 `SS.shohin_id = S.shohin_id` 」，用來連結 `Shohin 資料表` 和 `StoreShohin 資料表`，此參數為 `關聯子查詢`。

    ::: tip 牢記的原則 6-1
    EXISTS 的參數位置通常會指定 `關聯子查詢`。
    :::

  - #### 子查詢內的「 SELECT * 」
    如同先前的說明，由於 `EXISTS` 的作用，僅在於確認紀錄是否存在，而子查詢回傳了什麼欄位則完全沒有差別。 `EXISTS 述詞`，會針對子查詢內 WHERE 子句所指定的條件，確認紀錄是否存在，如果存在便回傳 `真(TRUE)`。

    對於 `EXISTS` 的子查詢內使用「 `SELECT *` 」的寫法，請把這當成 `SQL` 的 1 種慣用做法。

    ::: tip 牢記的原則 6-2
    EXISTS 參數位置的子查詢通常會使用「 `SELECT *` 」。
    :::

  - #### 將 NOT IN 改寫為 NOT EXISTS
    ::: warning 範例 6-40
    以 NOT EXISTS 列出「 東京店現有商品以外的販售單價 」
    ```SQL
    SELECT shohin_name, sell_price
    FROM Shohin AS S
    WHERE NOT EXISTS (
      SELECT *
      FROM StoreShohin AS TS
      WHERE TS.store_id = '000A' AND TS.shohin_id = S.shohin_id
    );
    ```

    執行結果
    | shohin_name | sell_price |
    |-------------|-----------:|
    | 菜刀         |       3000 |
    | 壓力鍋       |       6800 |
    | 叉子         |        500 |
    | 刨絲器       |        880 |
    | 鋼珠筆       |        100 |

    子查詢會從內部開始執行，因此這段 SELECT 敘述一開始會先執行內部的子查詢
    :::

    ::: warning 專用語法：`Oracle`
    `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 6-40 敘述的時候，
    請將「 `FROM Shohin AS S` 」部分改為「 `FROM Shohin S` 」，
    將「 `FROM StoreShohin AS TS` 」部分改為「 `FROM StoreShohin TS` 」(刪除 FROM 子句中的 AS)。
    :::

## 6-3 CASE 運算式
  ::: info 學習重點
  - `CASE 運算式` 可分為「 `簡單 CASE 運算式` 」和「 `搜尋 CASE 運算式` 」等 2 種類型，`搜尋 CASE 運算式` 包含了 `簡單 CASE 運算式` 的所有功能。
  - 雖然 `CASE 運算式` 的 `ELSE 子句` 可以省略，不過為了讓 `SQL 敘述` 比較容易閱讀，建議不要省略。
  - `CASE 運算式` 的 `END` 不能省略。
  - 使用 `CASE 運算式` 便能有彈性地重組 `SELECT 敘述` 的結果。
  - 例如：`Oracle` 的 `DECODE`、`MySQL` 的 `IF` 等，有些 `DBMS` 提供了 `CASE 運算式` 簡化後的專有函數，不過這些語法不具通用性，而且功能上也有些限制，建議避免使用。
  :::

### 什麼是 CASE 運算式
  `CASE 運算式` 如同 CASE (狀況、事例) 的名稱所示，可用來撰寫「 `視狀況執行不同動作` 」的敘述，而這樣執行不同動作的機制，在程式語言中一般稱為「 `條件句` 」。

### CASE 運算式的語法
  CASE 運算式的語法可分為「 `簡單 CASE 運算式` (Simple CASE Expression) 」和「 `搜尋 CASE 運算式` (Searched CASE Expression) 」。

  `搜尋 CASE 運算式` 含括了 `簡單 CASE 運算式` 的所有功能。

  ::: warning 語法 6-16
  搜尋 CASE 運算式
  ```SQL
  CASE WHEN <判斷式1> THEN <回應結果1>
       WHEN <判斷式2> THEN <回應結果2>
       WHEN <判斷式3> THEN <回應結果3>
       ...
       ELSE <回應結果>
  END
  ```
  :::

  `WHEN 子句` 的 <判斷式> 部分通常採用「 `欄位 = 值` 」之類的形式，執行後會回傳真偽值(`TRUE` / `FALSE` / `UNKNOWN`)，只要把它理解成是使用 `=` 、 `!=` 、 `LIKE` 或 `BETWEEN` 等述詞所寫成的式子即可。

  `CASE 運算式` 的機制，最初會從判斷 `WHEN 子句` 的 `<判斷式>` 開始，而所謂的「 `判斷` 」便是確認該判斷式真偽值的動作，假如結果為 `真(TRUE)`，便會回傳後方 `THEN 子句` 的 `<回應結果>` 部分所指定的特定值、欄位內容或運算式的執行結果。

  運算式 最終結果只會獲得 1 個值。

### CASE 運算式的使用方式
  ::: warning 範例 6-41
  以 CASE 運算式替商品分類分別加上 A ~ C 的字串
  ```SQL
  SELECT shohin_name,
         CASE WHEN shohin_catalg = '衣物' THEN 'A:' || shohin_catalg
              WHEN shohin_catalg = '辦公用品' THEN 'B:' || shohin_catalg
              WHEN shohin_catalg = '廚房用品' THEN 'C:' || shohin_catalg
              ELSE NULL
         END AS abc_shohin_catalg
  FROM Shohin;
  ```

  執行結果
  | shohin_name | abc_shohin_catalg |
  |-------------|-------------------|
  | T恤         | A:衣物             |
  | 打孔機       | B:辦公用品         |
  | 襯衫         | A:衣物            |
  | 菜刀         | C:廚房用品         |
  | 壓力鍋       | C:廚房用品         |
  | 叉子         | C:廚房用品         |
  | 刨絲器       | C:廚房用品         |
  | 鋼珠筆       | B:辦公用品         |
  :::

  語法的規則上可以省略撰寫 `ELSE 子句` 的部分，而沒有 `ELSE 子句` 的寫法會被自動當作「 `ELSE NULL` 」來處理，不過為了避免之後查閱的時候發生漏看的狀況，建議以明示的方式寫上 `ELSE 子句`。

  ::: tip 牢記的原則 6-3
  `CASE 運算式` 雖然可以省略 `ELSE 子句`，不過建議不要省略。
  :::

  ::: tip 牢記的原則 6-4
  `CASE 運算式` 不能省略最後的 `END`。
  :::

  - #### CASE 運算式可寫入的位置
    所有可以寫入運算式的地方，都可以寫入 `CASE 運算式`。

    ::: warning 範例 6-42
    一般使用 GROUP BY 無法做到縱橫轉換
    ```SQL
    SELECT shohin_catalg,
          SUM(sell_price) AS sum_price
    FROM Shohin
    GROUP BY shohin_catalg;
    ```

    執行結果
    | shohin_catalg | sum_price |
    |---------------|----------:|
    | 衣物           |      5000 |
    | 辦公用品        |       600 |
    | 廚房用品        |     11180 |
    :::

    如果想讓各分類單價總和以「 `欄位` 」的形式，也就是橫向排列的方式呈現，必須改用 `CASE 運算式`，以便獲得 3 個欄位的結果。

    ::: warning 範例 6-43
    使用 CASE 運算式達成縱橫轉換
    ```SQL
    -- 將各商品分類的販售單價總和結果進行縱橫轉換
    SELECT SUM(CASE WHEN shohin_catalg = '衣物' THEN sell_price ELSE 0 END) AS sum_price_cloth,
           SUM(CASE WHEN shohin_catalg = '廚房用品' THEN sell_price ELSE 0 END) AS sum_price_kitchen,
           SUM(CASE WHEN shohin_catalg = '辦公用品' THEN sell_price ELSE 0 END) AS sum_price_office,
    FROM Shohin;
    ```

    執行結果
    | sum_price_cloth | sum_price_kitchen | sum_price_office |
    |----------------:|------------------:|-----------------:|
    |            5000 |             11180 |              600 |

    各段 `CASE 運算式` 的作用，在於當 `商品分類 (shohin_catalg)` 符合「衣物」、「廚房用品」或「辦公用品」等特定字串時，便輸出 (回傳) 該商品的 `販售單價 (sell_price)`，而遇到不符合的商品則輸出 (回傳) `0` 的數值，最後所有輸出結果經過 `SUM 函數` 計算之後，便可獲得特定商品分類的販售單價總和。
    :::

    > ### COLUMN 簡單 CASE 運算式
    > `簡單 CASE 運算式` 和 `搜尋 CASE 運算式` 相較之下，具有寫法較為簡潔的優點，不過相對地也產生條件在撰寫上較不自由的缺點，所以基本上只要學會搜尋 `CASE 運算式` 即可。
    >
    > ::: warning 語法 6-A
    > 簡單運算式
    > ```SQL
    > CASE <判斷對象>
    >  WHEN <對象狀況1> THEN <回應結果1>
    >  WHEN <對象狀況2> THEN <回應結果2>
    >  WHEN <對象狀況3> THEN <回應結果3>
    >  ...
    >  ELSE <回應結果>
    > END
    > ```
    > :::
    > 
    > 不同之處僅在於第 1 行的「 `CASE <判斷對象>` 」已經決定了判斷的對象。
    > 
    > ::: warning 範例 6-A
    > 以 CASE 運算式替商品分類分別加上 A ~ C 的字串
    > ```SQL
    > -- 搜尋 CASE 運算式的寫法
    > SELECT shohin_name,
    >       CASE WHEN shohin_catalg = '衣物' THEN 'A:' || shohin_catalg
    >             WHEN shohin_catalg = '辦公用品' THEN 'B:' || shohin_catalg
    >             WHEN shohin_catalg = '廚房用品' THEN 'C:' || shohin_catalg
    >             ELSE NULL
    >       END AS abc_shohin_catalg
    > FROM Shohin;
    >
    > -- 簡單 CASE 運算式的寫法
    > SELECT shohin_name,
    >       CASE shohin_catalg
    >           WHEN '衣物' THEN 'A:' || shohin_catalg
    >           WHEN '辦公用品' THEN 'B:' || shohin_catalg
    >           WHEN '廚房用品' THEN 'C:' || shohin_catalg
    >           ELSE NULL
    >       END AS abc_shohin_catalg
    > FROM Shohin;
    > ```

    > ### COLUMN CASE 運算式的專用語法
    > 由於 CASE 運算式是標準 SQL 所認可的功能，所以不論在哪個 DBMS 都能正常執行，不過有些 DBMS 另外準備了 CASE 運算式經過簡化的專有函數，例如 Oracle 的 DECODE、或是 MySQL 和 MariaDB 的 IF 等。
    > 
    > ::: warning 範例 6-B
    > 使用 CASE 運算式的專用語法，替商品分類分別加上 A ~ C 的字串
    > 
    > - 專用語法：`Oracle`
    > ```SQL
    > -- 以 Oracle 的 DECODE 取代 CASE 運算式
    > SELECT shohin_name,
    >       DECODE(shohin_catalg, '衣物', 'A:' || shohin_catalg,
    >                             '辦公用品', 'B:' || shohin_catalg,
    >                             '廚房用品', 'C:' || shohin_catalg,
    >               NULL) AS abc_shohin_catalg
    > FROM Shohin;
    > ```
    > 
    > - 專用語法：`MySQL`、`MariaDB`
    > ```SQL
    > -- 以 MySQL 的 IF 取代 CASE 運算式
    > SELECT shohin_name,
    >     IF( IF( IF(shohin_catalg = '衣物',
    >                 CONCAT('A:', shohin_catalg), NULL)
    >                 IS NULL AND shohin_catalg = '辦公用品',
    >                 CONCAT('B:', shohin_catalg),
    >         
    >             IF(shohin_catalg = '衣物',
    >                 CONCAT('A:', shohin_catalg), NULL)
    >                 IS NULL AND shohin_catalg = '廚房用品',
    >                 CONCAT('C:', shohin_catalg),
    >         
    >             IF(shohin_catalg = '衣物',
    >                 CONCAT('A:', shohin_catalg), NULL)
    >                 IS NULL AND shohin_catalg = '辦公用品',
    >                 CONCAT('B:', shohin_catalg),
    >         
    >             IF(shohin_catalg = '衣物',
    >                 CONCAT('A:', shohin_catalg),
    >     NULL))) AS abc_shohin_catalg
    > FROM Shohin;
    > ```
    > :::
    > 
    > 不過這些函數只能在特定的 DBMS 上使用，而且能表達的條件也比 CASE 運算式來得少，沒有什麼實用上的價> 值，建議避免使用這樣的專用語法。

## 自我練習
  - 6.1 如果對章節內容所使用過的 Shohin (商品) 資料表，執行下列 2 段 SELECT 敘述，會分別獲得什麼樣的結果呢？
    - 1.
      ```SQL
      SELECT shohin_name, buying_price
      FROM Shohin
      WHERE buying_price NOT IN (500, 2800, 5000);
      ```

      ::: details 練習
      | shohin_name | buying_price |
      |-------------|-------------:|
      | 打孔機       |          320 |
      | 刨絲器       |          790 |
      :::

    - 2.
      ```SQL
      SELECT shohin_name, buying_price
      FROM Shohin
      WHERE buying_price NOT IN (500, 2800, 5000, NULL);
      ```

      ::: details 練習
      | shohin_name | buying_price |
      |-------------|-------------:|
      :::

  - 6.2 對於問題 6.1 所提及的 Shohin(商品) 資料表，請根據各項商品販售單價 (sell_price) 的金額，按照下列條件將商品做分類。
    - 低價商品：販售單價低於 1000 (T恤、打孔機、叉子、刨絲器、鋼珠筆)。
    - 中價商品：販售單價高於 1001、低於 3000 (菜刀)。
    - 低價商品：販售單價高於 3001 (襯衫、壓力鍋)。

    然後撰寫 SELECT 敘述，列出各價格範圍分別有幾項商品，其結果的樣貌如下所示。

    | low_price | mid_price | high_price |
    |-----------|-----------|------------|
    | 5         | 1         | 2          |

    ::: details 練習
    ```SQL
    SELECT SUM(CASE WHEN sell_price <= 1000 THEN 1 ELSE 0 END) AS low_price,
	       SUM(CASE WHEN sell_price > 1000 AND sell_price <= 3000 THEN 1 ELSE 0 END) AS mid_price,
           SUM(CASE WHEN sell_price > 3000 THEN 1 ELSE 0 END) AS high_price
    FROM Shohin
    ```
    或
    ```SQL
    -- CASE 不寫 ELSE 時，預設回傳 NULL，COUNT 不計算 NULL
    SELECT COUNT(CASE WHEN sell_price <= 1000 THEN sell_price END) AS low_price,
	       COUNT(CASE WHEN sell_price > 1000 AND sell_price <= 3000 THEN sell_price END) AS mid_price,
           COUNT(CASE WHEN sell_price > 3000 THEN sell_price END) AS high_price
    FROM Shohin
    ```
    :::