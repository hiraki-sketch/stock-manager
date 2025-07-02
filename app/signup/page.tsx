"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabaseClient" 

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {
    const supabase = createClient()
   const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
  data: { username },
  },
})

    if (error) {
      alert("登録失敗: " + error.message)
      return
    }

    alert("仮登録完了！メールを確認してください。")
  }

  return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 bg-white text-black p-6">
      <div className="w-full max-w-md bg-white text-black dark:bg-gray-900 dark:text-white shadow-lg rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">サインアップ</h1>

        <div>
          <label className="block mb-1 text-sm font-medium">ユーザー名</label>
          <Input
            type="text"
            placeholder="ひらき"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">メールアドレス</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">パスワード</label>
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleSignup}>
          新規登録
        </Button>

        <p className="text-sm text-center mt-2">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-600 underline">
            ログイン
          </Link>
        </p>
      </div>
    </main>
  )
}
