"use client"
import { createClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      alert("ログインに失敗しました: " + error.message)
      return
    }
    router.push("/items")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-900 text-white shadow-xl p-6 sm:p-8 rounded-xl space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">ログイン</h1>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">メールアドレス</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">パスワード</label>
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleLogin}>
          ログイン
        </Button>
      </div>
    </main>
  )
}
