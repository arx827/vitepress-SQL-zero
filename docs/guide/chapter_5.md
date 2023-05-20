---
title: 第 5 章 進階查詢功能
---

# 第 5 章 進階查詢功能

## 5-1 檢視表
  ::: info 學習重點
  - 若從 `SQL` 的觀點來看，`檢視表` 可說是「 等同於資料表的東西 」。 2 者的差異在於資料表當中儲存著「 實際的資料 」，而 `檢視表` 當中所儲存的事「 `SELECT 敘述` 」( `檢視表` 本身不具有資料內容)。
  - 若運用檢視表的功能，對於所需資料存放於多個資料表之類的狀況，亦能輕鬆地完成複雜的資料彙集操作。
  - 將經常使用的 `SELECT 敘述` 製作成 `檢視表`，便能重複利用。
  - 建立 `檢視表` 時，需要使用 `CREATE VIEW 敘述`。
  - `檢視表` 在使用上具有「 不能使用 `ORDER BY 子句` 」以及「 可透過 `檢視表` 更新資料、但是有些限制條件 」等 2 項限制項目。
  - 刪除 `檢視表` 時，需要使用 `DROP VIEW 敘述`。
  :::

### 檢視表與資料表
  從 `SQL` 的觀點來看，`檢視表` 可說等同於資料表。實際上在 `SQL 敘述` 之中，幾乎不必特意區分此為資料表或是 `檢視表`，只有「 `更新` 」資料的時候才需要留意 2 者的差異。

  2 者的差異其實僅在於「 `是否儲存著實際的資料` 」。

  通常我們會先建立資料表，然後以 `INSERT 敘述` 新增資料，利用這樣的方式將資料存入資料庫之中。而說到資料庫中的資料的真實存放位置，其實是位於電腦內部的 `儲存裝置` (一般為硬碟)，因此，之後執行 `SELECT 敘述` 查詢資料的時候，實際上是從儲存裝置 (硬碟) 取出資料，再進行各種運算處理，最後將資料回傳給使用者，此為大致上的流程。

  `檢視表` 的機制不會在儲存裝置中存入資料。可以說 `檢視表 的儲存空間中沒有任何資料`，實際上，它所儲存的僅是 「 `SELECT 敘述` 」，而想從 `檢視表` 取出資料的時候，其實是先執行 `檢視表` 內部存放的 `SELECT 敘述`，暫時建立出虛擬的資料表，之後再從中取出資料。

  - #### 檢視表的優點
    檢視表大致上具有下列 2 個優點。
    - 第 1 個，因為不儲存資料所以可以節省儲存裝置的容量。

      ::: warning 範例 5-1
      檢視表只需儲存 `SELECT 敘述` 即可
      ```SQL
      SELECT shohin_catalg, SUM(sell_price), SUM(buying_price)
      FROM Shohin
      GROUP BY shohin_catalg;
      ```
      :::

      ::: tip 牢記的原則 5-1
      相對於資料表儲存著「 真實的資料 」，`檢視表` 僅儲存著用來從資料表取出資料的「 `SELECT 敘述` 」。
      :::
    
    - 第 2 個優點，若將頻繁使用的 `SELECT 敘述` 預先存成檢視表的形式，那麼就不必每次輸入相同的敘述，也能重複利用取出同樣的資料集。
      
      而且，檢視表所包含的資料會與原本的資料表產生連動，隨時自動更新到最新的資料內容或狀態。由於檢視表每次「 參照檢視表中的資料 」時，其實是「 執行該 `SELECT 敘述` 」，因此可以篩選出最新狀態的資料，這也是將資料另存資料表所辦不到的優點。

      ::: tip 牢記的原則 5-2
      經常使用的 `SELECT 敘述` 可以轉為檢視表，方便重複利用。
      :::

### 檢視表的建立方式
  建立 `檢視表` 需要使用 `CREATE VIEW 敘述`。

  ::: warning 語法 5-1
  建立檢視表的 `CREATE VIEW 敘述`
  ```SQL
  CREATE VIEW <檢視表名稱> (<檢視表欄位名稱1>, <檢視表欄位名稱2>, ...)
  AS
  <SELECT 敘述>
  ```
  :::

  `AS 關鍵字` 的後方便是撰寫 `SELECT 敘述` 的位置，`SELECT 敘述` 所取得的欄位排列順序會和檢視表的欄位排列順序一致。

  ::: warning 範例 5-2
  ShohinSum 檢視表
  ```SQL {3-5}
  CREATE VIEW ShohinSum (shohin_catalg, cnt_shohin)
  AS
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg;
  ```

  `AS` 是絕對不能省略的部分。
  :::

  使用方式，其實 `檢視表` 在使用上和資料表並無不同，只要將它的名稱寫在 `SELECT 敘述` 的 `FROM` 子句部分即可。

  ::: warning 範例 5-3
  使用 檢視表
  ```SQL
  SELECT shohin_catalg, cnt_shohin
  FROM ShohinSum;
  ```
  :::

  建立 `檢視表` 的時候，可以寫入各種形式的 `SELECT 敘述`。

  - #### 對檢視表進行查詢
    在 `FROM 子句` 中指定 `檢視表` 進行查詢的時候，會依循下列 2 個階段的步驟。
      1. 先執行建立檢視表當時所定義的 `SELECT 敘述`。
      2. 將該結果當作 `FROM 子句` 所指定的資料來源，完成此 `SELECT 敘述` 的執行動作。

    以 `檢視表` 為對象的查詢動作，總是需要執行 2 段以上的 `SELECT 敘述`。

    `多層檢視表`：建立 `檢視表` 的時候也能指定其他 `檢視表` 當作資料來源，形成類似「 疊床架屋 」的架構。

    ::: warning 範例 5-4
    ShohinSumJim 檢視表
    ```SQL
    CREATE VIEW ShohinSumJim (shohin_catalg, cnt_shohin)
    AS
    SELECT shohin_catalg, cnt_shohin
    FROM ShohinSum
    WHERE shohin_catalg = '辦公用品';
    ```
    :::

    盡量避免在 `檢視表` 上反覆重疊建立 `檢視表`，因為以大部分的 `DBMS` 來說，`重疊建立檢視表的做法將會招致資料庫的效能低落`。請盡可能維持在只使用單層 `檢視表` 的方式。

    ::: tip 牢記的原則 5-3
    請 (盡量) 避免在 `檢視表` 上重疊建立 `檢視表`。
    :::

### 檢視表的限制-1：建立時不可使用 ORDER BY 子句
  若要探討為什麼不能使用 `ORDER BY 子句`，其實和資料表的道理相同，因為檢視表也被設定成「 各筆紀錄沒有先後順序 」的緣故。

  ::: tip 牢記的原則 5-4
  建立資料表的敘述中請勿使用 `ORDER BY 子句`
  :::

### 檢視表的限制-2：透過檢視表更新資料
  雖然訂有嚴格的限制，不過還是有機會透過 `檢視表` 更新原資料表中實際儲存的資料，在標準 `SQL` 中有著如下的規定：
  
  「 用來建立檢視表的 `SELECT 敘述` 在符合某些條件的狀況之下，便能透過此檢視表更新資料 」。
  
  列舉幾項比較主要的條件：
  1. `SELECT 子句` 中沒有 `DISTINCT 關鍵字`。
  2. `FROM 子句` 中只有 1 個資料表。
  3. 沒有使用 `GROUP BY 子句`。
  4. 沒有使用 `HAVING 子句`。

  如果 `檢視表` 所呈現的資料，是原資料表經過彙總處理之後的結果，那麼對 `檢視表` 所執行的變更動作，資料庫當然無法判斷應該如何反應至原資料表中儲存的資料，導致無法透過 `檢視表` 更新資料。

  `檢視表` 中就是原本的資料表所衍生出來的產物，因此，如果直接變更原資料表的內容，`檢視表` 所看到的資料也會跟著發生變化，反之亦然，若是透過 `檢視表` 變更資料內容，資料庫也必須將變更的動作反映至原資料表，維持 2 者之間的一致性。

  ::: tip 牢記的原則 5-5
  `檢視表` 和資料表的資料內容是連動的，因此不能透過具有彙總動作的 `檢視表` 更新資料。
  :::

  - #### 可透過檢視表更新的例子
    ::: warning 範例 5-5
    可更新資料的檢視表
    ```SQL
    CREATE VIEW ShohinJim (shohin_id, shohin_name, shohin_catalg, sell_price, buying_price, reg_date)
    AS
    SELECT *
    FROM Shohin
    WHERE shohin_catalg = '辦公用品';
    ```
    沒有彙總以及結合的 `SELECT 敘述`。
    :::

    由於 `ShohinSumJim` 檢視表只有過濾出屬於 辦公用品的商品，所以若對此檢視表執行 `INSERT 敘述`，當然可以順利完成。

    ::: warning 範例 5-6
    可更新資料的檢視表
    ```SQL
    INSERT INTO ShohinJim VALUES ('0009', '印章', '辦公用品', 95, 10, '2009-11-30');
    ```
    :::

    ::: warning 注意
    專用語法：`PostgreSQL`

    如果是 `PostgreSQL` 的資料庫，由於某些版本會將 `檢視表` 預設為只能讀取，所以執行 範例 5-6 的 `INSERT 敘述` 時，可能會看到下面的錯誤訊息。

    執行結果
    ```SQL
    ERROR: cannot update a view
    HINT: You need an unconditional ON UPDATE DO INSTEAD rule.
    ```

    遇到這種狀況的時候，在執行 `INSERT 敘述` 之前，必須先執行 範例 5-A 的敘述，來允許對檢視表更新資料，而 `DB2`、`MariaDB`和 `MySQL` 等其他 `DBMS` 則不需要此步驟。
    ```SQL
    CREATE OR REPLACE RULE insert_rule
    AS ON INSERT
    TO ShohinJim DO INSTEAD
    INSERT INTO Shohin VALUES (new.shohin_id, new.shohin_name, new.shohin_catalg, new.sell_price, new.buying_price, new.reg_date);
    ```
    :::

    當然也可以像使用資料表一樣，對此檢視表執行 `UPDATE` 或 `DELETE` 等敘述。

### 刪除檢視表
  想刪除既有的 `檢視表` 需要使用 `DROP VIEW 敘述`。

  ::: warning 語法 5-2
  刪除 `檢視表` 的 `DROP VIEW 敘述`
  ```SQL
  DROP VIEW <檢視表名稱>
  ```
  :::

  ::: warning 範例 5-7
  刪除 ShohinSum 檢視表
  ```SQL
  DROP VIEW ShohinSum;
  ```
  :::

  ::: warning 專用語法：`PostgreSQL`
  在 `PostgreSQL` 上，想刪除多層檢視表架構中的來源檢視表時，會因為檢視表之間的依存關係而看到下列的錯誤訊息。

  執行結果 (PostgreSQL 的狀況)
  ```SQL
  ERROR: cannot drop view shohinsum because other objects depend on it.
  DETAIL: view shohinsumjim depends on view shohinsum.
  HINT: Use DROP ... CASCADE to drop the dependent objects too.
  ```

  這個時候需要使用下面的寫法，加上 `CASCADE` 參數，移除所有依存關係。
  ```SQL
  DROP VIEW ShohinSum CASCADE;
  ```
  :::

## 5-2 子查詢
  ::: info 學習重點
  - 若要用 1 句話來形容 `子查詢`，那便是「 用過即丟的檢視表 (SELECT 敘述) 」。`子查詢` 和 `檢視表` 不同，它的 `SELECT 敘述` 在執行完畢後會立即被消除。
  - 由於 `子查詢` 需要賦予名稱，所以請配合其處理內容取個適當的名稱。
  - `純量子查詢` 是「 回傳結果必定為單一紀錄的單一欄位值 」的 `子查詢`。
  :::

### 子查詢與檢視表
  「 `子查詢 (Subquery)` 」功能，便是以檢視表為基礎的技術，可以說是「 用過即丟的檢視表 」。

  將 `建立檢視表的 SELECT 敘述` 直接鑲嵌至 `FROM 子句` 當中。

  ::: warning 範例 5-8
  建立 ShohinSum 檢視表 與 確認用的 SELECT 敘述
  ```SQL
  -- 按照商品分類分別統計商品數量的檢視表
  CREATE VIEW ShohinSum (shohin_catalg, cnt_shohin)
  AS
  SELECT shohin_catalg, COUNT(*)
  FROM Shohin
  GROUP BY shohin_catalg;

  -- 確認檢視表的資料內容
  SELECT shohin_catalg, cnt_shohin
  FROM ShohinSum
  ```
  :::

  如果改用 `子查詢` 的方式來達成相同的目的，將如同範例 5-9 所示。

  ::: warning 範例 5-9
  子查詢

  專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`
  ```SQL {2-4}
  -- 在 FROM 子句中直接寫入建立檢視表的 SELECT 敘述
  SELECT shohin_catalg, cnt_shohin
  FROM (SELECT shohin_catalg, COUNT(*) AS cnt_shohin
        FROM Shohin
        GROUP BY shohin_catalg) AS ShohinSum;
  ```
  :::

  ::: warning 專用語法：`Oracle`
  `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 5-9 敘述的時候，請將「 `) AS ShohinSum;` 」部分改為「 `) ShohinSum;` 」。
  :::

  將原本用來定義檢視表的 `SELECT 敘述` 直接寫入 `FROM 子句` 中，這樣的寫法便稱為「 `子查詢` 」。「 `AS ShohinSum` 」為賦予此 `子查詢` 的名稱，此段 `SELECT 敘述` 在執行之後會立即消失無蹤。

  其執行順序為先執行 `FROM 子句` 中的內部 `SELECT 敘述`，然後再執行外圍的 `SELECT 敘述`。

  ::: tip 牢記的原則 5-6
  `子查詢` 會從內部的 `SELECT 敘述` 開始執行。
  :::

  - #### 增加子查詢的層數
    由於 `子查詢` 的層數原則上沒有什麼限制，`子查詢` 中的 `FROM 子句` 可以再使用 `子查詢`，而其中的 `FROM 子句` 還可以再度使用 `子查詢`，理論上是可以寫出無限多層的巢狀結構。

    ::: warning 範例 5-10
    增加子查詢巢狀結構的層數

    專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`
    ```SQL
    SELECT shohin_catalg, cnt_shohin
    FROM (SELECT *
          FROM (SELECT shohin_catalg, COUNT(*) AS cnt_shohin
                FROM Shohin
                GROUP BY shohin_catalg) AS ShohinSum
          WHERE cnt_shohin = 4) AS ShohinSum2;
    ```
    :::

    ::: warning 專用語法：`Oracle`
    `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 5-10 敘述的時候，
    請將「 `) AS ShohinSum;` 」部分改為「 `) ShohinSum` 」，
    將「 `) AS ShohinSum2;` 」部分改為「 `) ShohinSum2` 」，
    :::

    但是，隨著 `子查詢` 的階層數量增加，除了這樣複雜的 `SQL 敘述` 難以閱讀之外，與 `檢視表` 相同，同樣會對資料庫的效能造成負面影響，因此，請盡量避免使用過多層數的 `子查詢`。
    
### 子查詢的名稱
  由於原則上必須替 `子查詢` 取個稱呼，所以請在思考該 `子查詢` 的處理內容之後，再取個容易聯想的適當名稱。以「 ShohinSum 」為例，因為其功用在於彙總統計 Shohin 資料表的資料，因此使用了原本資料表的名稱，再加上 `Sum` 這個具有總和意思的單字。

  替 `子查詢` 取名的時候需要使用 `AS` 關鍵字，不過某些 `DBMS` 可以省略此 `AS` 關鍵字，如 `Oracle`。

### 純量子查詢
  「 `純量子查詢` 」是較為特殊的 `子查詢`。

  - #### 什麼是純量
    「 `純量` 」譯自於 `Scalar` 這個單字，它具有「 `單純的數值` 」的意思，在資料庫以外的其他領域也能看到這個詞彙。

    `子查詢` 基本上會回覆多筆的紀錄，相對於此，`純量子查詢` 則是「 `回傳值必定為單一紀錄的單一欄位` 」的特殊子查詢。

    ::: tip 牢記的原則 5-7
    `純量子查詢` 是回傳值為單一值的子查詢。
    :::

  - #### 在 WHERE 子句使用純量子查詢
    若想「 `查詢販售單價高於全部商品平均販售單價的商品` 」，如果直接使用 `AVG 函數` 寫出如下的 `SQL 敘述`，執行之後只會得到錯誤訊息。

    ::: danger WHERE 子句中不能使用彙總函數
    ```SQL {3}
    SELECT shohin_id, shohin_name, sell_price
    FROM Shohin
    WHERE sell_price > AVG(sell_price);
    ```
    :::

    這裡即是 `純量子查詢` 能發揮其效果的地方，首先想要求得平均值，可執行 範例 5-11。

    ::: warning 範例 5-11
    可求得平均販售單價的純量子查詢
    ```SQL
    SELECT AVG(sell_price)
    FROM Shohin;
    ```
    :::

    可以將這個結果數值直接應用於 `WHERE 子句` 的比較式中。

    ::: warning 範例 5-12
    篩選出販售單價 (sell_price) 高於全部商品平均販售單價的商品
    ```SQL {3-4}
    SELECT shohin_id, shohin_name, sell_price
    FROM Shohin
    WHERE sell_price > (SELECT AVG(sell_price)
                        FROM Shohin;)
    ```
    :::

    使用 `子查詢` 功能的 `SQL 敘述`，會先從 `子查詢` 的部分開始執行。 

### 可寫入純量子查詢的位置
  `SQL 敘述` 中，可以寫入 `純量子查詢` 的位置，不僅只限於 `WHERE 子句`，基本上，能寫入 `純量值` 的地方都可以改寫為 `純量子查詢` 的形式，不論是 `SELECT 子句`、`GROUP BY 子句`、`HAVING 子句` 以及 `ORDER BY 子句` 等。

  ::: warning 範例 5-13
  在 SELECT 子句中使用純量子查詢
  ```SQL {4-5}
  SELECT shohin_id,
         shohin_name,
         sell_price,
         (SELECT AVG(sell_price)
          FROM Shohin) AS avg_price
  FROM Shohin;
  ```
  :::

  ::: warning 範例 5-14
  在 HAVING 子句中使用純量子查詢
  ```SQL {4-5}
  SELECT shohin_catalg, AVG(sell_price)
  FROM Shohin
  GROUP BY shohin_catalg
  HAVING AVG(sell_price) > (SELECT AVG(sell_price)
                            FROM Shohin);
  ```
  :::

### 使用純量子查詢的需注意事項
  想要使用 `純量子查詢` 的時候必須特別注意的地方，那便是「 `絕對不能讓子查詢回傳包含多筆紀錄的結果` 」，因為當 `子查詢` 回傳多筆紀錄的時候，已經不屬於 `純量子查詢`，而只是一般子查詢的用法，如此一來，既不能使用 `=` 或 `<>` 等運算子來和 `純量值` 做比較，也無法寫入 `SELECT 子句` 等位置之中。

## 5-3 關聯子查詢 (Correlated Subquery)
  ::: info 學習重點
  - `關聯子查詢` 能在細分後的群組內比較大小。
  - 和 `GROUP BY 子句` 相同，`關聯子查詢` 也具有將資料群組「 `切開` 」的功能。
  - `關聯子查詢` 的連結條件，必須寫在 `子查詢` 之中，否則會發生錯誤，此點請特別注意。
  :::

### 一般子查詢與關聯子查詢的差異
  - #### 在各商品分類中比較平均販售單價
    先按照分類將商品「 細分成 」較小的群組，然後在各群組內比較分類平均售價與各商品販售單價的大小。

    ::: warning 範例 5-15
    求得各商品分類的平均售價
    ```SQL
    SELECT AVG(sell_price)
    FROM Shohin
    GROUP BY shohin_catalg;
    ```
    :::

    不過，如果直接將上面的 `SELECT 敘述` 當作 `子查詢` 寫入 `WHERE 子句`，只會得到錯誤訊息。

    ::: danger 錯誤的子查詢寫法
    ```SQL {3-5}
    SELECT shohin_id, shohin_name, sell_price
    FROM Shohin
    WHERE sell_price > (SELECT AVG(sell_price)
                        FROM Shohin
                        GROUP BY shohin_catalg);
    ```
    此 `子查詢` 會回傳多筆紀錄，這違背了 `純量子查詢` 的原則。
    :::

  - ### 使用關聯子查詢的解決方式
    只要在先前的 `SELECT 敘述` 中增加 1 行內容，即可變成能獲得所需結果的 `SELECT 敘述`。

    ::: warning 範例 5-16
    利用關聯子查詢在各商品分類中比較平均售價

    專用語法：`SQL Server`、`DB2`、`PostgreSQL`、`MySQL`

    ```SQL {2,4-5}
    SELECT shohin_catalg, shohin_name, sell_price
    FROM Shohin AS S1
    WHERE sell_price > (SELECT AVG(sell_price)
                        FROM Shohin AS S2
                        WHERE S1.shohin_catalg = S2.shohin_catalg
                        GROUP BY shohin_catalg);
    ```
    :::

    ::: warning 專用語法：`Oracle`
    `Oracle` 在 `FROM 子句` 的地方不能使用 `AS` (會發生錯誤)，因此，想要在 `Oracle` 上執行 範例 5-16 敘述的時候，
    
    請將「 `FROM Shohin AS S1` 」部分改為「 `FROM Shohin S1` 」，

    將「 `FROM Shohin AS S2` 」部分改為「 `FROM Shohin S2` 」。
    :::

    執行之後，便能針對辦公用品、衣物和廚房用品這 3 個分類，分別篩選出各群組中，販售單價高於分類平均售價的商品。

    這裡的重點在於 `子查詢內增加的 WHERE 子句條件`。如果以中文來表達其意思，即相當於「 `在相同的商品分類中`，比較各商品的販售單價和平均售價 」。

    此次作為比較對象的資料來自於相同的 `Shohin 資料表`，所以需要以 `S1` 和 `S2` 的資料表別名作為區別。使用 `關聯子查詢` 的時候，必須像這樣在欄位名稱前方加上資料表別名，以「 `<資料表別名>.<欄位名稱>` 」的形式來撰寫。

    `關聯子查詢` 可以用於限定資料表部分群組資料，而非整個資料表進行比較的需求，因此，運用 `關聯子查詢` 的時候，一般會使用「 `綁定` 」或「 `限制` 」的說法來形容，以此次的範例來說，可以說「 `綁定商品分類` 」來與平均售價做比較。

    ::: tip 牢記的原則 5-8
    `關聯子查詢` 可以在細分後的群組內比較大小
    :::

### 關聯子查詢也能進行資料分群
  `關聯子查詢` 也和 `GROUP BY 子句` 一樣，具有將資料集合進行「 `分群` 」的功能。

  子查詢的部分會在各商品分類的範圍中，分別計算該分類的平均售價，然後到外圍 `SELECT 敘述` 的 `WHERE 子句`，以各商品的售價和各分類的平均售價做比較。

  當商品分類改變的時候，用來比較的平均售價也隨之改變，如此一來便能比較各商品的販售單價與平均售價之間的大小關係。

### 連結條件必須寫在子查詢內
  `關聯名稱`，指的是 `S1` 和 `S2` 這些替資料表所取的別名，而 `領域 (Scope)` 則是這些名稱的 `存活範圍 (有效範圍)`，換句話說，`關聯名稱` 具有只能在某些範圍內使用的限制。

  具體來說，在 `子查詢` 內部所賦予的 `關聯名稱`，也只能在該 `子查詢` 的範圍內使用。

  `SQL 敘述` 會從最內部的 `子查詢` 開始逐層往外執行，所以先前範例的 `子查詢` 部分執行完畢的時候，只會留下最後回傳的結果，而來源資料表的別名 `S2` 早已消失，因此，當執行的順序來到 `子查詢` 的外側時，`S2` 這個名稱已經不復存在。

## 自我練習
  - 5.1 請建立滿足下列 3 個條件的 `檢視表`，此 `檢視表` 的名稱可訂為 `ViewExercise5_1`。另外，這裡同樣只需要引用先前一直使用的 `Shohin 資料表`，而且期中的資料為儲存著最初 8 筆紀錄的狀態。
    - `條件 1`：販售單價高於 1000 元。
    - `條件 2`：登錄日期為 2009 年 9 月 20 日。
    - `條件 3`：需要包含商品名稱、販售單價以及登錄日期等 3 個欄位。
  
    若對此 `檢視表` 執行以下的 `SELECT 敘述`，應該要獲得下方的執行結果。
    ```SQL
    SELECT * FROM ViewExercise5_1;
    ```

    執行結果
    | shohin_name | sell_price | reg_date   |
    |-------------|------------|------------|
    | T恤          | 1000       | 2009-09-20 |
    | 菜刀         | 3000       | 2009-09-20 |

    ::: details 練習
    ```SQL
    CREATE VIEW ViewExercise5_1 (shohin_name, sell_price, reg_date)
    AS
    SELECT shohin_name, sell_price, reg_date
    FROM Shohin
    WHERE sell_price >= 1000 && reg_date = '2009-09-20';
    ```
    :::

  - 5.2 請試著針對問題 5.1 所建立的 `ViewExercise5_1` `檢視表` 存入如下的資料，請問結果會是如何呢？
    ```SQL
    INSERT INTO ViewExercise5_1 VALUES ('小刀', 300, '2009-11-02');
    ```

    ::: details 練習
    由於主要資料表 `Shohin` 有 3 個欄位必填 (`shohin_id`、`shohin_name`、`shohin_catalg`)，`檢視表` 原本就缺少必填欄位，且主表未設定 Default 預設值，就算新增 `檢視表` 資料時，欄位有對應，仍無法新增。
    :::
  
  - 5.3 請思考如何寫下能獲得下列結果的 `SELECT 敘述`，最右側的 `sell_price_all` 欄位為全部商品的平均販售單價。

    執行結果
    | shohin_id | shohin_name | shohin_catalg | sell_price | sell_price_all        |
    |-----------|-------------|---------------|-----------:|----------------------:|
    | 0001      | T恤          | 衣物          | 1000       | 2097.5000000000000000 |
    | 0002      | 打孔機       | 辦公用品       | 500        | 2097.5000000000000000 |
    | 0003      | 襯衫         | 衣物          | 4000       | 2097.5000000000000000 |
    | 0004      | 菜刀         | 廚房用品       | 3000       | 2097.5000000000000000 |
    | 0005      | 壓力鍋       | 廚房用品       | 6800       | 2097.5000000000000000 |
    | 0006      | 叉子         | 廚房用品       | 500        | 2097.5000000000000000 |
    | 0007      | 刨絲器       | 廚房用品       | 880        | 2097.5000000000000000 |
    | 0008      | 鋼珠筆       | 辦公用品       | 100        | 2097.5000000000000000 |

    ::: details 練習
    ```SQL
    SELECT
      shohin_id,
      shohin_name,
      shohin_catalg,
      sell_price, (
        SELECT AVG(sell_price)
        FROM Shohin
      ) AS sell_price_all
    FROM shohin;
    ```
    :::

  - 5.4 請試著撰寫 `SQL 敘述` 建立名為 `AvgPriceByCatalg` 的 `檢視表`，此 `檢視表` 的資料如下所示，而來源資料表的條件和問題 5.1 相同。

    執行結果
    | shohin_id | shohin_name | shohin_catalg | sell_price |        sell_price_all |
    |-----------|-------------|---------------|-----------:|----------------------:|
    | 0001      | T恤         | 衣物           | 1000       | 2500.0000000000000000 |
    | 0002      | 打孔機       | 辦公用品        | 500        |  300.0000000000000000 |
    | 0003      | 襯衫         | 衣物           | 4000       | 2500.0000000000000000 |
    | 0004      | 菜刀         | 廚房用品        | 3000       | 2795.0000000000000000 |
    | 0005      | 壓力鍋       | 廚房用品        | 6800       | 2795.0000000000000000 |
    | 0006      | 叉子         | 廚房用品        | 500        | 2795.0000000000000000 |
    | 0007      | 刨絲器       | 廚房用品        | 880        | 2795.0000000000000000 |
    | 0008      | 鋼珠筆       | 辦公用品        | 100        |  300.0000000000000000 |

    ::: details 提示
    - 此題的重點在於 `avg_sell_price` 欄位，這個欄位和問題 5.3 不同，是各商品分類的平均販售單價，和本章 5-3 節 `相關子查詢` 所求得的結果相同，也就是說，撰寫的時候請使用 `相關子查詢`，不過您必須自行寫出完整的敘述。
    :::

    ::: details 練習
    ```SQL
    SELECT
      shohin_id,
      shohin_name,
      shohin_catalg,
      sell_price, (
        SELECT AVG(sell_price)
        FROM Shohin AS S2
        WHERE S1.shohin_catalg = S2.shohin_catalg
        GROUP BY shohin_catalg
      ) AS sell_price_all
    FROM shohin AS S1;
    ```
    :::

