"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browserClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      router.push("/items")
    } else {
      alert("セッションが確立できませんでした。")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-4">ログイン</h1>

        <div className="mb-4">
          <label className="block mb-1 text-sm">メールアドレス</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">パスワード</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        <Button className="w-full" onClick={handleLogin}>
          ログイン
        </Button>
      </div>
    </main>
  )
}
