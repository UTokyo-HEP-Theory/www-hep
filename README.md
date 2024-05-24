# 名簿

名簿は以下の3つのファイルによって管理、生成、表示されます:

- members.json: このファイルは、メンバーの情報を格納します。
- members.js: members.jsonの情報を読み込んで、名簿のhtml table をjavascriptで生成します。この処理は閲覧者のブラウザで行われます。
- members.html: members.jsを読んでテーブルを読み込み表示します。

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
        "email": "bob"
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
    - `leave`: メンバーが退グループした年と月を格納するオブジェクトです。まだ退会していない場合、このフィールドは`null`です。
- `roomNumber`: メンバーの部屋番号です。
- `email`: メンバーのメールアドレスのローカル部分です（@の前の部分）。
- `exclude`: true なら強制非表示 (通常含めない)


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