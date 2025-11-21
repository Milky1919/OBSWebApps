# 機能追加・新規アプリ作成 指示書：YouTubeコメントビューワー

## 1. アプリ概要 (App Overview)

*   **アプリ名 (Name)**: YouTube Comment Viewer (カスタムコメント表示)
*   **ID (Folder Name)**: `youtube-chat` (英数字とハイフンのみ推奨)
*   **目的 (Purpose)**: 配信画面にオーバーレイ表示するため、高自由度なデザインとアニメーション設定が可能なコメントビューワーを提供する。

## 2. 機能要件 (Functional Requirements)

### 2.1. コア機能 (Core Features)

*   [ ] **ライブID入力**: 設定UIでYouTubeのライブ配信ID（Video ID）を手入力する機能。
*   [ ] **コメント取得**: 入力されたIDに基づき、YouTube Live Chat APIを使用してコメントをリアルタイムで取得する。
    *   **備考**: API連携は技術的複雑性が高いため、最初は「テストコメント」の表示機能に限定し、コメント取得機能は後続フェーズとする（ただし、コメントオブジェクトのデータ構造は確定させる）。
*   [ ] **リアルタイムプレビュー**: 設定UIの変更が、iframe内のプレビュー領域に即座に反映されること（アニメーションの動きも含む）。
*   [ ] **URL生成**: 現在の設定を反映したパラメーター付きURLを生成し、ユーザーがコピーできるようにすること。

### 2.2. 設定機能 (Configuration Features)

以下の項目を設定可能とし、すべてURLパラメーターでビューワーに渡すこと。

|  |
|  |

| カテゴリ | 設定項目           | 入力/選択肢                                           | パラメーター名                   | 備考                      |
| ---- | -------------- | ------------------------------------------------ | ------------------------- | ----------------------- |
| 接続   | ライブID          | テキスト入力 (必須)                                      | id                        |                         |
| 表示   | 最大表示行数         | 数値入力 (5〜20行)                                     | maxlines                  |                         |
| 表示   | 表示形式 (積み上げ方向)  | ドロップダウン (下から上 / 上から下)                            | flow (bottom-up/top-down) |                         |
| 表示   | ユーザー名の表示       | トグルスイッチ (ON/OFF)                                 | showname (on/off)         |                         |
| 表示   | アバターの表示        | トグルスイッチ (ON/OFF)                                 | showavatar (on/off)       | 追加: ユーザーのアバター画像表示制御     |
| デザイン | テンプレート選択       | ドロップダウン (8種類以上、後述)                               | theme (style1〜style8など)   |                         |
| デザイン | フォントの種類        | テキスト入力 (PCインストールフォント)                            | font                      |                         |
| デザイン | フォントサイズ        | 数値 + 単位 (px/vw/em)                               | fontsize                  |                         |
| デザイン | ユーザー名フォントサイズ   | 数値 + 単位 (px/em)                                  | namefontsize              | 追加: ユーザー名とコメント本文のサイズ分離  |
| デザイン | コメントの最大幅       | 数値 + 単位 (px/%/vw)                                | maxwidth                  | 追加: コメントエリア自体の幅を制御      |
| デザイン | コメントブロックのパディング | 数値 + 単位 (px/em)                                  | padding                   | 追加: コメント内の余白            |
| デザイン | コメントの文字色       | カラーピッカー/テキスト入力 (#RRGGBB形式)                       | textcolor                 |                         |
| アニメ  | 登場アニメーション      | ドロップダウン (8種類以上、後述)                               | inanim (fade-inなど)        |                         |
| アニメ  | 消滅アニメーション      | ドロップダウン (8種類以上、後述)                               | outanim (fade-outなど)      |                         |
| アニメ  | アニメーション速度      | 数値 + 単位 (s/ms)                                   | animspeed                 |                         |
| アニメ  | イージング関数        | ドロップダウン (Linear, Ease-in, Ease-out, Ease-in-out) | easing                    | 追加: 動きの緩急を制御            |
| フィルタ | 特定キーワード除外      | テキスト入力 (カンマ区切り)                                  | exclude                   |                         |
| フィルタ | スーパーチャット強調     | トグルスイッチ (ON/OFF)                                 | sc-highlight              |                         |
| フィルタ | メンバーシップ表示      | ドロップダウン (全表示 / 非表示 / メンバーのみ)                     | showmember                | 追加: メンバーシップコメントのフィルタリング |

## 3. UI/デザイン (UI & Design)

### 3.1. ファイル構成

設定UIとビューワー本体を分離します。

*   **ビューワー本体**: `viewer.html`
*   **設定UI**: `config.html` (ランチャーからこれにリンクする)
*   **共通スタイル**: `style.css`
*   **データ構造**: `styles.json` (デザインとアニメーションの定義ファイル)

### 3.2. デザインパターン (Theme Pattern)

`theme` パラメーターで切り替えるデザインパターンを**最低8種類**作成します。 **拡張性を確保するため、JSONではCSSクラス名を定義し、実際のスタイルは `style.css` に記述する方式を採用します。**

**`styles.json` の構造例（修正版）**

```
// styles.json
{
  "themes": {
    "neon-blue": {
      "label": "ネオンブルー",
      "className": "theme-neon-blue"
    },
    "minimal-white": {
      "label": "ミニマルホワイト",
      "className": "theme-minimal-white"
    },
    "retro-console": {
      "label": "レトロゲーム風",
      "className": "theme-retro-console"
    }
    // ... あと5種類以上のテーマを追加
  },
  "animations": {
    // 登場アニメーション
    "in": {
      "fade-in": { "label": "フェードイン", "className": "anim-fade-in" },
      "slide-left": { "label": "左からスライド", "className": "anim-slide-left" }
      // ... あと6種類以上のパターンを追加
    },
    // 消滅アニメーション
    "out": {
      "fade-out": { "label": "フェードアウト", "className": "anim-fade-out" },
      "slide-right": { "label": "右へスライド", "className": "anim-slide-right" }
      // ... あと6種類以上のパターンを追加
    }
  }
}

```

**`style.css` の実装イメージ**

```
/* 基本スタイル */
.comment-box { ... }

/* テーマ別スタイル */
.theme-neon-blue .comment-box {
  border: 2px solid #00FFFF;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 10px #00FFFF;
}
.theme-minimal-white .comment-box {
  background: transparent;
  border-left: 3px solid #FFF;
}

/* アニメーション定義 */
@keyframes fadeIn { ... }
.anim-fade-in { animation-name: fadeIn; }

```

### 3.3. アニメーションパターン (Animation Pattern)

`inanim` および `outanim` パラメーターで切り替えるアニメーションパターンを**それぞれ最低8種類**作成します。これらはCSS `@keyframes` で定義し、`viewer.html` で動的に読み込むこと。

**必須アニメーション（各カテゴリから最低2つ以上含むこと）:**

1.  **フェード系**: `fade-in`, `fade-out`
2.  **スライド系**: `slide-in-up`, `slide-out-down`
3.  **変形系**: `pop-up`, `shrink-out`
4.  **その他**: `typewriter` (文字がタイプされるように表示), `flash` (一瞬光って表示)

## 4. ファイル構成 (File Structure)

| ファイル        | 役割                                              | 備考                              |
| ----------- | ----------------------------------------------- | ------------------------------- |
| viewer.html | コメント表示専用UI。OBSに設定するURLのターゲット。                   | URLパラメーターを解析し、表示ロジックを実行。        |
| config.html | 設定UI、プレビュー(<iframe>でviewer.htmlを読み込み)、URL生成ボタン。 | viewer.htmlへのパラメーター付きURLを動的に生成。 |
| meta.json   | ランチャー用メタ情報。                                     | pathはconfig.htmlを指す。            |
| style.css   | viewer.htmlで使用するメインのCSS。アニメーションキーフレーム含む。        | テンプレートやアニメーションの基本スタイルを定義。       |
| styles.json | デザインテーマとアニメーションの定義データ。                          | 拡張性とメンテナンス性を確保する外部ファイル。         |
| chat.js     | コメント取得・表示・パラメーター解析のロジック。                        | viewer.htmlからロード。               |

## 5. meta.json 設定値

ランチャーが `config.html` へリンクするように、`path` を設定します。

```
{
  "id": "youtube-chat",
  "name": "YouTubeコメントビューワー",
  "description": "高機能なデザイン・アニメーション設定が可能なコメントオーバーレイ。",
  "icon": "💬",
  "path": "./apps/youtube-chat/config.html"
}

```

## 6. その他メモ (Notes for Implementer)

1.  **URLパラメーター解析**: `viewer.html` では、`new URLSearchParams(window.location.search)` を使用して、すべてのパラメーターを確実に解析すること。
2.  **テストコメント**: `viewer.html` が `?mode=preview` パラメーターを受け取った場合、以下の構造を持つダミーコメントを5秒間隔で自動生成し、表示ロジックをテストすること。
    
    ```
    // ダミーコメントオブジェクトの構造
    {
      author: "テストユーザー",
      text: "これは設定をプレビューするためのテストコメントです。長くても大丈夫。",
      isSuperChat: (Math.random() < 0.1), // 10%の確率でスパチャ
      isMember: (Math.random() < 0.05),   // 5%の確率でメンバー
      avatarUrl: "[https://placehold.co/40x40/00FFFF/FFFFFF?text=AV](https://placehold.co/40x40/00FFFF/FFFFFF?text=AV)" // アバター用URL
    }
    
    ```
    
3.  **デザイン適用ロジック**: `styles.json` を読み込み、選択された `theme` および `inanim`/`outanim` に対応する **`className`** を、コメント要素（またはラッパー要素）の `classList` に追加する実装とすること。JSON内のプロパティを個別に解析する必要はない。
4.  **拡張性**: 新しいデザインを追加する際は、`style.css` にクラスを定義し、`styles.json` にそのクラス名を追加するだけで設定UIに反映される設計とすること。