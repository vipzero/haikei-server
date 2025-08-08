# haikei-server イベントセットアップ手順書 (Agent 向け)

## 概要

新しいイベント（例：2025obon, 2025winter 等）のセットアップを自動化するための手順書

## EVENT_ID 命名規則と現在時刻からの提案

### イベント ID パターン

- **形式**: `{年}｛季節・時期｝`
- \*## 注意事項

- 必ず`yarn ps`で現在の状況確認から開始
- EVENT_ID 変更時は正確な文字列置換を行う
- アニソンデータダウンロードはネットワーク環境に依存
- セットアップ完了後は必ず確認コマンドを実行

## Agent 実装例

### EVENT_ID 自動提案関数

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

### 実行時確認プロセス

1. 現在日時を取得
2. suggestEventId()で推奨 EVENT_ID を生成
3. ユーザーに確認
4. 確認後にセットアップ手順を実行

- `2023gw` (ゴールデンウィーク)
- `2023obon` (お盆)
- `2023winter` (冬)
- `2025gw` (ゴールデンウィーク)

### 季節・時期の対応

- **gw**: ゴールデンウィーク (4 月下旬〜5 月上旬)
- **obon**: お盆 (8 月中旬)
- **winter**: 冬 (12 月下旬〜1 月上旬)

### 現在時刻からの自動提案

**現在日時**: 2025 年 8 月 8 日

**推奨 EVENT_ID**: `2025obon`

- 理由: 8 月 8 日はお盆の時期（8 月中旬）に該当
- お盆イベントとして適切

### 時期判定ロジック

- **4 月 20 日〜5 月 10 日**: `{年}gw` (ゴールデンウィーク)
- **8 月 1 日〜8 月 31 日**: `{年}obon` (お盆)
- **12 月 20 日〜1 月 10 日**: `{年}winter` (冬期)
- **その他**: 最も近い時期を提案 or ユーザー指定

### 2025 年の特徴

- **2025obon**: お盆イベント（8 月中旬開催）
- 前回: 2025gw（ゴールデンウィーク）
- 次回: 2025winter（予定）

### EVENT_ID 確認ダイアログ

セットアップ実行前に以下を確認：

1. **現在時刻**: 2025 年 8 月 8 日
2. **推奨 EVENT_ID**: 2025obon
3. **確認事項**:
   - この EVENT_ID で正しいですか？
   - 別の EVENT_ID を使用する場合は指定してください
   - 既存のイベント（2025gw 等）から変更する場合は事前確認

## 前提条件

- ワークスペース: `/haikei-server`
- 必要ファイル: `.envrc`, `maintanace-flow.md`, `readme.md`
- 実行環境: macOS, zsh

## セットアップ手順

### 0. EVENT_ID 決定（事前確認）

**必須**: セットアップ実行前に EVENT_ID を確認・決定する

1. **現在時刻の確認**

   - 実行時の日付を確認
   - 季節・時期に基づいた推奨 EVENT_ID を提示

2. **EVENT_ID 決定プロセス**

   ```
   現在時刻: {実行時の日付}
   推奨EVENT_ID: {時期に基づく推奨値}

   質問: このEVENT_IDで進めますか？
   - はい → 推奨EVENT_IDで続行
   - いいえ → 使用したいEVENT_IDを指定してください
   ```

3. **既存イベントからの変更確認**
   - 現在設定されている EVENT_ID を表示
   - 変更の影響を説明
   - 確認後に手順 1 へ進む

### 1. 現在の設定確認

```bash
yarn ps
```

現在の EVENT_ID と設定状況を確認

### 2. EVENT_ID 変更

`.envrc`ファイルの以下の行を変更：

```bash
# 変更前
export EVENT_ID="現在のイベントID"

# 変更後
export EVENT_ID="新しいイベントID"
```

**重要**: `replace_string_in_file`ツールを使用し、以下の形式で置換：

```
# イベントのID
# export EVENT_ID="2023obon"
export EVENT_ID="新しいイベントID"
```

### 3. 環境変数再読み込み

```bash
direnv allow
```

※ direnv エラーが出た場合は先に`direnv allow`を実行

### 4. イベントセットアップ実行

```bash
yarn setup
```

- Firestore に新しいイベントを追加
- 初期データ作成

### 5. アニソンデータベース更新

```bash
yarn setup:anison
```

- anison.info から最新データをダウンロード
- program.csv, anison.csv, game.csv, sf.csv を更新

### 6. セットアップ完了確認

```bash
yarn ps
```

## 確認項目

- [ ] EVENT_ID が新しいイベント ID に変更されている
- [ ] アニソンデータが最新日付になっている
- [ ] Firestore 接続が正常
- [ ] playing: 空（新イベントのため）
- [ ] words: 0（新イベントのため）

## エラーハンドリング

- `direnv: error .envrc is blocked` → `direnv allow`実行
- アニソンデータダウンロード失敗 → ネットワーク確認後再実行
- Firestore 接続エラー → サービスアカウントファイル確認

## 次のステップ（手動作業）

1. **フロントエンド設定**

   - rekka-haikei の `src/config/index.ts` 更新
   - 新イベント追加
   - 終了時間指定

2. **サーバー起動**
   - `yarn start`
   - `yarn osiris`（ログ保険）

## 想定実行時間

- 全体：約 3-5 分
- yarn setup：約 2-3 秒
- yarn setup:anison：約 60-90 秒（ダウンロード時間による）

## 注意事項

- 必ず`yarn ps`で現在の状況確認から開始
- EVENT_ID 変更時は正確な文字列置換を行う
- アニソンデータダウンロードはネットワーク環境に依存
- セットアップ完了後は必ず確認コマンドを実行

## ファイル構造参考

```
/haikei-server/
├── .envrc                 # 環境変数設定
├── maintanace-flow.md    # メンテナンス手順
├── agent-setup-guide.md  # 本ファイル
└── data/                 # アニソンデータ
    ├── anison.csv
    ├── program.csv
    ├── game.csv
    └── sf.csv
```
