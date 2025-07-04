在庫管理アプリ - Stock Manager


## 概要

現場での在庫管理業務を効率化するために開発したWebアプリケーションです。  
**Next.js 15 / TypeScript / Supabase / Tailwind CSS** を使用して構築しています。 
未経験からフロントエンドエンジニアへの転職を目指し、実際の業務フローを意識して設計しました。

## 主な機能

- ✅ 在庫一覧表示（DataTableを使用）
- ✅ 新規在庫の登録フォーム（バリデーションあり）
- ✅ 編集・削除機能（モーダル対応）
- ✅ チェック担当者による絞り込みフィルター
- ✅ 削除済み在庫の履歴表示
- ✅ Supabase認証機能（ログイン／ログアウト）
- ✅ レスポンシブ対応済み

## 使用技術スタック

| 項目 | 使用技術 |
|------|---------|
| フロントエンド | Next.js 15, React, TypeScript |Prisma
| スタイリング | Tailwind CSS |
| バックエンド | Supabase（認証・DB） ||Prisma
| UIコンポーネント | Shadcn UI（DataTableなど） |
| その他 | Vercelデプロイ, GitHub管理 |

## デプロイURL

 https://vercel.com/hirakisukes-projects/stock-manager
※一部の機能はログイン後に利用可能です。
機能　ログイン　サインアップ　ログアウト　新規登録　表示　削除　編集　絞り込み機能　
基本的には、認証さえあれば誰でも使える作りだが、削除は新規登録した自分のデータのみ削除可
## ログイン用テストアカウント
　test100@example.com
パスワード
test1234

今後修正予定
ホーム画面のUI変更　モバイルでハンバーガーメニュー表示　PCでボタンのみ表示、他画面はハンバーガーで遷移
QRコード画面の追加

ただのポートフォリオで終わらせるのではなく、実際に使えるアプリにしたいと考えています。
作業現場で実際に使っていただく為、iosユーザーが多い現場でReact　Nativeでのアプリ化を検討中
今後は
QRコードについても対応していく予定


