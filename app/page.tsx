import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <main className="relative min-h-screen flex flex-col justify-between items-center text-white px-4 pt-24 pb-16 overflow-hidden">
        {/* 背景エフェクト */}
        <div
          className="absolute inset-0 z-[-1] 
          before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 
          before:rounded-full before:bg-gradient-radial before:from-white 
          before:to-transparent before:blur-2xl before:content-[''] 
          after:absolute after:-z-20 after:h-[180px] after:w-[240px] 
          after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 
          after:via-blue-200 after:blur-2xl after:content-[''] 
          before:dark:bg-gradient-to-br before:dark:from-transparent 
          before:dark:to-blue-700 before:dark:opacity-10 
          after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 
          before:lg:h-[360px]"
        />

        {/* タイトル */}
        <h1 className="text-5xl font-extrabold font-sans tracking-tight drop-shadow-lg text-center mb-10">
          STOCK-MANAGER
        </h1>

        {/* ページリンク群 */}
        <div className="w-full max-w-screen-md flex flex-wrap justify-center gap-4">
          <Link
            href="/items"
            className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-5 rounded-full shadow transition"
          >
            在庫一覧ページへ
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-5 rounded-full shadow transition"
          >
            ログインページへ
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-5 rounded-full shadow transition"
          >
            サインアップページへ
          </Link>
          <Link
            href="/history"
            className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-5 rounded-full shadow transition"
          >
            削除履歴ページへ
          </Link>
          <Link
            href="/items/new"
            className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-5 rounded-full shadow transition"
          >
            新規商品登録ページへ
          </Link>

          {/* 在庫詳細ページへのリンクはQRコード遷移機能と連携予定のため、現在は非表示 */}
          {false && (
            <Link
              href="/items/1/edit"
              className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-5 rounded-full shadow transition"
            >
              在庫詳細ページへ
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
