# 編集のやり方 
このwebsite はGit と Githubで管理します。更新はgit pushによって行う。

参考: [サル先生](https://backlog.com/ja/git-tutorial/)

## git clone

`git clone`は、既存のリポジトリを複製するためのコマンドです。これにより、リモートリポジトリの全てのファイル、履歴、ブランチがあなたのローカルマシンにコピーされます。

`git clone`の基本的な使用方法は以下の通りです：

```bash
git clone <リポジトリのURL>
```

<リポジトリのURL>はgithub のリポジトリのページに行って、`Code` と書いてある緑色のボタンを押すと(2024年現在)出てきます。

このコマンドを実行すると、現在のディレクトリに新しいディレクトリ（デフォルトではリポジトリ名と同じ名前）が作成され、その中にリポジトリの内容がコピーされます。これにより、あなたはローカルでプロジェクトを開く、編集する、テストすることができます。

## Python3を使用したローカルサーバーの立て方
ローカルでファイルを変更したら、**http ローカルサーバーを建てて**htmlを表示します。
**ローカルにあるhtmlファイルを直接ブラウザで開いてもうまく表示されません**

Python3には組み込みのHTTPサーバーがあります。これを使用してローカルサーバーを立てるには、ターミナルを開き、サーバーを立てたいディレクトリに移動します。その後、以下のコマンドを実行します：

```bash
python3 -m http.server
```

この場合、サーバーはポート8000で起動します。ブラウザでhttp://localhost:8000 にアクセスすると、サーバーの内容を見ることができます。


## git add, commit, pushの使い方

ローカルで編集したらgithubに上げるために以下のようにします。

### git add

`git add`は、変更したファイルをステージングエリアに追加するためのコマンドです。これにより、次の`git commit`でこれらの変更が保存されます。

```bash
git add <ファイル名>
```

全ての変更をステージングエリアに追加するには以下のコマンドを使用します：
```bash
git add .
```

### git commit
git commitは、ステージングエリアに追加された変更を新しいコミットとして保存するためのコマンドです。

```bash
git commit -m "コミットメッセージ"
```

ここで、"コミットメッセージ"は、このコミットで行われた変更を説明する短いメッセージです。

### git push
git pushは、ローカルリポジトリのコミットをリモートリポジトリにアップロードするためのコマンドです。

```bash
git push origin main
```
ここで、"main"は、変更をプッシュするブランチの名前です。
(ブランチを切りはじめると後の人がわからなくなるのでmain一本推奨で。)

#　フォルダの構造

2024年9月12日現在

```text
./                    # プロジェクトのルートディレクトリ
├── README.md         # プロジェクトの説明書
├── favicon.ico       # ウェブサイトのファビコン
├── index.html        # メインのHTMLファイル(ブラウザの設定言語を検出して対応する言語のフォルダに送るだけです。)
│
├── css/              # スタイルシートを格納するディレクトリ
│   └── styles.css    # メインのスタイルシート
│
├── data/             # データファイルを格納するディレクトリ
│   ├── postdocs.json # ポスドクの情報を格納するJSONファイル
│   ├── staffs.json   # スタッフの情報を格納するJSONファイル
│   └── students.json # 学生の情報を格納するJSONファイル
│
├── en/               # 英語版のHTMLファイルを格納するディレクトリ
│   ├── footer.html          # 英語版のフッタ
│   ├── header.html          # 英語版のヘッダ
│   ├── index.html           # 英語版のメインページ
│   ├── members.html         # メンバー一覧ページ（英語版）
│   └── transportation.html  # 英語版の交通案内ページ
│
├── ja/               # 日本語版のHTMLファイルを格納するディレクトリ
│   ├── header.html          # 日本語版のヘッダ
│   ├── footer.html          # 日本語版のフッタ
│   ├── index.html           # 日本語版のメインページ
│   ├── members.html         # メンバー一覧ページ（日本語版）
│   └── transportation.html  # 日本語版の交通案内ページ
│
└── js/               # JavaScriptファイルを格納するディレクトリ
    ├── loadFooter.js        # フッタを読み込むためのスクリプト
    ├── loadHeader.js        # ヘッダを読み込むためのスクリプト
    ├── members_en.js        # 英語版メンバー一覧のスクリプト
    └── members_ja.js        # 日本語版メンバー一覧のスクリプト
```

**注意** loadHeader.js の中に言語切り替えボタンを生成するscriptが入っています。そのscriptは "すべてのhtmlは(/index.html以外は) /ja/ または /en/ の両方にそれぞれの言語版がに入っていることを前提にしているので、*片方の言語にしか対応しないつもりでも、もう片方には同じ名前のhtmlを作って対応しない旨を書いてください。*

# 名簿

名簿のデータは`data`フォルダに格納されています。
`data`フォルダには`json`形式のファイルたち`staffs.json`,`postdocs.json`,`students.json`があり、この順で読まれます。各ファイルの中では上から順に並びます。

このデータは以下の2つのファイルによって処理されて表に変換されます:
- `members.js`: `data`フォルダの情報を読み込んで、名簿のhtml table をjavascriptで生成します。この処理は閲覧者のブラウザで行われます。
- `members.html`: `members.js`を呼んでテーブルを読み込み表示します。

名簿の更新は*members.jsonを編集する*ことによって行います。
自分が何をやっているかわかっていない限り、**members.jsやmembers.htmlを編集しないでください**。

## JSONレコードの例

学生(留年や飛び級なし)の例
```json
{
    "name": {
        "lastName": "Yamada",
        "firstName": "Taro",
        "lastNameJapanese": "山田",
        "firstNameJapanese": "太郎"
    },
    "position": null,
    "period": {
        "join": {
            "year": 2020,
            "month": 4
        },
        "leave": null
    },
    "roomNumber": "911",
    "email": "taro"
},
```
(`position: null`)に注意してください。


任期の決まっているポスドクの例
```json
{
        "name": {
            "lastName": "Smith",
            "firstName": "Bob",
            "lastNameJapanese": "スミス",
            "firstNameJapanese": "ボブ"
        },
        "position": 
            {"english": "PD",
             "japanese": "PD"
            },
        "period": {
            "join": {
                "year": 2024,
                "month": 4
            },
            "leave": {
                "year": 2027,
                "month": 9
            }
            },
        "roomNumber": "912",
        "email": "bob",
        "websites" : ["https://google.com","https://yahoo.com"]
    }
```

留年やM3の場合
```json
{
    "name": {
        "lastName": "Exception",
        "firstName": "John",
        "lastNameJapanese": "例外",
        "firstNameJapanese": "事例"
    },
    "position": {
        "english": "M3",
        "japanese": "M3",
    },
    "period": {
        "join": {
            "year": 2020,
            "month": 4
        },
        "leave": null
    },
    "roomNumber": "911",
    "email": "exc"
}
```

通常より長く在籍する学生(それ以外の留年等の事情はなし)
```json
{
    "name": {
        "lastName": "additional",
        "firstName": "years",
        "lastNameJapanese": "D4とか",
        "firstNameJapanese": "の場合"
    },
    "position": null,
    "period": {
        "join": {
            "year": 2020,
            "month": 4
        },
        "leave": {
            "year": 2026,
            "month": 4
        },
    },
    "roomNumber": "911",
    "email": "d4"
}
```

## フィールドの説明
各メンバーは以下のフィールドを持ちます：

- `name`: 名前に関する情報を格納するオブジェクトです。
    - `lastName`: 英語の姓です。
    - `firstName`: 英語の名前です。
    - `lastNameJapanese`: 日本語の姓です。
    - `firstNameJapanese`: 日本語の名前です。
- `position`: メンバーの役職に関する情報を格納するオブジェクトです。**ただし、学生であり留年等の事情がない場合は`null`を指定してください。**
  - `english`: 英語の役職名です。
  - `japanese`: 日本語の役職名です。
- `period`: メンバーの在籍期間に関する情報を格納するオブジェクトです。
    - `join`: メンバーが加入した年と月を格納するオブジェクトです。
        - `year`: 加入した年です。
        - `month`: 加入した月です。
    - `leave`: メンバーが退グループした年と月を格納するオブジェクトです。まだ退会していない場合、このフィールドは`null`です。例えば2030年3月と指定しておくと2030年4月1日に非表示に切り替わります。
- `roomNumber`: メンバーの部屋番号です。
- `phone`: メンバーの電話番号です。教授, 准教授, 秘書以外は*部屋番号から生成するので入力しないでください。*
- `email`: メンバーのメールアドレスのローカル部分です（@の前の部分）。
- `email_domain`: (通常省略) メンバーのメールアドレスのドメイン部分です（@の後の部分）。"hep-th.phys.s.u-tokyo.ac.jp"の場合は省略してください。
- `websites`: メンバーのwebsiteを配列で指定します。(例: ["https://googl.com","https://yahoo.com"])。ない場合は書かないか、null。
- `exclude`: true なら強制非表示 (通常レコードに含めない)

## 電話番号の変更の仕方
- 教授, 准教授, 秘書: `staffs.json` の `phone` fieldを直接書き換えてください。
- それ以外: `members_ja.js` と `members_en.js` の先頭に以下のように部屋番号と電話番号の対応が書かれているので、それを変更してください。

```javascript
    // phone number for each room 
    const roomPhoneNumbers = {
        911: 4137,
        920: 4139,
        921: 4138
    };
```

## 学年の計算方法

`position`が`null`である場合、学生であるという意味になって、
以下の方法で学年が(閲覧者のブラウザによって)計算されます。

学年は、メンバーが加入した年月と現在の年月を基に計算されます。具体的な計算方法は以下の通りです：

1. 現在の年から加入年を引き、その差を学年とします。
2. 現在の月が加入月より前である場合、学年から1を引きます。これは、新学年が始まる4月を考慮したものです。

例えば、メンバーが2020年4月に加入し、現在が2024年3月での場合、学年は`2022 - 2010 = 4`ですが、現在の月（3月）が加入月（4月）より前なので、学年から1を引き、最終的な学年は3となります。表示は、この方法で計算された数値を以下のように変換して行われます
- 1 → `M1`
- 2 → `M2`
- 3 → `D1` 
- 4 → `D2` 
- 5 → `D3` 
- 6 → `D4`

**注意** : 以下に述べるように、通常は(`leave: null`なら) D4以上は(卒業していると仮定して)自動的に非表示になります。卒業できなくてまだ在籍している場合は、別途`leave` fieldを設定してください。卒業するタイミングは決まっていないでしょうが、適当に(長めに)設定して無事卒業できたら修正してください。


### 例外処理
留年等の理由により上記の計算が適切でない場合は、`position` fieldに直接学年を上の例のように書き込んでください。この値は毎年手で更新する必要があります。

## 非表示処理
以下の場合には当該レコードを非表示にします

- `leave` フィールドが現在より過去の月を示している (year: 2025, month:9 なら2025年9月まで表示、10月以降非表示)
- `leave` フィールドが`null`で、`position`が`null`で、学年が`6` (`D3`) 以上である。

上記以外の理由で非表示にする必要がある場合は `exclude: true` を指定してください。

## デバッグ用日付調整クエリパラメータ
デバッグ用に、javascriptに渡される"現在の日付”を変更できます。これにはurlにクエリパラメータをつけます。
localhost:8000でホストしているなら、
`http://localhost:8000/members.html?date=2022-12-31` のようにします。 

*注意:現在の仕様では本番環境でもクエリパラメーターが使えてしまいます。どっちにしろ非表示になっているレコードもjsonを取得された時点で見えるので、情報保護の観点からはより悪くはなってないと思います。

# 参照用旧サイト
英語: https://www-hep.phys.s.u-tokyo.ac.jp/english/noframe.shtml
すごい古い日本語: https://www-hep.phys.s.u-tokyo.ac.jp/japanese/