---
title: 第 9 章 從應用程式連接資料庫
---

# 第 9 章 從應用程式連接資料庫
## 9-1 串聯資料庫和應用程式
  ::: info 學習重點
  - 實務上的資訊系統，會採用從程式發出 `SQL 敘述` 來操作資料庫的運作形式。
  - 在程式世界和資料庫世界之間，扮演中介角色的便是「 `驅動程式` 」的小零件，如果沒有它的存在將無法透過程式連上資料庫。
  - 按照各家資料庫和程式語言的搭配方式，所需的驅動程式也各有不同，若忽略此點可能無法順利連線。
  :::

### 資料庫與應用程式的關係
  在架設個人專屬的 Web 網站、或在工作上構建資訊系統的時候，無法只靠資料庫來形成完整的系統。資料庫具有儲存資料的重要功能，所以無論建構什麼樣的資訊系統，都必須使用到資料庫，不過單靠資料庫本身，無法涵蓋系統所需的所有功能。

  構建資訊系統的時候，必須以某些程式和資料庫搭配使用，這些程式可以採用各式各樣的程式語言來撰寫，目前比較具代表性的程式語言有 `Java`、`C#`、`Python` 和 `Perl` 等。

  使用這些程式語言所撰寫完成的程式稱為「 `Application Program (應用程式)` 」或簡稱「 `Application` 」。

### 驅動程式 - 2個世界的橋樑
  由於撰寫應用程式可以採用各式各樣的程式語言，其語法和功能都不盡相同，另外在資料庫這端，各家 `DBMS` 在功能和 `SQL 語法`上也會有些差異，因此，應用程式和資料庫之間傳遞 SQL 敘述和結果資料的方法，也相當紛亂而具有許多不確定的因素。

  因應上述問題而引進的解決方法，便是在 2 個世界之間安插名為「 `驅動程式 (Driver)` 」的中介程式。此 `驅動程式` 是專門設計用來連接應用程式和資料庫的小型程式，以檔案容量來說僅有數百 KB 的程度，由於驅動程式介於 2 者之間，讓 `應用程式` 和 `資料庫` 都能保持原本的狀況和發展方向，無論哪方提升版本或變更規格，只要稍微修改一下驅動程式的連接部分即能完成修正的工作。

### 驅動程式的種類
  驅動程式，在大部分的狀況之下，`DBMS` 的開發廠商等單位都會提供，而需要注意的地方，只有必須配合 `DBMS` 和 `程式語言` 選擇適用的驅動程式。進一步來說，`DBMS` 的版本為 `32位元` 或 `64位元` 的時候，可能需要使用不同的驅動程式 (`MariaDB` 的 `JDBC` 驅動程式沒有區分 32位元 或 64位元)，如果沒有使用正確的驅動程式，不僅無法傳送 `SQL 敘述`，甚至可能完全連不上資料庫。

  目前被廣泛採用的驅動程式規格有 `ODBC (Open DataBase Connectivity)` 和 `JDBC (Java DataBase Connectivity)` 等 2 類。
  `ODBC` 是 `Microsoft` 公司在 1992 年所發表的 `DBMS 連接介面規格`，之後成為業界的標準，而 `JDBC` 則是參考前者，另外彙整成 `Java` 應用程式連接資料庫的規格。

  `MariaDB` 的 `JDBC` 驅動程式稱為 `Connector/J`，可由下方的網址頁面下載取得，由於不同版本的 `MariaDB` 以及 `Java` 所對應的驅動程式版本也可能不同，請下載適用的版本。

  - MariaDB Connector/J (JDBC Driver)
    https://downloads.mariadb.org/connector-java/
    https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client/2.2.5

  本教學採用 `Java Version 8` 的開發執行環境，目前頁面上最新的「 1.5.9 」版本即可適用，點選「 `Download 1.5.9 Stable Now!` 」按鈕之後會進入該版本的下載頁面，這裡請選擇直接下載 `jar` 格式檔案，取得 `mariadb-java-client-1.5.9.jar`。

  此即為驅動程式的檔案，此檔案建議放在先前安裝 `xampp` 時 `MariaDB` 的預設路徑「 `C:\xampp\mysql` 」，在其下新建名為「 `jdbc` 」的資料夾，將先前下載的驅動程式檔案放置於此。`C:\xampp\mysql\jdbc`。

  如此便完成從程式連接至資料庫的準備工作，可以準備實際使用 `Java` 連上 `MariaDB` 了。

## 9-2 程式的基礎知識
  ::: info 學習重點
  - 若想讓 Java 程式能順利運行，在原始碼撰寫完成之後，必須先進行編譯的動作。
  - 和 SQL 敘述不同，Java 的原始碼會區分保留字的大小寫。
  :::

### 一如往例的「Hello, World」
  試著以 `Java` 語言來 `撰寫程式碼(Coding)` 並實際執行看看吧。
  先不急著連上資料庫，此程式的內容僅具有「 在畫面上顯示簡短字串 」的單純功能，而輸出的字串設定成「 `Hello, World` 」。

  - #### 撰寫原始碼，儲存成原始碼檔案
    ::: warning 範例 9-1
    在畫面上顯示簡短字串的 Java 程式
    ```java
    public class Hello{
      public static void main(String[] args){
        System.out.print("Hello, World");
      }
    }
    ```
    :::

    開啟編輯軟體，輸入上述的範例原始碼之後，儲存成檔名為「 `Hello.java` 」的檔案，並放置在如下所示的資料夾路徑：
    `C:\xampp\jsva\src`

    此資料夾實際上可以放置在任意的路徑位置，不過為了容易理解與方便取用，建議集中在 `xampp` 的資料夾之下。

### 編譯與執行程式
  將原始碼存成檔案放在資料夾之後，便完成了 `Java` 的原始碼檔案，不過此檔案無法直接運行，接下來還必須經過「 `編譯 (Compile)` 」的步驟，才能製作出可執行的 `Java` 程式檔案。`Compile`，被用來表是「 `將人員所編寫的原始碼，轉換成電腦能執行的程式碼` 」的意思。

  進行編譯的時候，需要使用到「 `javac.exe` 」這隻程式，它被包含在先前安裝完成的 `JDK` 之中，其名稱結尾的「 `c` 」為 `compile` 的縮寫。

  使用 javac.exe 的時候，必須在 `終端機(命令提示字元)` 視窗中執行指令。

  首先，為了移動至原始碼檔案所在的資料夾，請輸入下列指令，輸入完畢後按下「 `Enter` 」送出執行。
  
  cd 指令 (移動至指定的資料夾)
  ```sh
  cd C:\xampp\java\src
  ```

  - #### 以 javac 指令編譯出 class 檔案
    已經移動至指定的資料夾，再來，請在命令提示字元視窗中，輸入下列指令：

    javac 指令 (編譯程式)
    ```sh
    C:\xampp\java\jdk\bin\javac Hello.java
    ```

    > 實際上可以設定成只需輸入「 `javac` 」而省略掉資料夾路徑，這需要設定作業系統的「 `環境變數 PATH `」。

  ::: tip 牢記的原則 9-1
  若想讓 `Java` 程式能實際執行，在原始碼撰寫完成之後，必須先進行編譯的動作。
  :::

  編譯成功之後，在放置原始碼檔案的資料夾中，會產生 1 個名為「 `Hello.class` 」的新檔案，這是稱為「 `類別檔案 (Class File)` 」的 `Java 可執行檔案`。

  - #### 以 java 指令執行程式
    成為這種狀態之後，程式已經可以實際執行，而若想執行此種格式的程式，需要使用包含在「 `C:\xampp\java\jdk\bin` 」資料夾內的「 `java.exe` 」執行檔，請在命令提示字元中輸入下列指令：

    java 指令 (執行程式)
    ```sh
    C:\xampp\java\jdk\bin\java Hello
    ```

    如果命令提示字元視窗顯示「 `Hello, World` 」的訊息，代表成功執行完畢。

  如上所述，以 Java 語言撰寫程式的時候，必須按照下列的順序操作：
  1. 撰寫原始碼，儲存原始碼檔案
  2. 以 `javac` 指令進行編譯，產生類別檔案
  3. 以 `java` 指令執行類別檔案

### 常見的錯誤
  以 `Java` 撰寫原始碼的時候，初學者會有一些常犯的錯誤，這裡列出幾點，請撰寫時多加留意。

  - #### 弄錯大寫與小寫字母
    撰寫 `SQL 敘述` 時，保留字的大寫或小寫在功能上沒有分別，都能正常執行並獲得相同的結果，不過 `Java` 語言會區分英文字母的大小寫。

    ::: danger 範例 9-2
    [錯誤範例] 將大寫字母輸入成小寫字母
    ```java{3}
    public class Hello{
      public static void main(String[] args){
        system.out.print("Hello, World");
      }
    }
    ```

    執行結果
    ```java
    Hello.java:3: error: package system does not exist
                system.out.print("Hello, World");
                      ^
    1 error
    ```
    這段訊息主要在表示「 `Hello.java` 」檔案的 `第 3 行` 部分有誤。
    :::

    ::: tip 牢記的原則 9-2
    `Java` 的原始碼會區分保留字的大小寫，這是不同於 `SQL` 的差異。
    :::

  - #### 使用全形空白
    原始碼中不能使用 `全形` 的文字 (除了中文的字串資料和註解)，此規則和 `SQL 敘述` 相同，不過有時候可能會不小心把半形空白輸入成全形空白。

    ::: danger 範例 9-3
    ```java
    public class Hello{
    　  public static void main(String[] args){
            System.out.print("Hello, World");
        }
    }
    ```

    雖然看不出來全形空白，但如果將這樣的原始碼儲存成檔案，交給 `javac` 指令進行編譯，畫面上會顯示如下的錯誤訊息。

    執行結果
    ```java
    Hello.java:2: error: illegal character: '\u3000'
          public static void main(String[] args){
    ^
    1 error
    ```
    這段訊息主要在說明「 `Hello.java` 」檔案內容的第 2 行有誤，其中的「 `\u300` 」是全形空白對應的文字編碼，因為「 `使用了不能使用的文字` 」而導致無法進行編譯。
    :::
    
    ::: tip 牢記的原則 9-3
    `Java` 的原始碼中沒有 `全形文字`／`全形空白` 出場的機會 (註解除外)。
    :::

  - #### 原始碼檔案的 檔名 和 類別名稱 不一致
    如果試著把先前建立的原始碼檔案「 `Hello.java` 」直接改名為「 `Test.java` 」，再進行編譯的動作，當然編譯指令也需要改成如下的樣子。

    ::: danger 編譯
    ```sh
    C:\xampp\java\jdk\bin\javac Test.java
    ```

    不過卻出現以下的錯誤訊息。

    執行結果
    ```java
    Test.java:1: error: class Hello is public, should be declared in a file named Hello.java
    public class Hello {
           ^
    1 error
    ```

    這是因為原始碼檔案內所命名的類別名稱「 `Hello` 」，和檔案名稱的「 `Test` 」不一致而發生的錯誤。
    
    `Java` 原始碼檔案的名稱必須和其內容第 1 行的類別名稱相同。而且連英文字母的大小寫都必須相同。
    :::

  - #### 資料夾路徑或檔案名稱等輸入錯誤
    進行編譯或執行的時候，如果不小心輸入錯誤的 `資料夾名稱` 或 `指令名稱`，當然只會獲得錯誤的訊息，尤其請特別留意 `javac` 或 `java` 指令前方的資料夾名稱是否正確。

    錯把「 `bin` 」打成「 `vin` 」。

    執行 (資料夾路徑錯誤)
    ```sh
    C:\xampp\java\jdk\vin\java Hello
    ```
    執行結果
    ```sh
    系統找不到指定的路徑。
    ```

    路徑指的是一連串資料夾所構成的存放位置，因為「 `找不到指定的資料夾` 」而無法順利執行。

    或是將類別名稱「 `Hello` 」錯誤輸入成「 `Hallo` 」，也會發生錯誤：

    執行 (類別名稱錯誤)
    ```sh
    C:\xampp\java\jdk\bin\java Hallo
    ```
    執行結果
    ```sh
    錯誤：找不到或無法載入主要類別 Hallo。
    ```

    這次則是因為「 `找不到指定的類別` 」而無法順利執行。

## 9-3 利用程式連到 MariaDB
  ::: info 學習重點
  - 在 `Java` 程式中，可以透過資料庫的驅動程式執行各式各樣的 SQL 敘述。
  - 資料庫將 `SELECT 敘述` 的結果資料回傳給 `Java` 程式之後，程式需要以迴圈方式逐一處理每一行資料，這是能 1 次處理多行資料的資料庫世界，以及 1 次只能處理 1 行資料的程式世界之間的差異。
  :::

### 執行 SQL 敘述的 Java 程式
  首先所要撰寫的程式，其功能為執行「 SELECT 1 AS col_1 」這樣非常簡單的 SELECT 敘述，並且將執行的結果顯示於畫面之上。

  ::: warning 範例 9-4
  執行 SELECT 敘述 的 Java 程式
  ```java
  import java.sql.*;

  public class DBConnect1 {
    public static void main(String[] args) throws Exception {
      /* 1) 連接至 MariaDB 的資訊 */
      Connection con;
      Statement st;
      ResultSet rs;

      String url = "jdbc:mariadb://localhost:3306/mysql";
      String user = "<帳號>";
      String password = "<密碼>";

      /* 2) 載入 JDBC 驅動程式 */
      Class.forName("org.mariadb.jdbc.Driver");

      /* 3) 連接至 MariaDB */
      con = DriverManager.getConnection(url, user, password);
      st = con.createStatement();

      /* 4) 執行 SELECT 敘述 */
      rs = st.executeQuery("SELECT 1 AS col_1");

      /* 5) 將結果顯示於畫面上 */
      rs.next();
      System.out.print(rs.getInt("col_1"));

      /* 6) 關閉和 MariaDB 之間的連線 */
      rs.close();
      st.close();
      con.close();
    }
  }
  ```
  :::

### Java 如何從資料庫取得資料
  首先，原始碼的第 1 行為「 `import java.sql.*;` 」，這是為了能連上資料庫以及傳送執行 `SQL 敘述`，預先宣告匯入 `Java` 的相關必要功能，少了這行程式碼，下面所要介紹的 `Connection` 和 `Statement` 等類別將無法使用。

  ```java
  /* 1) 連接至 MariaDB 的資訊 */
  ```
  這裡宣告了連線所需的物件 (`Object`)，並且帶入 `使用者帳號` 和 `密碼` 等必要資訊，以便之後連接登入資料庫。從 `Java 程式` 連接至 `資料庫`的時候，下列 3 個物件是不可缺少的要素。
  #####  `Connection`：連線，負責連接資料庫的任務。
  ##### `Statement`：陳述，負責儲存想要執行的 SQL 敘述。
  ##### `ResultSet`：結果集合，負責儲存 SQL 敘述的執行結果。

  - 另外還宣告了 `url`、`user` 和 `password` 等 3 個字串變數，其中的 `user` 和 `password` 是用來登入資料庫的使用者帳號和密碼，而 `url` 的用途，相當於目標資料庫的「 `地址` 」，其表達方式有點類似 Web 網站的 URL，以 `斜線(/)` 區隔各項資訊。

  - 從左邊開始依序說明，「 `jdbc:mariadb://` 」的部分代表了連線的協定，表示「 `使用 JDBC 連接至 MariaDB 資料庫` 」的意思，類似網站URL的「 `http://` 」部分。

  - 「 `localhost` 」用來指定安裝著 `MariaDB` 的電腦主機或設備的網路位置，由於目前 Java 程式 和 資料庫 同在 1 部電腦上運行，所以寫著代表本機電腦的「 `localhost` 」字串，這等同於寫入「 `127.0.0.1` 」的 `IP 位址`。實際的系統或進行開發的時候，`Java 應用程式` 和 `資料庫` 分別運行於不同的電腦主機是相當常見的狀況，在這種狀況之下，此處需要改成 `資料庫` 運行設備的 `IP 位址` 或 `主機名稱`。
  
  - 「 `3306` 」的數字代表 MariaDB 所使用的 `埠號 (Port)`，而所謂的 `埠號`，相當於電腦中運行程式對外通訊用的「 `窗口` 」，換個說法，如果把 IP 位址或主機名稱比喻成住宅大樓的地址或大樓名稱，那麼 `埠號` 就相當於 各住戶單元的房號。安裝 `MariaDB` 的時候若沒有特別做變更，使用預設的 `埠號` 「 `3306` 」即可連線。

  - 「 `mysql` 」用來指定登入 `MariaDB` 之後所使用的資料庫名稱 (作用中的資料庫)。其實各家 `DBMS` 都可以在內建建立多個不同名稱的資料庫，由於 `MariaDB` 安裝後必定會產生「 `mysql` 」資料庫，用來儲存系統相關的設定。

  ```java
  /* 2) 載入 JDBC 驅動程式 */
  ```
  - 段落 2 的功用為載入 `JDBC 驅動程式`，此行程式碼表達連線時，應該使用何種驅動程式，當中的「 `org.mariadb.jdbc.Driver` 」是 `MariaDB` 的 `JDBC 驅動程式` 的 `類別名稱`。如果使用其他的 `DBMS` 或 其他的驅動程式時，需要配合修改成適當的文字。

  - 附帶一提，`MariaDB Connector/J` 的說明有提到，現在可以省略這行程式碼，實際試過註解掉也能正常執行。

  ```java
  /* 3) 連接至 MariaDB */
  ``` 
  這裡才實際使用 `URL`、`使用者帳號`、`密碼` 等資訊連上 `MariaDB`。

  ```java
  /* 4) 執行 SELECT 敘述 */
  ```
  執行 `SELECT 敘述`

  ```java
  /* 5) 將結果顯示於畫面上 */
  ```
  負責將獲得的結果顯示於畫面上

  ```java
  /* 6) 關閉和 MariaDB 之間的連線 */
  ``` 
  會 `關閉(Close)` 與 `資料庫` 之間的連線。為什麼需要這個關閉連線的動作呢？因為和資料庫建立連線之後，會消耗 2 端設備連線所需的 `記憶體容量`，若是每次操作資料庫之後都沒有關閉連線，隨著連線所造成的「 `佔用片段` 」越來越多，勢必會壓迫到記憶體的容量而引起效能上的問題。
  
### 執行連接至資料庫的程式
  編譯的指令和之前差不多，如果原始碼檔案的名稱為「 `DBConnect1.java` 」，並且存放在「 `C:\xampp\java\src` 」的資料夾之中，那麼便可在命令提示字元中執行如下的 `javac` 指令，將原始碼檔案編譯成可執行的類別檔案。

  - 編譯
    ```sh
    C:\xampp\java\jdk\bin\javac DBConnect1.java
    ```

  另外，執行此段指令之前，也需要先將當前資料夾移動至存放原始碼檔案的資料夾，否則會因為找不到原始碼檔案，而產生「 `資料夾路徑或檔案名稱等輸入錯誤` 」無法順利編譯。

  編譯成功之後，存放原始碼檔案的資料夾中會產生名為「 `DBConnect1.class` 」的新檔案，雖然同樣需要以 `java 指令` 來執行此檔案，不過此次的指令必須增加 1 個附加參數。

  - 指定 `JDBC 驅動程式` 檔案的同時執行 `Java 程式`
    ```sh
    C:\xampp\java\jdk\bin\java -cp C:\xampp\mysql\jdbc\*;. DBConnect1
    ```
    > mac 要執行
    > ```sh
    > java -cp .:/xampp/mysql/jdbc/* DBConnect1
    > ```

  此次在 java 指令和類別名稱「 `DBConnect1` 」之間，增加寫入了「 `-cp C:\xampp\mysql\jdbc\*;.` 」的文字，這是為了告知 `Java 程式`，`JDBC 驅動程式` 的檔案「 `mariadb-java-client-1.5.9.jar` 」存放於何處，「 `cp` 」是「 `類別路徑 (Classpath)` 」的縮寫，代表「` 類別檔案存放位置` 」的意思。

  「 `JDBC 驅動程式的副檔名明明是 jar 而非 class，為什麼稱之為類別路徑呢？` 」，這是因為 `jar 檔案` 其實是彙集了多個類別檔案的壓縮檔，所以也可以將類別路徑指向 `jar 檔案`。
  
  而「 `C:\xampp\mysql\jdbc\*;.` 」這段文字，代表了 「 `C:\xampp\mysql\jdbc` 」資料夾內的所有檔案，
  
  「 `*` 」星號是 Windows 系統中代替「 `任意長度字串` 」的萬用字元。
  
  「 `;` 」分號是用來隔開多個指定路徑 (mac 以「 : 」串接)，
  
  而「 `.` 」句點則代表當前的路徑，
  
  這是為了納入「 `DBConnect1.class` 」所在的資料夾路徑。

### 嘗試篩選出資料表的資料
  試著從儲存著多筆資料的資料表篩選出資料，並且顯示於畫面之上，而操作對象的範例資料表，將採用 `商品(Shohin)資料表`。

  | shohin_id | shohin_name | shohin_catalg | sell_price | buying_price | reg_date   |
  |-----------|-------------|---------------|------------|--------------|------------|
  | 0001      | T恤         | 衣物           | 1000       | 500          | 2009-09-20 |
  | 0002      | 打孔機       | 辦公用品       | 500        | 320          | 2009-09-11 |
  | 0003      | 襯衫         | 衣物          | 4000       | 2800         |            |
  | 0004      | 菜刀         | 廚房用品       | 3000       | 2800         | 2009-09-20 |
  | 0005      | 壓力鍋       | 廚房用品       | 6800       | 5000         | 2009-01-15 |
  | 0006      | 叉子         | 廚房用品       | 500        |              | 2009-09-20 |
  | 0007      | 刨絲器       | 廚房用品       | 880        | 790          | 2008-04-28 |
  | 0008      | 鋼珠筆       | 辦公用品       | 100        |              | 2009-11-11 |

  如果已經完成建立資料表和存入資料的動作，可略過 範例 9-5
  ::: warning 範例 9-5
  建立 Shohin 資料表的 SQL 敘述
  ```sql
  -- 建立 shop 資料庫
  CREATE DATABASE shop;

  -- 暫時以「 \q 」退出 MariaDB，再度從命令提示字元登入 MariaDB 並啟用 shop 資料庫，這裡需要使用安裝時指定的帳號和密碼。
  C:\xampp\mysql\bin\mysql.exe -u<帳號> -p<密碼> shop

  -- 建立 Shohin 資料表
  CREATE TABLE Shohin
  (shohin_id CHAR(4) NOT NULL,
  shohin_name VARCHAR(100) NOT NULL,
  shohin_catalg VARCHAR(32) NOT NULL,
  sell_price INTEGER,
  buying_price INTEGER,
  reg_date DATE,
  PRIMARY KEY (shohin_id));

  -- 存入商品資料
  START TRANSACTION;

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

  程式將從此資料表篩選出「 `shohin_id` 」和「 `shohin_name` 」這 2 個欄位的全部紀錄，原始碼檔案的名稱請命名為「 `DBConnect2.java` 」。

  ::: warning 範例 9-6
  從 `Shohin 資料表` 篩選出「 `shohin_id` 」和「 `shohin_name` 」這 2 個欄位的所有紀錄
  ```java
  import java.sql.*;

  public class DBConnect2 {
    public static void main(String[] args) throws Exception {
      /* 1) 連接至 MariaDB 的資訊*/
      Connection con;
      Statement st;
      ResultSet rs;

      String url = "jdbc:mariadb://localhost:3306/shop";
      String user = "<帳號>";
      String password = "<密碼>";

      /* 2) 載入 JDBC 驅動程式 */
      Class.forName("org.mariadb.jdbc.Driver");

      /* 3) 連接至 MariaDB */
      con = DriverManager.getConnection(url, user, password);
      st = con.createStatement();

      /* 4) 執行 SELECT 敘述 */
      rs = st.executeQuery("SELECT shohin_id, shohin_name FROM Shohin");

      /* 5) 將結果顯示於畫面上 */
      while(rs.next()) {
        System.out.print(rs.getString("shohin_id") + ", ");
        System.out.println(rs.getString("shohin_name"));
      }

      /* 6) 關閉和 MariaDB 之間的連線 */
      rs.close();
      st.close();
      con.close();
    }
  }
  ```

  執行結果
  ```sh
  0001, T恤
  0002, 打孔機
  0003, 襯衫
  0004, 菜刀
  0005, 壓力鍋
  0006, 叉子
  0007, 刨絲器
  0008, 鋼珠筆
  ```
  :::

  - 編譯
    ```sh
    C:\xampp\java\jdk\bin\javac DBConnect2.java
    ```

  - 執行
    ```sh
    C:\xampp\java\jdk\bin\java -cp C:\xampp\mysql\jdbc\*;. DBConnect2
    ```
    > mac 要執行
    > ```sh
    > java -cp .:/xampp/mysql/jdbc/* DBConnect2
    > ```

  
  ```java
  /* 1) 連接至 MariaDB 的資訊 */
  ```
  請注意連接資訊的 `字串 url` 最後的資料庫名稱，需要從先前的「 `mysql` 」改為「 `shop` 」，而登入帳號使用具有 shop 資料表 `權限` 的帳號即可。

  ```java
  /* 2) 載入 JDBC 驅動程式 */
  /* 3) 連接至 MariaDB */
  ```
  由於是使用相同的 `JDBC 驅動程式`，所以這部分不必做修改。

  ```java
  /* 4) 執行 SELECT 敘述 */
  ```
  `SQL 敘述`，需要改成此次執行目標的 `SELECT 敘述`。

  ```java
  /* 5) 將結果顯示於畫面上 */
  ```
  由於最後要呈現多行資料的結果，所以需要使用 `while 迴圈` 逐行取得資料，再顯示於畫面之上。

  `rs`，是名為 `ResultSet (結果集合)` 的物件，負責儲存 `SELECT 敘述`，執行之後回傳的結果，可以把它儲存資料的方式想像成 2次元表格形式。由於 `Java` 之類的一般 `程式型語言 (Procedural Language)` 基本上需要逐行處理資料，所以想要操作多行資料的時候，必須使用 `迴圈` 的功能來達成。

  「 `rs.next()` 」會將當前的讀取位置移動至下 1 行，所以「 `while(rs.next())` 」代表每輪迴圈移動到下 1 行資料的意思，如此一來就像是有個游標在結果集合中由上往下移動，而此游標亦稱為「 `指標 (cursor)` 」。

  ::: tip 牢記的原則 9-4
  在 Java 等程式的世界中，1 次僅能處理 1 行資料，而需要處理多行資料的時候，需要寫成迴圈的形式。
  :::

### 嘗試修改資料表的資料
  嘗試從 `Java 程式` 送出能修改資料的 `SQL 敘述`，改變資料表中儲存的資料，而從此次範例的目標，便能傳送能刪除商品資料表中所有資料的 `DELETE 敘述`。

  ::: warning 範例 9-7
  刪除 Shohin 資料表中所有紀錄的 Java 程式
  ```java
  import java.sql.*;

  public class DBConnect3 {
    public static void main(String[] args) throws Exception {
      /* 1) 連接至 MariaDB 的資訊*/
      Connection con;
      Statement st;

      String url = "jdbc:mariadb://localhost:3306/shop";
      String user = "<帳號>";
      String password = "<密碼>";

      /* 2) 載入 JDBC 驅動程式 */
      Class.forName("org.mariadb.jdbc.Driver");

      /* 3) 連接至 MariaDB */
      con = DriverManager.getConnection(url, user, password);
      st = con.createStatement();

      /* 4) 執行 SELECT 敘述 */
      int delcnt = st.executeUpdate("DELETE FROM Shohin");

      /* 5) 將結果顯示於畫面上 */
      System.out.print("刪除了" + delcnt + "筆紀錄");

      /* 6) 關閉和 MariaDB 之間的連線 */
      st.close();
      con.close();
    }
  }
  ```
  :::

  此段原始碼主要改變的地方，在於
   ```java
  /* 4) 執行 SELECT 敘述 */
  ```
  改為 `DELETE 敘述`，以及傳送執行 `SQL 敘述` 的指令從 `executeQuery` 改成 `executeUpdate`。無論是 INSERT 敘述或 UPDATE 敘述，從 Java 程式送出更新資料的 SQL 敘述時，需要使用 `executeUpdate` 的方法。

  由於這次不會從資料表取得資料，用不到 `ResultSet 類別` 的物件。所以原始碼刪除了相關的部分。

  - 編譯
    ```sh
    C:\xampp\java\jdk\bin\javac DBConnect3.java
    ```

  - 執行
    ```sh
    C:\xampp\java\jdk\bin\java -cp C:\xampp\mysql\jdbc\*;. DBConnect3
    ```
    > mac 要執行
    > ```sh
    > java -cp .:/xampp/mysql/jdbc/* DBConnect3
    > ```

  若最後執行成功，命令提示字元視窗中，應該會顯示「 `刪除了 8 筆紀錄` 」的訊息。而想要執行多段更新資料的 `SQL 敘述` 時，原始碼撰寫上需要注意 `交易功能控制` 的問題，不過基本做法還是相同的。附帶一提，以 `DBConnect3` 執行 `DELETE` 敘述的時候，會自動執行 `認可 (COMMIT)` 的動作。

  ::: tip 牢記的原則 9-5
  透過資料庫的驅動程式，便能從程式執行 `SELECT`、`DELETE`、`UPDATE` 和`INSERT` 敘述等所有的 `SQL 敘述`。
  :::

### 小結
  如果能完成前面所有的練習範例，之後只要修改 `段落 4` 和 `段落 5` 的部分，那麼無論多麽複雜的 `SQL 敘述` 都能透過程式來執行。
  
  在實際運作的資訊系統上，會在程式中以動態的方式組合出所需的 `SQL 敘述`，或先從 `資料庫` 篩選出資料，經過編輯之後再回存至 `資料庫` 中，還會根據複雜的商業邏輯撰寫出各種與 `資料庫` 連動的程式。

## 自我練習
  - 9.1 執行了 `DBConnect3` 之後，`Shohin 資料表` 將成為空無一物的狀態，所以這裡要再次以 `範例 1-6` 所示的 `INSERT 敘述`重新存入資料，不過需要透過 `Java 程式` 來進行，請您先撰寫出 `Java 程式` 的原始碼，再完成編譯以及執行的動作。

    ::: warning 範例 1-6
    在 `Shohin` 資料表中新增資料的 SQL 敘述 (重列)
    ```SQL
    -- DBConnect4 新增資料
    INSERT INTO Shohin VALUES ('0001', 'T恤', '衣物', 1000, 500, '2009-09-20');
    INSERT INTO Shohin VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11');
    INSERT INTO Shohin VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL);
    INSERT INTO Shohin VALUES ('0004', '菜刀', '廚房用品', 3000, 2800, '2009-09-20');
    INSERT INTO Shohin VALUES ('0005', '壓力鍋', '廚房用品', 6800, 5000, '2009-01-15');
    INSERT INTO Shohin VALUES ('0006', '叉子', '廚房用品', 500, NULL, '2009-09-20');
    INSERT INTO Shohin VALUES ('0007', '刨絲器', '廚房用品', 880, 790, '2008-04-28');
    INSERT INTO Shohin VALUES ('0008', '鋼珠筆', '辦公用品', 100, NULL, '2009-11-11');
    ```
    :::

    ::: details 練習
    ```java
    import java.sql.*;

    public class DBConnect4 {
      public static void main(String[] args) throws Exception {
        /* 1) 連接至 MariaDB 的資訊 */
        Connection con;
        Statement st;

        String url = "jdbc:mariadb://localhost:3306/shop";
        String user = "<帳號>";
        String password = "<密碼>";

        /* 2) 載入 JDBC 驅動程式 */
        Class.forName("org.mariadb.jdbc.Driver");

        /* 3) 連接至 MariaDB */
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();

        /* 4) 執行 SELECT 敘述 */
        st.executeUpdate("INSERT INTO Shohin VALUES ('0001', 'T恤', '衣物', 1000, 500, '2009-09-20');");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0002', '打孔機', '辦公用品', 500, 320, '2009-09-11');");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0003', '襯衫', '衣物', 4000, 2800, NULL);");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0004', '菜刀', '廚房用品', 3000, 2800, '2009-09-20');");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0005', '壓力鍋', '廚房用品', 6800, 5000, '2009-01-15');");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0006', '叉子', '廚房用品', 500, NULL, '2009-09-20');");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0007', '刨絲器', '廚房用品', 880, 790, '2008-04-28');");
        st.executeUpdate("INSERT INTO Shohin VALUES ('0008', '鋼珠筆', '辦公用品', 100, NULL, '2009-11-11');");

        /* 5) 將結果顯示於畫面上 */
        System.out.print("新增了所有紀錄");

        /* 6) 關閉和 MariaDB 之間的連線 */
        st.close();
        con.close();
      }
    }

    ```
    :::

  - 9.2 對於問題 9.1 所重新存入的資料，請試著修改其中的部分內容，如下所示將商品「 T恤 」的名稱改為「 `Polo 衫` 」。

    - 修改前
      | shohin_id | shohin_name | shohin_catalg | sell_price | buying_price | reg_date   |
      |-----------|-------------|---------------|------------|--------------|------------|
      | 0001      | T恤         | 衣物           | 1000       | 500          | 2009-09-20 |

    - 修改後
      | shohin_id | shohin_name | shohin_catalg | sell_price | buying_price | reg_date   |
      |-----------|-------------|---------------|------------|--------------|------------|
      | 0001      | Polo 衫     | 衣物           | 1000       | 500          | 2009-09-20 |

    請您撰寫出完成此修改動作的 Java 程式原始碼，並且完成編譯以及執行的動作。

    ::: details 練習
    ```java
    import java.sql.*;

    public class DBConnect5 {
      public static void main(String[] args) throws Exception {
        /* 1) 連接至 MariaDB 的資訊 */
        Connection con;
        Statement st;

        String url = "jdbc:mariadb://localhost:3306/shop";
        String user = "<帳號>";
        String password = "<密碼>";

        /* 2) 載入 JDBC 驅動程式 */
        Class.forName("org.mariadb.jdbc.Driver");

        /* 3) 連接至 MariaDB */
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();

        /* 4) 執行 SELECT 敘述 */
        st.executeUpdate("UPDATE Shohin SET shohin_name = 'Polo 衫' WHERE shohin_name = 'T恤';");

        /* 5) 將結果顯示於畫面上 */
        System.out.println("資料已變更為 Polo 衫");

        /* 6) 關閉和 MariaDB 之間的連線 */
        st.close();
        con.close();
      }
    }
    ```
    :::