# 今後の実装手順 (Implementation Steps)

## 1. プロトタイプ作成 (Prototype Phase)
まずはGemini上で、ランチャーと時計機能を含んだモックアップを作成し、UIや挙動を確認します。

*   [x] **ランチャーのモックアップ作成**: `prototype.html` を作成。
    *   React (CDN) を使用し、単一ファイルで動作させる。
    *   グリッドレイアウト、ホバーエフェクト等のデザインを確認。
*   [x] **デジタル時計機能の実装**: 同ファイル内でコンポーネントとして実装し、画面遷移をシミュレート。

## 2. 開発環境構築 (Environment Setup - Windows 11 & Docker)
Windows 11 上で VS Code と Docker を使用した開発環境を構築します。

### 2.1 事前準備 (Prerequisites)
ユーザー様側で行っていただく作業です。
*   [x] **Docker Desktop for Windows のインストール**: WSL 2 バックエンドを使用するように設定。
*   [x] **VS Code のインストール**。
*   [x] **VS Code 拡張機能**: "Dev Containers" (ms-vscode-remote.remote-containers) をインストール。

### 2.2 プロジェクト構成の作成
*   [x] **ルートディレクトリ作成**: `obs-web-tools` フォルダを作成。
*   [x] **`package.json` 作成**: プロジェクトの依存関係定義。
*   [x] **`.gitignore` 作成**: `node_modules`, `.DS_Store` 等を除外。

### 2.3 Docker化 (Dockerization)
*   [x] **`docker-compose.yml` の作成**:
    *   **Service**: `app`
    *   **Image**: `node:lts-alpine`
    *   **Volumes**: カレントディレクトリを `/app` にマウント (Hot Reload対応)。
    *   **Ports**: `8080:8080` (http-server用)。
    *   **Command**: 開発用サーバー立ち上げコマンド (`npx http-server -p 8080`)。
*   [x] **VS Code Dev Container 設定 (任意)**:
    *   `.devcontainer/devcontainer.json` を作成し、VS Code から直接コンテナ内で開発できるようにする設定（推奨）。

## 3. コア機能実装 (Core Implementation)

### 3.1 自動化スクリプト
*   [x] **`scripts/update-list.js` 実装**:
    *   `fs` モジュールで `/apps` 以下のディレクトリを走査。
    *   各ディレクトリの `meta.json` を読み込み。
    *   エラーハンドリング（`meta.json` がない場合のスキップ処理等）。
    *   `global-manifest.json` として配列を出力。
*   [x] **npm script 追加**: `package.json` に `"update": "node scripts/update-list.js"` を追加。

### 3.2 アプリ基盤と初期アプリ
*   [x] **デジタル時計アプリ (`apps/digital-clock/`)**:
    *   `index.html`: 時計表示UI。
    *   `meta.json`: `{ "id": "digital-clock", "name": "Digital Clock", ... }`
    *   `style.css`: デジタルフォント等のスタイル。
*   [x] **アナログ時計アプリ (`apps/analog-clock/`)**:
    *   `index.html`: Canvas または CSS でのアナログ時計描画。
    *   `meta.json`: 定義ファイル。

### 3.3 ルートランチャー (`index.html`)
*   [x] **マニフェスト読み込み**: `fetch('global-manifest.json')` でアプリ一覧を取得。
*   [x] **UI生成**: 取得したリストを元に、グリッド状にアイコン/ボタンを生成。
*   [x] **iframe対応 (検討)**: 遷移ではなく iframe で表示するモードも考慮（OBSでの挙動による）。一旦はリンク遷移で実装。

## 4. 動作検証 (Verification)

### 4.1 ローカル検証
1.  VS Code でプロジェクトを開く。
2.  `docker compose up` でコンテナ起動。
3.  ブラウザで `http://localhost:8080` にアクセス。
4.  ランチャーが表示され、各アプリへ遷移できるか確認。

### 4.2 OBS検証
1.  OBS を起動。
2.  「ソース」追加 -> 「ブラウザ」。
3.  URL に `http://localhost:8080` (開発中) または ローカルファイルのパスを入力。
4.  幅/高さを設定 (例: 1920x1080)。
5.  インタラクト機能でクリック操作ができるか確認。

*   [x] **動作検証完了**: ローカルおよびOBSでの動作確認済み。
