'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Item } from '@/types/item'

export default function EditItem() {
  const { id } = useParams() as { id: string }
  const supabase = createClient()
  const router = useRouter()

  const [item, setItem] = useState<Item | null>(null)
  const [name, setName] = useState('')
  const [checker, setChecker] = useState('')
  const [stock, setStock] = useState('')
  const [day, setDay] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    if (!id) {
      setErrorMessage('IDが見つかりません')
      return
    }

    const fetchItem = async () => {
      const { data: authUser, error: authError } = await supabase.auth.getUser()
      if (authError || !authUser.user) {
        setErrorMessage('ログイン情報が取得できません')
        return
      }

      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setItem(data)
      setName(data.name)
      setChecker(data.checker)
      setStock(String(data.stock))
      setDay(data.day ?? '')
    }

    fetchItem()
  }, [id])

  // 更新処理
  const handleUpdate = async () => {
    setErrorMessage(null)

    if (!item || !name || !checker || !stock || !day) {
      setErrorMessage('すべての項目を入力してください')
      return
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser.user) {
      setErrorMessage('ログイン情報が取得できません')
      return
    }

    const { error } = await supabase
      .from('items')
      .update({
        name,
        checker,
        stock: Number(stock),
        day,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      setErrorMessage(error.message)
      return
    }

    alert('更新しました')
    router.push('/items')
  }

  if (errorMessage && !item) {
    return <p className="p-8 text-red-600">{errorMessage}</p>
  }

  if (!item) {
    return <p className="p-8">読み込み中…</p>
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">在庫編集</h1>
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <label className="block mb-1">商品名</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4 text-black bg-white"
      />

      <label className="block mb-1">在庫数</label>
      <input
        type="number"
        value={stock}
        onChange={e => setStock(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4 text-black bg-white"
      />

      <label className="block mb-1">チェック者</label>
      <input
        type="text"
        value={checker}
        onChange={e => setChecker(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4 text-black bg-white"
      />

      <label className="block mb-1">チェック日</label>
      <input
        type="date"
        value={day}
        onChange={e => setDay(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-6 text-black bg-white"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        更新する
      </button>
    </main>
  )
}
