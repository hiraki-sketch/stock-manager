"use client"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { SheetTitle } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Header() {
    const router = useRouter()

const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
}

return (
<header className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
<h1 className="text-lg font-bold">在庫管理アプリ</h1>
<Sheet>
<SheetTrigger>
<Menu className="w-6 h-6" />
</SheetTrigger>
<SheetContent side="left">
<SheetTitle>メニュー</SheetTitle>
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
</SheetContent>
</Sheet>
</header>
)
}