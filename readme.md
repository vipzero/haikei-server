- [フロントエンド vipzero/rekka-haikei](https://github.com/vipzero/rekka-haikei)
- [運用コストメモ](https://github.com/vipzero/haikei-server/wiki/運用メモ)

## Agent向けセットアップガイド

新しいイベント（2025obon、2025winter等）の自動セットアップには `agent-setup-guide.md` を参照してください。  
現在時刻からEVENT_IDを自動提案し、Firestore初期化からアニソンDB更新まで一連の作業を効率化します。  
手動セットアップの場合は以下の従来手順をご利用ください。

## setup

```
cp .envrc.sample .envrc

# 設定状況などの確認
yarn ps
```

## 実行

```
# esbuildを使う版
yarn start

# ts-nodeを使う版
# yarn start:ts-node
```

![haikei-server admin terminal](./ss.png)

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

### ここまでの全体履歴の保存

```
node script/importHistory.js
yarn get_history
```

### アルバム情報の取得

iTunes API (認証なし)

小さいアートワーク・アルバム名・copyright

## 使おうとして使ってない module

- spotify: アートワーク・アルバム名・(邦楽・アニソンあまり取れないため)
- musixmatch: アートワーク・アルバム名・歌詞の出だし(有料 API では FULL)

調整・アルゴリズム関係

## 画像検索文字列の生成部分

方針

- 関連性のあるものが出るように
- meme やキャプ画像が出るように
- 平凡な公式タイトル画像以外が出るように

コード

https://github.com/vipzero/haikei-server/blob/main/src/utils/makeSearchWord.ts

## 画像選択

imagemin などで Optimize 後のメタデータで  
ソートして上から 3 つ

コード

https://github.com/vipzero/haikei-server/blob/main/src/imageIo/uploadManage.ts

## メンテフロー

[./maintanace-flow.md](./maintanace-flow.md)

## 誕生日

[./birthday.md](./birthday.md)

## `yarn osiris`

実行されるファイル `script/osiris-logger.ts`

icy のログだけを取るスクリプト
リカバリーのため並行して動かしておくと良い
