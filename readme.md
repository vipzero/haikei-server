## setup

```
cp .envrc.sample .envrc
```

## アニメ番組情報の取得

data に アニソンメタデータ設置

http://anison.info/data/download.html

```
data
├── anison.csv
├── game.csv
├── program.csv
└── sf.csv
```

### 背景画像の取得

- Google Search Engine 作成
- Google Custom Search API key 取得

参考記事: https://blog.wackwack.net/entry/2017/12/26/211044

## 使おうとして使ってない module

- spotify: アートワーク・アルバム名・(邦楽・アニソンあまり取れないため)
- musixmatch: アートワーク・アルバム名・歌詞の出だし(有料 API では FULL)
