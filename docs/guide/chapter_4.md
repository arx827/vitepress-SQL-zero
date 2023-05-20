---
title: 第 4 章 更新資料
---

# 第 4 章 更新資料

## 4-1 新增資料 (INSERT)
  ::: info 學習重點
  - 想在資料表中新增資料 (紀錄) 需要使用 `INSERT` 敘述，原則上，每執行 1 次 `INSERT` 敘述可新增 1 筆紀錄。
  - 將多個欄位名稱或內容值以逗號隔開、前後加上括號圍起來，這樣的形式稱為「 `串列 (List)` 」。
  - 對資料表所有欄位執行 `INSERT` 的時候，資料表名稱後方的欄位串列可以省略。
  - 若想存入 `NULL`，可在 `VALUES 子句` 的內容值串列中直接寫入 `NULL`。
  - 資料表的欄位可以設定預設值 (初始值)，而想設定預設值時，需要在 `CREATE TABLE 敘述` 中，對欄位加上 `DEFAULT` 條件約束。
  - 想存入預設值成為內容值時，可以採用在 `INSERT 敘述` 的 `VALUES 子句` 中，寫入 `DEFAULT` 關鍵字 (明示方法)、或省略欄位名稱和內容值串列 (默認方法) 等 2 種方式。
  - 從其他資料表複製資料時，可使用 `INSERT...SELECT 敘述`。
  :::

### 什麼是 INSERT
  用來存入資料的 SQL 便是 `INSERT` (插入) 敘述，作用是將紀錄插入資料表中。
  
  ::: warning 範例 4-1
  建立 ShohinIns 資料表的 `CREATE TABLE` 敘述
  ```SQL
  CREATE TABLE ShohinIns
  (shohin_id     CHAR(4)      NOT NULL,
    shohin_name   VARCHAR(100) NOT NULL,
    shohin_catalg VARCHAR(32)  NOT NULL,
    sell_price    INTEGER      DEFAULT 0,
    buying_price  INTEGER      ,
    reg_date      DATE         ,
    PRIMARY KEY (shohin_id));
  ```
  :::

### INSERT 敘述的基本語法
  ::: warning 語法 4-1
  INSERT 敘述
  ```SQL
  INSERT INTO <資料表名稱> (<欄位名稱1>, <欄位名稱2>, ...)
  VALUES (內容值1, 內容值2, ...)
  ```
  :::

  ::: warning 範例 4-2
  在資料表中新增 1 筆紀錄資料
  ```SQL
  INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
  VALUES ('0001', 'T恤', '衣物', 1000, 500, '2009-09-20')
  ```
  :::

  將多個欄位名稱或內容值以逗號隔開，前後加上括號圍起來，這樣的形式就稱為 `串列 (List)`。
  - A. `欄位串列`： `(shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)`
  - B. `內容值串列`： `('0001', 'T恤', '衣物', 1000, 500, '2009-09-20')`

  資料表後方的 `欄位串列`、和 `VALUES子句` 後方的 `內容串列`，其中列出的項目數量必須一致。

  ::: danger
  ```SQL
  -- VALUES 子句的內容值串列少了 1 個欄位！
  INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
  VALUES ('0001', 'T恤', '衣物', 1000, 500)
  ```
  :::

  每執行 1 次 `INSERT 敘述`，基本上只會新增 1 筆紀錄，想要新增多筆紀錄的時候，原則上必須按照紀錄筆數多次執行 `INSERT 敘述`。

  ::: tip 牢記的原則 7-2
  使用集合運算子想列出重複的紀錄時，請加上 `ALL 選項`。
  :::

  > ### COLUMN - INSERT 多筆紀錄
  雖然大部分的情況，「 每執行 1 次 `INSERT 敘述`，只會新增 1 筆紀錄 」，不過並不是絕對的原則。以實際的狀況來說，很多 `DBMS` 都能做到 1 次 `INSERT` 多筆紀錄，而這樣的功能就稱為「 `多行 INSERT (multi row INSERT)` 」。

  在 `VALUES 子句` 中，寫入多段以 `逗號` 區隔開來的內容值串列。

  ::: warning 範例 4-A
  一般的 INSERT 與 多行 INSERT
  ```SQL
  -- 一般的 INSERT
  INSERT INTO ShohinIns VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11');
  INSERT INTO ShohinIns VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL);
  INSERT INTO ShohinIns VALUES ('0004', '菜刀', '廚房用品', 3000, 2800, '2009-09-20');

  -- 多行的 INSERT (Oracle 除外)
  INSERT INTO ShohinIns VALUES
  ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11'),
  ('0003', '襯衫', '衣物', 4000, 2800, NULL),
  ('0004', '菜刀', '廚房用品', 3000, 2800, '2009-09-20');
  ```
  :::

  不過使用上有些需要注意的事項：
  - `INSERT 敘述` 輸入時出錯、甚至導致存入錯誤資料的狀況。當然有時候 `DBMS` 會擋下錯誤的 `SQL 敘述`，不過想要找出 `多行 INSERT` 哪裡有誤，會比一般單筆紀錄的 `INSERT 敘述` 更加辛苦。
  - 此語法無法在所有的 `DBMS` 上正常執行。上述的 `多行 INSERT` 語法，僅適用於 `DB2`、`SQL Server`、`PostgreSQL`、`MySQL`和`MariaDB` 等資料庫，而 `Oracle` 不接受此語法。

  ::: warning 專用語法：`Oracle`
  `Oracle` 必須改用下面看起來有點奇怪的語法。
  ```SQL
  -- Oracle 上的多行 INSERT
  INSERT ALL INTO ShohinIns VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11')
  INSERT ShohinIns VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL)
  INSERT ShohinIns VALUES ('0004', '菜刀', '廚房用品', 3000, 2800, '2009-09-20')
  SELECT * FROM DUAL;
  ```

  `DUAL` 是 `Oracle` 特有的 1 種 `虛擬資料表 (Dummy Table)`，安裝後會自動產生，而最後一行 「 `SELECT * FROM DUAL` 」的部分引用此虛擬資料表，不具實質的意義。
  :::

### 省略欄位串列
  如果是對資料表的所有欄位執行 `INSERT` 動作，那麼便可省略資料表名稱後方的欄位名稱串列， `VALUES 子句` 所列舉的各個內容值，會從左邊第 1 個欄位依序存入資料表成為 1 筆紀錄。
  
  ::: warning 範例 4-3
  省略欄位串列
  ```SQL
  -- 有欄位串列
  INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
  VALUES ('0005', '壓力鍋', '廚房用品', 6800, 5000, '2009-01-15')

  -- 無欄位串列
  INSERT INTO ShohinIns VALUES ('0005', '壓力鍋', '廚房用品', 6800, 5000, '2009-01-15')
  ```
  :::

### 存入 NULL
  想要以 `SELECT 敘述` 讓 1 筆紀錄的某個欄位為 `NULL` 的時候，可以在 `VALUES 子句` 內容值串列的相對位置直接寫入「 `NULL` 」。

  ::: warning 範例 4-4
  在 `buying_price` 欄位存入 NULL
  ```SQL
  -- 有欄位串列
  INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
  VALUES ('0006', '叉子', '廚房用品', 500, NULL, '2009-09-20')
  ```
  :::

  請注意，能存入 `NULL` 的欄位，當然僅限於沒有加上 `NOT NULL` 條件約束的欄位，如果對加上 `NOT NULL` 條件約束的欄位存入 `NULL`，`INSERT 敘述` 將會發生錯誤，造成插入資料的動作失敗。

  不只是 `INSERT`，還有 `DELETE` 和 `UPDATE` 等更新資料用的 `SQL 敘述`，執行失敗的時候都不會對資料表中既有的資料造成任何影響。

### 存入預設值
  資料表的欄位可以設定 `預設值 (初始值)`，若想對欄位設定 預設值，需要在建立資料表的 `CREATE TABLE 敘述` 中，對該欄位加上 `DEFAULT 條件` 約束。

  使用「 `DEFAULT <預設值>` 」的形式，即可指定欄位的預設值。

  ::: warning 範例 4-5
  ```SQL
  CREATE TABLE ShohinIns
  (shohin_id     CHAR(4)      NOT NULL,
    (略)
    sell_price    INTEGER      DEFAULT 0, -- 設定販售單價的預設值為 0
    (略)
    PRIMARY KEY (shohin_id));
  ```
  :::

  之後以 `INSERT 敘述` 新增紀錄的時候，就能引用預設值作為欄位的內容值，而引用的做法可分為「 `明示方法` 」和「 `默認方法` 」等 2 種方式。

  - #### 以 `明示方法` 存入預設值
    此方法需要在 `VALUES 子句` 中寫入 `DEFAULT 關鍵字`。

    ::: warning 範例 4-6
    以 `明示方法` 存入預設值
    ```SQL
    INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
    VALUES ('0007', '刨絲器', '廚房用品', DEFAULT, 790, '2008-04-28')
    ```

    執行上面的敘述，`RDBMS` 便會自動使用該欄位的預設值取代 `DEFAULT` 的部分，在資料表中新增 1 筆紀錄。
    :::

  - #### 以 `默認方法` 存入預設值
    其實不使用 `DEFAULT` 關鍵字也能對欄位存入預設值。如果想讓欄位存入預設值，只要從 `欄位串列` 和 `內容值串列` 中，省略該欄位名稱和內容值的部分即可。

    ::: warning 範例 4-7
    以 `默認方法` 存入預設值
    ```SQL
    INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, buying_price, reg_date)
    VALUES ('0007', '刨絲器', '廚房用品', 790, '2008-04-28')
    ```

    此種方式同樣會在 `sell_price` 欄位中存入預設值 0。
    :::

    推薦使用「 `明示方法` 」，因為這樣可以讓人一眼就能看出 `sell_price` 欄位被指定存入預設值，成為比較容易閱讀的 `SQL 敘述`。

    另外，對於省略欄位名稱的方式，如果被省略掉的欄位沒有設定預設值，那麼執行後將會存入 `NULL`，若是這個欄位還具有 `NOT NULL` 的條件約束，將會導致 `INSERT 敘述` 發生錯誤。

    ::: warning 範例 4-8
    沒有設定預設值的狀況
    ```SQL
    -- 省略無條件約束的 `buying_price` 欄位：存入「 NULL 」
    INSERT INTO ShohinIns (shohin_id, shohin_name, shohin_catalg, sell_price, reg_date)
    VALUES ('0008', '鋼珠筆', '辦公用品', 100, '2009-11-11')
    ```
    :::

    ::: danger 範例 4-8
    沒有設定預設值的狀況
    ```SQL
    -- 省略有 `NOT NULL` 條件約束的 `shohin_name` 欄位：將發生錯誤！
    INSERT INTO ShohinIns (shohin_id, shohin_catalg, sell_price, buying_price, reg_date)
    VALUES ('0009', '辦公用品', 1000, 500, '2009-12-12')
    ```
    :::

    ::: tip 牢記的原則 4-2
    省略 `INSERT 敘述` 中的欄位名稱，將會對該欄位存入預設值，如果沒有設定預設值則改存入 `NULL`。
    :::

### 從其他資料表複製資料
  想要在資料表中新增紀錄，除了以 `VALUES 子句` 具體指定存入的資料之外，還有「 `從其他資料表篩選資料存入` 」的方式。

  ::: warning 範例 4-9
  建立 ShohinCopy 資料表的 `CREATE TABLE` 敘述
  ```SQL
  CREATE TABLE ShohinCopy
  (shohin_id     CHAR(4)      NOT NULL,
    shohin_name   VARCHAR(100) NOT NULL,
    shohin_catalg VARCHAR(32)  NOT NULL,
    sell_price    INTEGER      ,
    buying_price  INTEGER      ,
    reg_date      DATE         ,
    PRIMARY KEY (shohin_id));
  ```
  :::

  ::: warning 範例 4-10
  `INSERT...SELECT 敘述`
  ```SQL
  -- 將商品資料表的資料「 複製 」至 ShohinCopy 資料表
  INSERT INTO ShohinCopy (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
  SELECT shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date
    FROM Shohin;
  ```

  假如作為資料來源的 `Shohin` 資料表當中儲存著 8 筆紀錄，此 `INSERT...SELECT 敘述` 執行之後， `ShohinCopy` 資料表中便會新增完全相同的 8 筆紀錄，而且 `Shohin` 資料表中的資料不會有任何變化。所以也適合用於資料的備份工作。
  :::

  #### SELECT 敘述部分的變化用法
  此 `INSERT 敘述` 內的 `SELECT 敘述` 部分，可以加上 `WHERE 子句` 或 `GROUP BY 子句` 等子句，但是加上 `ORDER BY 子句` 將不具有任何意義，因為資料表內部的各筆紀錄並沒有一定的順序。

  ::: warning 範例 4-11
  建立 ShohinCatalg 資料表的 `CREATE TABLE` 敘述
  ```SQL
  -- 存放個商品分類價格總計的資料表
  CREATE TABLE ShohinCatalg
  (shohin_catalg VARCHAR(32)  NOT NULL,
    sum_sell_price    INTEGER      ,
    sum_buying_price  INTEGER      ,
    PRIMARY KEY (shohin_catalg));
  ```
  :::

  ::: warning 範例 4-12
  彙總其他資料表的資料再行新增的 `INSERT...SELECT 敘述`
  ```SQL
  INSERT INTO ShohinCatalg (shohin_catalg, sum_sell_price, sum_buying_price)
  SELECT shohin_catalg, SUM(sell_price), SUM(buying_price)
    FROM Shohin
    GROUP BY shohin_catalg;
  ```
  :::

  ::: tip 牢記的原則 4-3
  `INSERT...SELECT 敘述` 內的 `SELECT 敘述` 部分，可以使用 `WHERE 子句` 和 `GROUP BY 子句` 等語法，不過 `ORDER BY 子句` 無法發揮作用。
  :::

## 4-2 刪除資料 (DELETE)
  ::: info 學習重點
  - 將整個資料表完全刪除需要使用 `DROP TABLE 敘述`，而想留下資料表本身結構、僅刪除所有紀錄時，則應該使用 `DELETE 敘述`。
  - 想刪除部分的紀錄時，可使用 `WHERE 子句` 指定刪除對象的條件。而加上 `WHERE 子句` 限制刪除對象紀錄的 `DELETE 敘述` 稱為「 `搜尋式 DELETE` 」。
  :::

### DROP TABLE 敘述與 DELETE 敘述
  刪除資料的方法大致上可分為 2 類。
  1. 透過 `DROP TABLE 敘述` 將整個資料表刪除。
  2. 透過 `DELETE 敘述`，保留資料表這個儲存用的容器、結構，僅刪除其中的所有資料紀錄。

  由於 `DROP TABLE 敘述` 會將整個資料表完全刪除，之後若想再將資料新增至相同的資料表，必須以 `CREATE TABLE` 重新建立此資料表。

  `DELETE 敘述` 只能刪除資料表中的資料(紀錄)，不會影響到資料表本身的結構，所以之後只要使用 `INSERT 敘述` 便能再度新增資料。

### DELETE 敘述的基本語法
  ::: warning 語法 4-2
  保留資料表，刪除所有紀錄的 DELETE 敘述
  ```SQL
  DELETE FROM <資料表名稱>;
  ```
  :::

  ::: warning 範例 4-13
  清空 Shohin 資料表
  ```SQL
  DELETE FROM Shohin;
  ```
  :::

  1. 若不小心漏掉 `FROM` 而寫成「 `DELETE <資料表名稱>` 」、
  2. 或加上多餘的欄位名稱而變成「 `DELETE <欄位名稱> FROM <資料表名稱>` 」等，
  都是常見的錯誤寫法，這些都只會獲得錯誤訊息，無法正常執行，撰寫時請多注意。

  第 1 種錯誤寫法之所以無法順利執行，是因為 `DELETE 敘述` 所刪除的對象並非資料表，而是資料表中包含的「 `紀錄` 」。

  第 2 種錯誤寫法也是基於完全相同的理由，由於刪除的對象並非欄位，而是「 `紀錄` 」，所以無法以 `DELETE 敘述` 刪除掉某些欄位。

  ::: tip 牢記的原則 4-4
  `DELETE 敘述` 的刪除對象並非資料表和欄位，而是「 `紀錄` 」。
  :::

### 刪除特定紀錄的 DELETE 敘述 (搜尋式 DELETE)
  如果不想 1 次刪除資料表中的所有資料，只刪除特定的紀錄，和 `SELECT 敘述` 的作法相同，可以加上 `WHERE 子句` 並在其中寫入條件，像這樣能限制刪除對象紀錄的 `DELETE 敘述`，就稱為「 `搜尋式DELETE` 」。

  ::: warning 語法 4-3
  僅刪除特定紀錄
  ```SQL
  DELETE FROM <資料表名稱>
  WHERE <條件>;
  ```
  :::

  ::: warning 範例 4-14
  只刪除販售單價大於或等於 4000 元的紀錄
  ```SQL
  DELETE FROM Shohin
  WHERE sell_price >= 4000;
  ```
  :::

  ::: tip 牢記的原則 4-5
  刪除特定紀錄的時候，需要以 `WHERE 子句` 撰寫刪除對象紀錄的條件。
  :::

  此外，`DELETE 敘述` 和 `SELECT 敘述` 不同，不能加上 `GROUP BY`、`HAVING`、`ORDER BY` 等 3 個子句，能使用的僅有 `WHERE 子句`。

> ### COLUMN - 刪除與捨棄
> 做為從資料表刪除資料的實作方法，標準 `SQL` 只有提供了 `DELETE 敘述`，不過在眾多的各家資料庫之中，很多都有提供另外 1 個名為「 `TRUNCATE` 」的指令，以主流的資料庫來說，`Oracle`、`SQL Server`、`PostgreSQL`、`MySQL (MariaDB)` 和 `DB2` 等資料庫都具有此指令。

> `TRUNCATE` 這個單字具有「 `捨棄` 」意思，其具體的使用方式如下：
> ::: warning 語法 4-A
> 直接刪除資料表中所有紀錄
> ```SQL
> TRUNCATE <資料表名稱>;
> ```
> :::

> 和 `DELETE 敘述` 不同，`TRUNCATE 敘述` 會直接刪除資料表中的所有紀錄，不能以 `WHERE 子句` 指定條件，僅刪除特定的紀錄，因此無法精細控制刪除的對象，不過相對地，比起 `DELETE 敘述` 的處理速度，`TRUNCATE 敘述` 具有更加快速的優點。實際上，由於`DELETE 敘述` 在 `DML 敘述` 中算是需要花費許多時間的指令，如果不必保留任何紀錄，改用 `TRUNCATE` 可以縮短執行的時間。

> 不過，例如 `Oracle` 將 `TRUNCATE` 定義為 `DDL` 而不是 `DML` 的狀況，各家資料庫之間的些許差異是必須留意的地方。使用 `TRUNCATE` 的時候，必須先詳加閱讀廠商所提供的說明手冊，再謹慎運用，因為越是方便的工具通常也有相對的缺點。

>  > `Oracle` 的 `ROLLBACK` 對 `TRUNCATE` 無效，`TRUNCATE` 在執行上都預設採用 `COMMIT` 的方式。

## 4-3 修改資料 (UPDATE)
  ::: info 學習重點
  - 修改資料表中的資料時，需要使用 `UPDATE 敘述`。
  - 若想修改特定的紀錄，可以使用 `WHERE 子句` 指定修改對象的條件，而已 `WHERE 子句` 限制修改對象的 `UPDATE 敘述` 稱為「 `搜尋式 UPDATE` 」。
  - `UPDATE 敘述` 能將欄位的的值清空為 `NULL`。
  - 同時更新多個欄位的時候，可在 `UPDATE 敘述` 的 `SET 子句` 中，列出多個欄位並以逗號隔開。
  :::

### UPDATE 的基本語法
  以 `INSERT 敘述` 新增資料之後，未來有可能需要修改這些已經儲存在資料表中的資料，只要改用 `UPDATE 敘述`，便能修正先前錯誤輸入的資料。

  `UPDATE 敘述` 和 `INSERT 敘述` 以及 `DELETE 敘述` 同樣屬於 `DML敘述`，利用此敘述即能修改資料表中的資料。

  ::: warning 語法 4-4
  修改資料表中資料的 UPDATE 敘述
  ```SQL
  UPDATE <資料表名稱>
  SET <欄位名稱> = <新值或算式>;
  ```
  :::

  被修改的欄位以及更新後的內容值應當寫在 `SET 子句` 的部分。

  ::: warning 範例 4-15
  將全部的登錄日期改為「 2009年10月10日 」
  ```SQL
  UPDATE Shohin
  SET reg_date = '2009-10-10'
  ```
  :::
  
### 指定條件的 UPDATE 敘述 (搜尋式 UPDATE)
  想針對特定紀錄修改資料的時候，和 `DELETE 敘述` 相同，只要使用 `WHERE 子句` 即可做到，像這樣能限制修改範圍的 `UPDATE 敘述` 亦稱為「 `搜尋式 UPDATE` 」。

  ::: warning 語法 4-5
  僅修改特定紀錄的 `搜尋式 UPDATE`
  ```SQL
  UPDATE <資料表名稱>
  SET <欄位名稱> = <新值或算式>
  WHERE <條件>;
  ```
  :::

  ::: warning 範例 4-16
  針對商品分類為「 廚房用品 」的紀錄，將販售單價改為 10 倍
  ```SQL
  UPDATE Shohin
  SET sell_price = sell_price * 10
  WHERE shohin_catalg = '廚房用品';
  ```
  :::

### 將資料改為 NULL
  使用 `UPDATE 敘述` 也能將欄位的內容值改為 `NULL` (這樣的更新資料方式一般稱為「 `NULL 清空` 」)，而想將欄位改為 `NULL` 的時候，只要在 `SET 子句` 的等號右側直接寫上 `NULL` 即可。

  ::: warning 範例 4-17
  將商品 ID 為「 0008 」的鋼珠筆的登錄日期改為 NULL
  ```SQL
  UPDATE Shohin
  SET reg_date = NULL
  WHERE shohin_id = '0008';
  ```
  :::

  這樣的用法和之前的 `INSERT 敘述` 相同，在 `UPDATE 敘述` 中也能把 `NULL` 當成 1 個內容值來使用。

  不過，將欄位內容值改為 `NULL` 的操作，僅適用於沒有加上 `NOT NULL` 或 主鍵條件約束的欄位，如果試圖把帶有這些條件約束的欄位改為 `NULL`，將會出現錯誤訊息，而先前的 `INSERT 敘述` 在此點上也是相同的。

  ::: tip 牢記的原則 4-6
  `UPDATE 敘述` 亦能將欄位內容值改為 `NULL`，不過僅限於沒有 `NOT NULL` 條件約束的欄位。
  :::

### 修改多個欄位的資料
  `UPDATE 敘述` 的 `SET 子句` 部分，其實可以寫成同時修改多個欄位的形式。

  ::: warning 範例 4-18
  能正確執行卻有些冗長的 `UPDATE 敘述`
  ```SQL
  -- 1 段 UPDATE 敘述僅修改 1 個欄位
  UPDATE Shohin
  SET sell_price = sell_price * 10
  WHERE shohin_catalg = '廚房用品';

  UPDATE Shohin
  SET buying_price = buying_price / 2
  WHERE shohin_catalg = '廚房用品';
  ```
  :::

  實際上，上面的處理動作可以彙整成單一的 `UPDATE 敘述`。

  ::: warning 範例 4-19
  - 適用於所有的 `DBMS`

  將範例 4-18 的處理彙整成單一 `UPDATE 敘述` 的方式 ① 
  ```SQL
  -- 將各欄位的部分以逗號隔開
  UPDATE Shohin
  SET sell_price = sell_price * 10,
      buying_price = buying_price / 2
  WHERE shohin_catalg = '廚房用品';
  ```
  :::

  ::: warning 範例 4-20
  - 專用語法：`PostgreSQL`、`DB2`

  將範例 4-18 的處理彙整成單一 `UPDATE 敘述` 的方式 ② 
  ```SQL
  -- 使用串列的形式將欄位和值分別以括號 () 圍起來
  UPDATE Shohin
  SET (sell_price, buying_price) = (sell_price * 10, buying_price / 2)
  WHERE shohin_catalg = '廚房用品';
  ```
  :::

  此 2 種形式的 `UPDATE 敘述` 執行之後，都會獲得相同的結果。

  而且 `SET 子句` 中不僅可以列出 2 個欄位，同時能對更多的欄位修改資料。

## 4-4 交易功能
  ::: info 學習重點
  - 1 筆交易包含了 1 個以上的資料更新動作，而且這些更新動作應該一併執行完畢。藉由交易功能，對於多個資料更新的動作，就能進行確認或取消等管控工作。
  - 交易的所有處理動作結束時，需要使用 `COMMIT (確認處理動作)` 或 `ROLLBACK (取消處理動作)` 等 2 個指令。
  - `DBMS` 的交易必須遵守 `不可分割性 (Atomicity)`、`一致性 (Consistency)`、`隔離性 (Isolation)` 以及 `持續性 (Durability)` 等 4 項原則，取這些單字的第 1 個字母亦稱為 ACID 特性。
  :::

### 什麼是交易功能
  交易 (Transaction) 這個詞彙，在 `RDBMS` 的世界中，它代表了「 對資料表中資料，執行更新動作的基本單位 」，交易是「 `對資料庫執行 1 個以上的更新動作時，這些更新動作的代稱` 」。

  更新資料表中的資料時，需要使用 `INSERT`、`DELETE` 以及 `UPDATE` 等敘述來完成，不過實務上更新資料的時候，一般無法單靠 1 段敘述就達成目的，經常必須組合多段敘述並連續執行，而交易功能可以將這些操作整合成比較容易理解和使用的形式。

  「 需要一併執行完畢的多個更新動作 」，應當整合成單一的「 交易 」來運用。

  ::: tip 牢記的原則 4-7
  1 筆交易包含了 1 個以上的更新動作，而且應該一併執行完畢。
  :::

### 如何設定交易功能
  ::: warning 語法 4-6
  交易的語法
  ```SQL
  交易起始敘述;

    DML 敘述①
    DML 敘述②
    DML 敘述③
    ...
  
  交易結束敘述 (COMMIT 或 ROLLBACK);
  ```
  :::

  以「 交易起始敘述 」和「 交易結束敘述 」圍住用來更新資料的 `DML 敘述` (`INSERT`/`UPDATE`/`DELETE` 敘述)，此即為交易的形式。

  實際上在 標準 SQL 的規範中，並沒有明確定義交易起始敘述的格式，因此各家 `DBMS` 分別採用了不同的專用語法。

  - `SQL SERVER`、`PostgreSQL`
    ```sql
    BEGIN TRANSACTION
    ```

  - `MySQL`、`MariaDB`
    ```sql
    START TRANSACTION
    ```

  - `Oracle`、`DB2`
    ```sql
    無
    ```

  結束敘述僅有 `COMMIT` 和 `ROLLBACK` 兩種寫法。

  ::: warning 範例 4-21
  - 專用語法：`SQL Server`、`PostgreSQL`
  ```sql
  BEGIN TRANSACTION;

    -- 將襯衫的販售單價降低 1000 元
    UPDATE Shohin
    SET sell_price = sell_price - 1000
    WHERE shohin_name = '襯衫';

    -- 將T恤的販售單價調高 1000 元
    UPDATE Shohin
    SET sell_price = sell_price + 1000
    WHERE shohin_name = 'T恤';

  COMMIT;
  ```

  - 專用語法：`MySQL`、`MariaDB`
  ```sql
  START TRANSACTION;

    -- 將襯衫的販售單價降低 1000 元
    UPDATE Shohin
    SET sell_price = sell_price - 1000
    WHERE shohin_name = '襯衫';

    -- 將T恤的販售單價調高 1000 元
    UPDATE Shohin
    SET sell_price = sell_price + 1000
    WHERE shohin_name = 'T恤';

  COMMIT;
  ```

  - 專用語法：`Oracle`、`DB2`
  ```sql
  -- 將襯衫的販售單價降低 1000 元
  UPDATE Shohin
  SET sell_price = sell_price - 1000
  WHERE shohin_name = '襯衫';

  -- 將T恤的販售單價調高 1000 元
  UPDATE Shohin
  SET sell_price = sell_price + 1000
  WHERE shohin_name = 'T恤';

  COMMIT;
  ```
  :::

  交易的結束點必須由使用者以明確的方式來指定，而結束交易需要使用下列 2 個 指令：
  - #### `COMMIT` - 確認處理動作
    這個交易結束指令，會實際套用交易中所有處理動作產生的資料變動。

    執行了 `COMMIT` 之後，因為無法再度回到交易開始前的狀態，所以執行前請再次自行確認是否真的可以變更資料。

    ::: tip 牢記的原則 4-8
    不清楚交易何時開始也沒有關係，但是結束時必須再三確認，以免事後懊悔不已。
    :::

  - #### `ROLLBACK` - 取消處理動作
    `ROLLBACK` 這個交易結束指令，會捨棄交易中所有處理動作產生的資料變動。

    執行了 `ROLLBACK` 之後，資料庫會回復到交易開始前的狀態。

    ::: warning 範例 4-22
    ROLLBACK 交易的實例
    - 專用語法：`SQL Server`、`PostgreSQL`
    ```SQL
    BEGIN TRANSACTION;

      -- 將襯衫的販售單價降低 1000 元
      UPDATE Shohin
      SET sell_price = sell_price - 1000
      WHERE shohin_name = '襯衫';

      -- 將T恤的販售單價調高 1000 元
      UPDATE Shohin
      SET sell_price = sell_price + 1000
      WHERE shohin_name = 'T恤';

    ROLLBACK;
    ```

    不同的 `DBMS` 的交易功能語法也會有些差異，如果想在 `MariaDB` 上執行，請改為 「 START TRANSACTION; 」，另外，在 `Oracle` 和 `DB2` 上執行時，不需要 `TRANSACTION` 的部分。
    :::

> ### COLUMN - 交易功能的起始點
> 交易起始的標準指令並不存在，因此各家 `DBMS` 分別採用了不同的指令。
> 
> 在大部分的狀況之下，當連上資料庫的時候，其實就已經是默認啟動交易的狀態，因此使用者不必特別明確下達指令來啟動交易。
> 
> 像這樣不需要指令便默認啟動交易功能的資料庫，應該如何區隔各筆交易呢？
> 
> 有下列 2 種方式可供選擇：
>   - Ⓐ 採用 「 1 段 SQL 敘述即是 1 筆交易 」的規則 (`自動確認模式`)。
>   - Ⓑ 到使用者執行 `COMMIT` 或 `ROLLBACK` 為止，視為 1 筆交易。
> 
> 在一般的 `DBMS` 上，通常可以自行選擇其中 1 種模式。而 `預設` 為自動確認模式的 `DBMS` 有 `SQL Server`、`PostgreSQL`、`MySQL` 和 `MariaDB` 等資料庫。
> 
> 另一方面，以預設為 Ⓑ 模式的 `Oracle` 來說，在使用者自行發送 `COMMIT` 或 `ROLLBACK` 之前，此筆交易都不會結束。

### ACID 特性
  關於 `DBMS` 的交易功能，在標準規範中訂定有應當遵守的 4 大原則，取各個單字的第 1 個字母稱之為「 `ACID 特性` 」，這些原則是所有 `DBMS` 都必須遵守的通用原則。

  - #### 不可分割性 (Atomicity)
    當 1 筆交易結束的時候，對於當中所包含的更新處理動作，確保結束時的狀態為全部執行完畢、或全部取消執行的特性，也稱為「 `All or Nothing` 」。

  - #### 一致性 (Consistency)
    交易中所包含的處理動作，都需要滿足資料庫預先設定的條件約束，例如 `主鍵` 或 `NOT NULL` 等條件約束。

  - #### 隔離性 (Isolation)
    確保各筆交易之間不會相互受到干涉影響的性質。交易之間不會相互包容行成巢狀結構，另外，某筆交易結束之前，其他交易無法得知此筆交易所造成的變動。
  
  - #### 持續性 (Durability)
    亦稱為持久性，當交易在 `COMMIT` 或 `ROLLBACK` 結束之後，確保資料內容會維持在該時間點狀態的性質，即使未來系統發生故障而遺失資料，資料庫也不會回復到交易更新前的內容。

    確保此持續性的方法在實務上各有差異，不過其中最受到歡迎的做法，便是將交易的執行紀錄先儲存至硬碟等裝置之中，而這樣的執行紀錄稱為「 `日誌(Log)` 」，當發生系統故障的時候，便可以利用日誌內容回復到故障前 (交易完成後) 的狀態。

## 自我練習
  - 4.1 A 先生從自己的電腦連上資料庫，針對剛以 `CREATE TABLE 敘述` 建立完成、尚未存入任何資料的 `Shohin (商品) 資料表`，執行以下 `SQL 敘述` 新增資料。

    ```SQL
    START TRANSACTION;
    INSERT INTO Shohin VALUES ('0001', 'T恤', '衣物', 1000, 500, '2009-09-20');
    INSERT INTO Shohin VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11');
    INSERT INTO Shohin VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL);
    ```

    之類，剛好 B 先生也立即操作自己的電腦連上同一資料庫，執行了下面的 `SELECT 敘述`，這個時候 B 先生會獲得什麼樣的結果呢？

    ```SQL
    SELECT * FROM Shohin;
    ```

    ::: details 提示
    - 可以先使用 `DELETE 敘述`，將資料表清空成為剛建立完成的狀態，然後模擬 A 與 B 的操作並觀察執行結果
    :::

    ::: details 練習
    B 先生會得到空的資料表查詢，因為 A 先生並未執行交易結束的動作，資料表不會做任何變更。
    :::

  - 4.2 假設資料庫中有個內容下列 3 筆紀錄的 `Shohin` 資料表。

    | 商品ID | 商品名稱  | 商品分類 | 販售單價   | 購入單價  |  登錄日期   |
    |--------|---------|---------|----------|----------|------------|
    | 0001   | T恤      | 衣物    | 1000     | 500      | 2009-09-20 |
    | 0002   | 打孔機   | 辦公用品 | 500      | 320      | 2009-09-11 |
    | 0003   | 襯衫     | 衣物    | 4000     | 2800     | NULL       |

    如果想直接複製這 3 筆紀錄將資料增加為 6 筆，所以執行了以下的 `INSERT 敘述`，如此一來會得到什麼樣的結果呢？
    
    ```SQL
    INSERT INTO Shohin SELECT * FROM Shohin;
    ```

    ::: details 練習
    會得到 `PRIMARY KEY` 重複的錯誤訊息。
    :::

  - 4.3 假設已有問題 `4.2` 所示的 `Shohin` 資料表以及當中的資料，這裡需要另外建立 1 個新的資料表，此 `ShohinProfit (商品利潤)` 資料表的結構如下所示，它具有名為 `s_profit (利潤)` 的欄位。

    ```SQL
    -- 商品利潤資料表
    CREATE TABLE ShohinProfit
    (shohin_id CHAR(4) NOT NULL,
    shohin_name VARCHAR(100) NOT NULL,
    sell_price INTEGER,
    buying_price INTEGER,
    s_profit INTEGER,
    PRIMARY KEY (shohin_id));
    ```

    請撰寫 `SQL 敘述`，根據 `Shohin` 資料表求得個商品的利潤，然後將結果存入 `ShohinProfit` 資料表成為如下所示的狀況，利潤單純以「 販售單價 - 購入單價 」來計算即可。

    | shohin_id | shohin_name | sell_price | buying_price | s_profit |
    |-----------|-------------|------------|--------------|----------|
    | 0001      | T恤         | 1000       | 500          | 500      |
    | 0002      | 打孔機      | 500        | 320          | 180      |
    | 0003      | 襯衫        | 4000       | 2800         | 1200     |

    ::: details 練習
    ```SQL
    INSERT INTO ShohinProfit (shohin_id, shohin_name, sell_price, buying_price, s_profit)
    SELECT shohin_id, shohin_name, sell_price, buying_price, (sell_price - buying_price) AS s_profit
    FROM shohin;
    ```
    :::

  - 4.4 對於問題 `4.3` 中已經存入資料的 `ShohinProfit` 資料表，這裡需要完成以下的資料更新動作。
    1. 將襯衫的販售單價從 `4000` 元降至 `3000` 元。
    2. 承接上述的結果，重新計算襯衫的利潤。
    更新後的 `ShohinProfit` 資料表如下所示，請寫出能達成此目的的 `SQL 敘述`。

    | shohin_id | shohin_name | sell_price | buying_price | s_profit |
    |-----------|-------------|------------|--------------|----------|
    | 0001      | T恤         | 1000       | 500          | 500      |
    | 0002      | 打孔機      | 500        | 320          | 180      |
    | 0003      | 襯衫        | 3000       | 2800         | 200      |

    ::: details 練習
    ```SQL
    -- 將襯衫的販售單價降至 3000 元
    UPDATE ShohinProfit
    SET sell_price = 3000,
        s_profit = sell_price - buying_price
    WHERE shohin_name = '襯衫';
    ```
    :::
