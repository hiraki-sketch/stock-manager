// Header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browserClient";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isMobile: boolean;
  currentPage: string; // 例: "home" | "items" | "new" など
};

export default function Header({ isMobile, currentPage }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuLinks = (
    <nav className="flex flex-col gap-4 mt-4">
      <Link href="/">ホーム</Link>
      <Link href="/items">在庫一覧</Link>
      <Link href="/items/new">新規登録</Link>
      <Link href="/history">削除履歴</Link>
      <Link href="/login">ログイン</Link>
      <Link href="/signup">サインアップ</Link>
      <Button variant="destructive" onClick={handleLogout}>
        ログアウト
      </Button>
    </nav>
  );

  const shouldShowHamburger = isMobile || currentPage !== "home";

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
      <h1 className="text-lg font-bold">在庫管理アプリ</h1>
      {shouldShowHamburger ? (
        <Sheet>
          <SheetTrigger>
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>メニュー</SheetTitle>
            {menuLinks}
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link href="/items">
            <Button variant="default">在庫一覧ページへ</Button>
          </Link>
          <Link href="/login">
            <Button variant="default">ログインページへ</Button>
          </Link>
          <Link href="/signup">
            <Button variant="default">サインアップページへ</Button>
          </Link>
          <Link href="/history">
            <Button variant="default">削除履歴ページへ</Button>
          </Link>
          <Link href="/items/new">
            <Button variant="default">新規商品登録ページへ</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
