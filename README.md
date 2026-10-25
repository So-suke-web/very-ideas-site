# FIELDNOTES | very50 企画ラボ

very50への新規プロジェクトを二人で検討するWebアプリです。マレーシア国内・日本国内プログラム、スタディツアー、企業訪問、資金調達などの案を整理します。

## このリポジトリの役割

この非公開リポジトリは、二人がClaude Codeなどで**ソースコードを共同編集するための置き場**です。

- 本番サイト: https://very50-ideas-sosuke.new-chime-3867.chatgpt.site
- GitHub: https://github.com/So-suke-web/very-ideas-site
- コピー元のSitesソースコミット: `d4a2811d6ffc6ba739c580b4e057db95142de178`
- **GitHubへコミットしても、本番サイトには自動反映されません。** 現在の本番公開はオーナーがSitesで行います。
- 本番のアイデア・企画書データはSitesのD1にあり、このリポジトリには入りません。ローカル開発用DBは別です。

## 機能

- アイデアの追加・編集、カテゴリーによる絞り込み
- アイデア全体図（親子関係を縦線で表示）
- キーワードによる類似候補、確認後の統合、元の案のアーカイブ・復元
- 企画書9項目の編集とMarkdown出力
- クラウド保存・リビジョンによる更新競合の検出

類似判定はキーワード方式です。Claude APIは組み込まれていません。**Claude Codeで開発することと、アプリ内でClaude APIを使うことは別**です。

## 二人でClaude Codeを使う

1. GitHubのオーナーが Settings → Collaborators から友人のGitHubアカウントを招待し、友人が承諾します。サイトの閲覧招待とGitHubの招待は別です。
2. 二人がそれぞれClaude CodeでGitHubを接続し、この非公開リポジトリを選びます。Claude側の利用資格・リポジトリへのアクセス許可も必要です。
3. 変更ごとに別ブランチを使い、変更内容をプルリクエスト（PR）で確認します。
4. 検証後にmainへ統合します。本番反映は下記の公開手順に従ってください。

Claudeへの最初の指示例:

> README.md、CLAUDE.md、docs/DEVELOPMENT.mdを読んでください。このアプリの現在の機能と保存の仕組みを説明し、指定する変更を別ブランチで実装してください。型チェックとビルドを実行し、PRを作成してください。本番公開・本番データ変更・共有設定変更は行わないでください。

## 開発

Node.js 22.13.0以上と、package.jsonに指定されたpnpmを使用します。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

D1が必要なので、初回はビルド後にローカルDBへマイグレーションを適用します。詳細は [開発・公開ガイド](docs/DEVELOPMENT.md) を参照してください。

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_nervous_whizzer.sql
pnpm dev
```

以後、同じローカルDBに同じマイグレーションを繰り返し適用しないでください。

## 主なファイル

| ファイル | 内容 |
| --- | --- |
| `app/page.tsx` | アイデアボード、全体図、統合、企画書 |
| `app/globals.css` | レイアウト・配色・縦線など |
| `app/api/workspace/route.ts` | 保存APIと競合検出 |
| `db/schema.ts` | D1のデータ構造 |
| `drizzle/` | DBマイグレーション |
| `.openai/hosting.json` | 元のSitesのIDとDBバインディング |

## 本番公開

現在、自動デプロイやGitHub→Sitesの自動同期はありません。

PRをmainへ統合したら、サイトオーナーがChatGPTで以下のように依頼します。

> GitHubのSo-suke-web/very-ideas-siteのコミット［SHA］の変更を、既存のFIELDNOTESサイトに反映してください。現在のSitesソースと差分を確認し、既存のプロジェクトID、DB、共有設定を維持して、検証後に公開してください。

これは**Sitesにアクセスできるオーナーが行う明示的な反映依頼**です。友人のClaudeセッションに、サイトオーナーの認証情報を渡す必要はありません。

元のSites側でもコードが更新された場合は、GitHub側との変更を照合してから公開してください。詳細は [開発・公開ガイド](docs/DEVELOPMENT.md) を参照してください。
