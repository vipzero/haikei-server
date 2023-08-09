## メンテフロー

### Event 作成

```
$ vi .envrc EVENT_ID
EVENT_ID=xxxxxx
$ yarn setup			 		# EVENT_ID から動作
$ yarn setup:anison
$ yarn ps 					# 確認
```

```mermaid
sequenceDiagram

participant you_ as You
participant envB as BackEnd環境設定
participant appB as haikei-server
participant fbdb as Firestore
participant andb as AnisonDb

you_ ->> envB : .envrc EVENT_ID 更新
you_ ->> appB : yarn setup
envB ->> appB : EVENT_ID
appB ->> fbdb : event 追加
```

```mermaid
sequenceDiagram

participant you_ as You
participant envB as BackEnd環境設定 data/*.csv
participant appB as haikei-server
participant andb as AnisonDb

you_ ->> appB : yarn setup:anison
appB ->> andb : get
andb ->> envB : 同期
```

### FrontEnd のセットアップ

rekka-haikei の `src/config/index.ts`

- イベント追加 `xxxxxx`
- 終了時間指定

### サーバー起動

```
yarn start
yarn osiris   # 保険のicyログ
```

```mermaid

sequenceDiagram

participant you_ as You
participant appB as haikei-server
participant fbhi as Firestore/hist
participant fbco as Firestore/counts
participant strm as Stream

you_ ->> appB : yarn start
appB ->> fbhi : get [eventId]
fbhi ->> appB : lastSong
appB ->> fbco : get [eventId]
fbco ->> appB : all cache

appB ->> strm : subscribe

```

### 動作中

```mermaid

sequenceDiagram

participant strm as Stream
participant appB as haikei-server
participant fbhi as Firestore/hist
participant fbso as Firestore/song
participant fbco as Firestore/counts


strm ->> appB : icy
appB ->> appB : 解析
appB ->> fbhi : update
appB ->> fbso : push
appB ->> fbco : update

```

### 終了

アーカイブする。
イベント中の履歴は Firestore からロードするが、アーカイブ後は履歴を Cloud Storage からダウンロードするようになる。

```$$ $$
yarn close:archive {event_ia}
```
