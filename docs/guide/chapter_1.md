---
title: 第 1 章 資料庫與SQL
---

# 第 1 章 資料庫與SQL
## 1-1 資料庫是什麼
  ::: info 學習重點
  - 保存了大量資料、可用電腦有效率地取用，像這樣經過加工的資料集合體就稱為「`資料庫(Database) (簡稱 DB)`」。
  - 管理資料庫的電腦資訊系統稱為「`資料庫管理系統(簡稱 DBMS)`」。
  - 運用 `DBMS` 便能讓許多人安全且方便地取用大量的資料。
  - 資料庫系統有各式各樣的類型，本書著重於「`關聯式資料庫`」，說明如何使用「`SQL`」語言來操控它。
  - 關聯式資料庫需要以「`關聯式資料庫管理系統(簡稱 RDBMS )`」執行管理工作。
  :::

### 身邊隨處可見的資料庫
  - 從固定看診的牙醫診所收到「由於前次來診已經過了半年，建議您定期做牙醫健檢」之類的明信片。
  - 在生日前1個月，從先前投宿過的旅館或飯店收到「給壽星的住宿優惠！」這樣的電子郵件。
  - 上購物網站購買商品之後，在信箱中看到「推薦商品」的電子郵件。

### 為什麼需要資料庫管理系統(DBMS)
  - 讓多人共用相同的資料
  - 擴展到處理大量的資料
  - 想要自動讀寫資料需要另外撰寫程式
  - 萬一電腦發生狀況可能失去資料
  
### DBMS具有許多類型
    按照資料的儲存形式來進行分類
  - #### 階層式資料庫 (Hierarchical Database：無特定的簡稱)
    最早存在的一種資料庫形式，以階層式結構(樹木分支的結構)來儲存、呈現資料。

  - #### 關聯式資料庫 (Relational Database：RDB)
    亦稱為 **『關係型資料庫』**，它的資料儲存方式類似Excel的工作表，以行與列所形成的二維表格形式來管理資料，比較容易理解。操作關聯式資料庫的時候，需要使用到名為 **`SQL`** (Structured Query Language：結構化查詢語言)的專用語言

    此種資料庫的DBMS被稱為 **RDBMS**(Relational Database Management System)
    - ##### 5個具有代表性的RDBMS
      | RDBMS             | 說明                                   |
      | ----------------- | ------------------------------------- |
      |**Oracle Database**|Oracle公司的RDBMS                       |
      |**SQL Server**     |Microsoft公司的RDBMS                    |
      |**DB2**            |IBM公司的RDBMS                          |
      |**PostgreSQL**     |開放原始碼 (Open Source) 的RDBMS         |
      |**MySQL**          |開放原始碼的RDBMS (2010年成為Oracle旗下產品)|

  - #### 物件導向式資料庫 (Object Oriented Database：OODB)
    物件導向語言將資料和處理資料的程序整合成名為「物件」的單位，然後利用物件完成程式的運作過程，而物件導向式資料庫正是用來儲存物件的資料庫。

  - #### XML資料庫 (XML Database：XMLDB)
    近年來，作為網路上資料交換的1種方式，名為`XML`的格式越來越普及。為了可以快速地處理大量的XML格式資料，因此發展出了此種資料庫。

  - #### 鍵值式資料儲存 (Key-Value Store：KVS)
    此類型的資料庫僅儲存由搜尋用的鍵(Key)和內容值(Value)所組成的單純資料形式，對於程式語言有些了解的讀者，可以把它想成類似「關聯陣列(Associative Array)」或「雜湊表(Hash Table)」的資料形式。可以對資料極為龐大的資料完成超高速的搜尋工作。
    
## 1-2 資料庫的架構
  ::: info 學習重點
  - RDBMS 一般採用「用戶端/伺服器型」的系統架構。
  - 對資料庫執行讀取和寫入等動作的時候，通常是從用戶端程式傳送SQL敘述至伺服器RDBMS。
  - 關聯式資料庫利用稱為「資料表」或「表」的2維表格來管理資料。
  - 資料表由代表資料項目的「行(Column，欄位)」、以及代表1筆資料的「列(Record，紀錄)」所構成，而資料讀寫的最基本單位為1列資料。
  - 行與列交會處的每個方格在本書中稱為「儲存格(Cell)」，1個儲存格當中只能放入1項資料。
  :::

### 一般 RDBMS 的系統架構
  RDBMS 所採用的系統架構，最常見的是 `用戶端 / 伺服器型 (C/S型)` 的型態。
  - **伺服器(Server)**：
    - 指能接收來自其他程式的請求，並且完成對應處理動作的服務程式(軟體)，或是安裝著這類服務程式的資訊設備(電腦)。

  - **用戶端(Client)**：
    - 對伺服器送出請求的程式(軟體)、或是安裝著這類程式的資訊設備(電腦)。
    - 用戶端程式能連接上 RDBMS 所管理的資料庫，透過 RDBMS 對資料庫中的資料執行讀取或寫入之類的動作。
    - 而用戶端的請求，主要是傳送以 `SQL 語法所寫成的敘述語法`，RDBMS 會按照 SQL 敘述的內容，回傳特定的資料、或是對資料庫中的資料執行指定的改寫動作。

### 資料表的結構
  - 關聯式資料庫的資料儲存方式有點類似 Excel 的工作表，以行與列所形成的2維表格形式來管理資料，稱為 `資料表(Table)`。
  - 資料表被保存在 RDBMS 所管理的資料庫當中，而且1個資料庫當中可以建立多個資料表。
  - 資料表縱向的`行`稱為`欄位(Column)`，用來說明這個部分儲存的是什麼資料。
  - 資料表橫向的`列`稱為`紀錄(Record)`。
  
  ::: tip 牢記的原則 1-1
  - 關聯式資料庫需要以 `列(紀錄)` 為單位讀取、寫入資料。
  :::

  ::: tip 牢記的原則 1-2
  - 1個儲存格 當中只能放入 1項資料。
  :::

## 1-3 SQL 基本概要
  ::: info 學習重點
  - SQL 是為了操作資料庫所開發出來的語言。
  - SQL 有基本的標準規格，不過各家 `RDBMS` 的 SQL 都略有差異。
  - 使用 SQL 的時候，需要把想執行的動作撰寫成 1段語言 (SQL 敘述)，然後傳送給 `RDBMS`。
  - 原則上，1段 SQL 敘述的末尾需要加上`分號(；)`做結束。
  - SQL 按照使用目的可分為 `DDL`、`DML` 以及 `DCL`。
  :::

### 標準 SQL
  - `SQL (Structured Query Language)` 是用來操作關聯式資料庫的語言。
  - `ISO (國際標準化組織)` 對SQL制訂有標準規格，而作為基準的SQL 即被稱為 `標準SQL`。

  ::: tip 牢記的原則 1-3
  - 學會標準SQL，也就不難學習各家 `RDBMS` 適用的 SQL敘述。
  :::

### SQL 敘述與其分類
  - SQL 是以數個`關鍵字 (Keyword)`、再與資料表名稱或欄位名稱組合成一段完整的語句 (SQL 敘述)，以此方式描述操作的內容。
  - #### SQL 敘述可分為3大類：
    - ##### DDL (Data Definition Language)
      `DDL (資料定義語言)`，能建立或刪除資料庫和資料表等用來儲存資料的物件，規劃資料儲存的方式。
      ###### 以下為 DDL 的指令(關鍵字)：
        - `CREATE`：建立資料庫或資料表等。
        - `DROP`：刪除資料庫或資料表等。
        - `ALTER`：修改資料庫或資料表等物件的架構。
    - ##### DML (Data Manipulation Language)
      `DML (資料操作語言)`，能查詢或修改資料表內的紀錄 (以`列`為單位的資料)。
      ###### 以下為 DML 的指令(關鍵字)：
        - `SELECT`：從資料表查詢記錄。
        - `INSERT`：從新紀錄儲存至資料表中。
        - `UPDATE`：修改資料表的紀錄。
        - `DELETE`：刪除資料表的紀錄。
    - ##### DCL (Data Control Language)
      `DCL (資料控制語言)`，可以用來認可或取消對資料庫執行的變更動作，另外也能設定 RDBMS 的使用者對於資料表等物件的操作權限。
      ###### 以下為 DCL 的指令(關鍵字)：
        - `COMMIT`：認可對資料庫執行的變更動作。
        - `ROLLBACK`：取消對資料庫執行的變更動作。
        - `CRANT`：賦予使用者操作的權限。
        - `REVOKE`：撤銷使用者操作的權限。

  ::: tip 牢記的原則 1-4
  - SQL 按照功能可分為3大類，最常使用的是 `DML`。
  :::

### SQL 的基本撰寫規則
  - #### SQL 敘述的最後需要加上(；)
    一段 SQL 敘述相當於對資料庫執行一個操作動作，而 `RDBMS` 也是逐一執行所有接收到的 SQL 敘述。

    ::: tip 牢記的原則 1-5
    - SQL 敘述需要以`分號(；)`做結束。
    :::

  - #### 英文字母不區分大小寫
    SQL 敘述中的 `關鍵字不區分大小寫`。
    SQL 敘述慣例：
      - 關鍵字全部使用大寫字母
      - 資料表名稱只有第 1 個字母使用大寫
      - 其餘的欄位等名稱全部使用小寫

    ::: tip 牢記的原則 1-6
    - 關鍵字不區分大小寫。
    :::

  - #### 常數有固定的書寫方式
    直接寫在 SQL 敘述當中的字串、日期或數值等資料被稱為 `常數 (Constant)`，而常數的書寫方式有下列規格：
    - 字串：前後以 `單引號(')` 將字串圍住，明確表示這段資料是字串。
    - 日期：和字串同樣需要以 `單引號(')` 圍住，不過日期有著各式各樣的表達方式，例如 `'26 Jan 2010'` 或 `'10/01/26'` 等形式。
    - 數值：不使用任何符號圍住，只要直接寫在 SQL 敘述中即可。

    ::: tip 牢記的原則 1-7
    - 字串與日期的常數需要以 `單引號(')` 圍住。
    - 數值的常數不需要符號圍住 (僅寫入數值即可)。
    :::

  - #### 單字之間以半形空白或換行隔開
    SQL 敘述 在單字與單字之間需要以「半形空白」或「換行」做區隔。

    ::: tip 牢記的原則 1-8
    - 單字之間需要使用「半形空白」或「換行」做區隔。
    :::

## 1-4 建立資料表
  ::: info 學習重點
  - 建立資料表需要使用 `CREATE TABLE` 敘述
  - 資料表和欄位的名稱只能使用特定的文字
  - 欄位需要指定資料型別 ( `整數型別`、`字串型別`和`日期型別`等 )
  - 資料表可設定條件約束 ( `主鍵`、`NOT NULL` 等條件約束 )
  :::

### 資料表的內容
  |商品 |商品名稱|商品分類|販售單價|購入單價|登錄日期   |
  |----|-------|-------|------|-------|----------|
  |0001|T恤    |衣物    |1000  |500    |2009-09-20|
  |0002|打孔機  |辦公用品|500    |320    |2009-09-11|
  |0003|襯衫    |衣物   |4000   |2800   |          |
  |0004|菜刀    |廚房用品|3000   |2800   |2009-09-20|
  |0005|壓力鍋  |廚房用品|6800   |5000   |2009-01-15|
  |0006|叉子    |廚房用品|500    |       |2009-09-20|
  |0007|刨絲器  |廚房用品|880    |790    |2008-04-28|
  |0008|鋼珠筆  |辦公用品|100    |       |2009-11-11|

### 建立資料庫 (CREATE DATABASE 敘述)
  ::: warning 語法 1-1
  建立資料庫的 `CREATE DATABASE` 敘述
  ```SQL
  CREATE DATABASE <資料庫名稱>
  ```
  :::

  ::: warning 範例 1-1
  建立 `shop` 資料庫
  ```SQL
  CREATE DATABASE shop;
  ```
  :::

### 建立資料表 (CREATE TABLE 敘述)
  ::: warning 語法 1-2
  建立資料表
  ```SQL
  CREATE TABLE <資料表名稱>
  (<欄位名稱1> <資料型別> <此欄位的條件約束>,
  <欄位名稱2> <資料型別> <此欄位的條件約束>,
  <欄位名稱3> <資料型別> <此欄位的條件約束>,
  ...
  <此資料表的條件約束1>, <此資料表的條件約束2>...);
  ```
  :::

  ::: warning 範例 1-2
  建立 `Shohin` 資料表
  ```SQL
  CREATE TABLE Shohin
  (shohin_id    CHAR(4)      NOT NULL,
  shohin_name   VARCHAR(100) NOT NULL,
  shohin_catalg VARCHAR(32)  NOT NULL,
  sell_price    INTEGER      ,
  buying_price  INTEGER      ,
  reg_date      DATE         ,
  PRIMARY KEY (shohin_id));
  ```
  :::

### 命名規則
  ::: tip 牢記的原則 1-9
  - 資料庫、資料表和欄位等名稱可使用的文字，僅有下列3項。
    - 半形的英文字母
    - 半形的數字
    - 底線(_)
  :::

  ::: tip 牢記的原則 1-10
  - 名稱的第1個文字必須使用「半形的英文字母」。
    - :x: 2009_uriage
    - :o: uriage_2009
  :::

  ::: tip 牢記的原則 1-11
  - 名稱不能重複
  :::

### 指定資料型別
作用在於宣告該欄位的`資料型別`，所有的欄位都必須指定此項目。
  - #### INTEGER 型別
    - 數值型別。
    - 用來儲存整數的欄位，不能存入帶小數的數值。

  - #### CHAR 型別
    - 字串型別。
    - 用來儲存字串的欄位。
    - 採用 `固定長度字串`。
    - 可以使用 CHAR(10)、CHAR(200)之類的格式，指定欄位所能儲存字串的最大長度。各家的 RDBMS不盡相同，有些採用文字數量、有些則是位元組長度。
    - 超過該長度的字串無法存入儲存格。
    - 未達最大長度時，會在原本字串資料後面補上半形空白，補足長度，如 `CHAR(8)` => 'abc&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
  
  - #### VARCHAR 型別
    - 字串型別。
    - 用來儲存字串的欄位。
    - 採用 `可變長度字串`。
    - 未達最大長度時，不會補上半形空白，如 `VARCHAR(8)` => 'abc'

    ::: warning 專用語法：`Oracle`
    - 在 Oracle 中為 `VARCHAR2` 型別
    - (雖然 Oracle 也有名為 `VARCHAR` 的型別，不過不推薦使用)
    :::

  - #### DATE 型別
    - 日期型別。
    - 用來儲存日期 (年月日) 的欄位所指定的資料型別。

    ::: warning 專用語法：`Oracle`
    - Oracle 的 `DATE` 型別資料除了年月日之外，還包含了時分秒的時間資訊。
    :::

### 設定條件約束
  `條件約束`是在資料型別之外，對存入欄位的資料增加限制或條件的功能。
  - `NOT NULL`：用來描述此欄位 必填，不能為空值。
    ```SQL
    shohin_id CHAR(4) NOT NULL,
    shohin_name VARCHAR(100) NOT NULL,
    shohin_catalg VARCHAR(32) NOT NULL,
    ```
  - `PRIMARY KEY (<欄位名稱>)`：用來設定 主鍵條件約束。
    ```SQL
    PRIMARY KEY (shohin_id)
    ```
    主鍵(PRIMARY KEY)，可以找到資料表中特定的某1筆紀錄。如果知道該編號，便能取出特定相關資料。

## 1-5 刪除與修改資料表
  ::: info 學習重點
  - 想刪除資料表是使用 `DROP TABLE 敘述`。
  - 想增加或刪除資料表欄位是使用 `ALTER TABLE 敘述`。
  :::

### 刪除資料表 (DROP TABLE 敘述)
  ::: warning 語法 1-3
  刪除資料表
  ```SQL
  DROP TABLE <資料表名稱>;
  ```
  :::

  ::: warning 範例 1-3
  刪除 Shohin 資料表
  ```SQL
  DROP TABLE Shohin;
  ```
  :::

  ::: tip 牢記的原則 1-12
  - 被刪除的資料表無法復原！
  - 執行 DROP TABLE 之前請再三確認。
  :::

### 修改資料表結構 (ALTER TABLE 敘述)
  資料庫中已經建立好的資料表，可能一段時間之後才發現欄位不足的狀況，可以執行能修改資料表結構的 `ALTER TABLE 敘述`。

  - #### 增加欄位
    ::: warning 語法 1-4
    新增欄位
    ```SQL
    ALTER TABLE <資料表名稱> ADD COLUMN <欄位設定>;
    ```
    :::

    ::: warning 專用語法：`Oracle`、`SQL Server`
    Oracle 和 SQL Server 需要以下面的語法增加 COLUMN。
    ```SQL
    ALTER TABLE <資料表名稱> ADD <欄位設定>;
    ```
    多個欄位
    ```SQL
    ALTER TABLE <資料表名稱> ADD (<欄位設定1>, <欄位設定2>, ...);
    ```
    :::

    ::: warning 範例 1-4
    增加能存入長度 100 的可變長度字串的欄位
    - DB2、PostgreSQL、MySQL
    ```SQL
    ALTER TABLE Shohin ADD COLUMN shohin_info VARCHAR(100);
    ```
    - Oracle 可以省略 `COLUMN`。
    ```SQL
    ALTER TABLE Shohin ADD (shohin_info VARCHAR2(100));
    ```
    - SQL Server
    ```SQL
    ALTER TABLE Shohin ADD shohin_info VARCHAR(100);
    ```
    :::

  - #### 刪除欄位
    ::: warning 語法 1-5
    刪除欄位
    ```SQL
    ALTER TABLE <資料表名稱> DROP COLUMN <欄位設定>;
    ```
    :::

    ::: warning 專用語法：`Oracle`
    Oracle 可以省略 `COLUMN`。
    ```SQL
    ALTER TABLE <資料表名稱> DROP <欄位設定>;
    ```
    多個欄位
    ```SQL
    ALTER TABLE <資料表名稱> DROP (<欄位設定1>, <欄位設定2>, ...);
    ```
    :::

    ::: warning 範例 1-5
    刪除 `shohin_info` 欄位
    - SQL Server、DB2、PostgreSQL、MySQL
    ```SQL
    ALTER TABLE Shohin DROP COLUMN shohin_info;
    ```
    - Oracle
    ```SQL
    ALTER TABLE Shohin DROP (shohin_info);
    ```
    :::

  ::: tip 牢記的原則 1-13
  - 資料表結構修改之後便無法回復至原本狀態！
  - 執行 `ALTER TABLE` 之前請再三確認。
  :::

### 新增資料至資料表
  - 開頭的 `BEGIN TRANSACTION` 敘述是開始新增整批紀錄的指令敘述，
  - 最後的 `COMMIT` 敘述是確認新增這些資料。

  ::: warning 範例 1-6
  在 `Shohin` 資料表中新增資料
  - SQL Server、PostgreSQL
  ```SQL {1}
  BEGIN TRANSACTION;

  INSERT INTO Shohin VALUES ('0001', 'T恤', '衣物', 1000, 500, '2009-09-20');
  INSERT INTO Shohin VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11');
  INSERT INTO Shohin VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL);
  INSERT INTO Shohin VALUES ('0004', '菜刀', '廚房用品', 3000, 2800, '2009-09-20');
  INSERT INTO Shohin VALUES ('0005', '壓力鍋', '廚房用品', 6800, 5000, '2009-01-15');
  INSERT INTO Shohin VALUES ('0006', '叉子', '廚房用品', 500, NULL, '2009-09-20');
  INSERT INTO Shohin VALUES ('0007', '刨絲器', '廚房用品', 880, 790, '2008-04-28');
  INSERT INTO Shohin VALUES ('0008', '鋼珠筆', '辦公用品', 100, NULL, '2009-11-11');

  COMMIT;
  ```
  :::

  ::: warning 專用語法：`MySQL`、`Oracle`、`DB2`
  - MySQL
  `BEGIN TRANSACTION` 需改為
  ```SQL
  START TRANSACTION;
  ```
  - Oracle、DB2
  不需要 `BEGIN TRANSACTION`
  :::

> ### COLUMN - 資料表的更改名稱方式
>  由於標準 SQL 當中沒有 `RENAME` 的規範，所以各家 `RDBMS` 也只能自行決定語法。
>  ::: warning 範例 1-A
>  修改資料表名稱
>  - Oracle、PostgreSQL
>  ```SQL
>  ALTER TABLE Sohin RENAME TO Shohin;
>  ```
>  - DB2
>  ```SQL
>  RENAME TABLE Sohin TO Shohin;
>  ```
>  - SQL Server
>  ```SQL
>  sp_rename 'Sohin', 'Shohin';
>  ```
>  - MySQL
>  ```SQL
>  RENAME TABLE Sohin to Shohin;
>  ```
>  :::

## 自我練習
  - 1.1 請按照表 1-A 所設定的條件，撰寫出能建立 Addressbook (通訊錄) 資料表的 CREATE TABLE 敘述，不過，reg_no (登錄編號) 欄位的主鍵條件約束，不能寫在該欄位定義的後方，必須寫在其它的位置。

    表 1-A Addressbook (通訊錄)
    |欄位意義|欄位名稱     |資料型別                |條件約束        |
    |-------|-----------|-----------------------|---------------|
    |登錄編號|reg_no      |整數型別                |不能為 NULL、主鍵|
    |名字   |reg_name    |可變長度字串型別(長度為128)|不能為 NULL     |
    |地址   |reg_address |可變長度字串型別(長度為256)|不能為 NULL     |
    |電話號碼|tel_no      |固定長度字串型別(長度為10) |               |
    |電郵信箱|mail_address|固定長度字串型別(長度為20) |               |

    ::: details 練習
    ```SQL
    CREATE TABLE Addressbook
    (reg_no      INTEGER      NOT NULL,
    reg_name     VARCHAR(128) NOT NULL,
    reg_address  VARCHAR(256) NOT NULL,
    tel_no    	 CHAR(10),
    mail_address CHAR(20),
    PRIMARY KEY (reg_no));
    ```
    :::

  - 1.2 問題1.1所建立的 Addressbook 資料表，其實還漏掉了下面所示的 `post_no` (郵遞曲道) 欄位，請撰寫 SQL 敘述在 Addressbook 資料表中增加此欄位。
    - **欄位名稱：** post_no
    - **資料型別：** 固定長度字串型別(長度為8)
    - **條件約束：** 不能為 NULL

    ::: details 練習
    ```SQL
    ALTER TABLE Addressbook ADD COLUMN post_no CHAR(8) NOT NULL;
    ```
    :::

  - 1.3 請刪除 Addressbook 資料表。
    ::: details 練習
    ```SQL
    DROP TABLE Addressbook;
    ```
    :::
  
  - 1.4 請回復前面刪除的 Addressbook 資料表。
    ::: details 練習
    被刪除的資料表無法復原！
    :::
