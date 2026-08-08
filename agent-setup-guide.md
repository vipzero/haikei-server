# haikei-server イベントセットアップ手順書 (Agent 向け)

## 概要

新しいイベント (例: 2026obon, 2026winter 等) のセットアップを自動化するための手順書。

## EVENT_ID 命名規則

### パターン

形式は `{年}{季節・時期}`。

| 季節キー | 意味             | 時期            |
| -------- | ---------------- | --------------- |
| `gw`     | ゴールデンウィーク | 4 月下旬〜5 月上旬 |
| `obon`   | お盆             | 8 月中旬        |
| `winter` | 冬               | 12 月下旬〜1 月上旬 |

例: `2023gw`, `2023obon`, `2023winter`, `2025gw`, `2026obon`

### 時期判定ロジック

- **4 月 20 日〜5 月 10 日**: `{年}gw`
- **8 月 1 日〜8 月 31 日**: `{年}obon`
- **12 月 20 日〜1 月 10 日**: `{年}winter`
- **その他**: 最も近い時期を提案するか、ユーザーに指定してもらう

```typescript
function suggestEventId(currentDate: Date): string {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1 // 0-indexed
  const day = currentDate.getDate()

  // ゴールデンウィーク (4/20-5/10)
  if ((month === 4 && day >= 20) || (month === 5 && day <= 10)) {
    return `${year}gw`
  }

  // お盆 (8/1-8/31)
  if (month === 8) {
    return `${year}obon`
  }

  // 冬期 (12/20-翌年1/10)
  if ((month === 12 && day >= 20) || (month === 1 && day <= 10)) {
    return `${year}winter`
  }

  // その他の場合は最も近い時期を提案
  if (month < 4) return `${year}gw`
  if (month < 8) return `${year}obon`
  if (month < 12) return `${year}winter`
  return `${year}winter`
}
```

## 前提条件

- ワークスペース: このリポジトリ (`haikei-server`) のルート
- 必要ファイル: `.envrc`, `maintanace-flow.md`, `readme.md`
- 実行環境: macOS / WSL (zsh, bash)
- 環境変数の読み込み: `direnv` があれば `direnv allow`。無い環境 (WSL 等) では `source .envrc` してから yarn を叩く

## セットアップ手順

### 0. EVENT_ID 決定 (事前確認)

**必須**: セットアップ実行前に EVENT_ID を確認・決定する。

1. 実行時の日付を確認する
2. `suggestEventId()` の判定に沿って推奨 EVENT_ID を提示する
3. 現在設定されている EVENT_ID (`.envrc`) と並べてユーザーに確認する

```
現在時刻: {実行時の日付}
現在のEVENT_ID: {.envrc の値}
推奨EVENT_ID: {時期に基づく推奨値}

質問: このEVENT_IDで進めますか？
- はい → 推奨EVENT_IDで続行
- いいえ → 使用したいEVENT_IDを指定してください
```

### 1. 現在の設定確認

```bash
yarn ps
```

現在の EVENT_ID と設定状況を確認する。

### 2. EVENT_ID 変更

`.envrc` の該当行を書き換える。過去分はコメントとして残す。

```bash
# イベントのID
# export EVENT_ID="2025winter"
# export EVENT_ID="2026gw"
export EVENT_ID="2026obon"
```

### 3. 環境変数再読み込み

```bash
direnv allow          # direnv がある環境
source .envrc         # direnv が無い環境 (WSL 等)
```

### 4. イベントセットアップ実行

```bash
yarn setup
```

- Firestore の `hist` / `song` / `vote` に EVENT_ID のドキュメントを作成
- 登録済みの場合は `{EVENT_ID} は登録済み` と出て何もしない (冪等)

### 5. アニソンデータベース更新

```bash
yarn setup:anison
```

- anison.info から `program.csv`, `anison.csv`, `sf.csv`, `game.csv` をダウンロードして `data/` へ配置

### 6. セットアップ完了確認

```bash
yarn ps
```

## 確認項目

- [ ] EVENT_ID が新しいイベント ID に変更されている
- [ ] アニソンデータが最新日付になっている
- [ ] Firestore 接続が正常
- [ ] playing: 空 (新イベントのため)
- [ ] words: 0 (新イベントのため)

## エラーハンドリング

- `direnv: error .envrc is blocked` → `direnv allow` を実行
- `direnv: command not found` → `source .envrc` に切り替える (WSL には direnv が入っていない)
- **anison.info が 403** → wget のデフォルト UA が弾かれている。`scripts/updateAnisonDb.mjs` はブラウザの UA を送るようにしてある
- **anison.info が 404** → 配布 zip 自体がサーバー側から消えている。こちらから打てる手は無いので、時間を置いて再実行する。`data/*.csv` は前回分が残るのでイベント開始自体はブロックされない
- Firestore 接続エラー → `SERVICE_ACCOUNT_FILE_PATH` の指すサービスアカウントファイルを確認

## 次のステップ (手動作業)

1. **フロントエンド設定**

   - rekka-haikei の `src/config/index.ts` を更新
   - 新イベント追加
   - 終了時間指定

2. **サーバー起動**
   - `yarn start`
   - `yarn osiris` (ログ保険)

## 想定実行時間

- 全体: 約 3-5 分
- `yarn setup`: 約 2-3 秒
- `yarn setup:anison`: 約 60-90 秒 (ダウンロード時間による)

## 注意事項

- 必ず `yarn ps` で現在の状況確認から開始する
- EVENT_ID 変更時は正確な文字列置換を行う
- アニソンデータダウンロードは anison.info の状態に依存する
- セットアップ完了後は必ず確認コマンドを実行する

## ファイル構造参考

```
haikei-server/
├── .envrc                # 環境変数設定
├── maintanace-flow.md    # メンテナンス手順
├── agent-setup-guide.md  # 本ファイル
└── data/                 # アニソンデータ
    ├── anison.csv
    ├── program.csv
    ├── game.csv
    └── sf.csv
```
