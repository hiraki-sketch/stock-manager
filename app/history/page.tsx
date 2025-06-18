"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const deletedItems = [
{
id: 1,
name: "PE袋（GHSラベル表示有）",
deletedAt: "2025-06-05",
reason: "破損のため廃棄",
},
{
id: 2,
name: "PE袋（GHSラベル表示なし）",
deletedAt: "2025-06-03",
reason: "仕様変更により不要",
},
{
id: 3,
name: "古いPE袋",
deletedAt: "2025-06-01",
reason: "使用期限切れ",
},
]

export default function HistoryPage() {
const [searchTerm, setSearchTerm] = useState("")

const filteredItems = deletedItems.filter((item) =>
item.name.toLowerCase().includes(searchTerm.toLowerCase())
)

return (
<main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-black dark:text-white">
<h1 className="text-2xl font-bold mb-6">削除された製品の履歴一覧</h1>

<div className="mb-6 max-w-md">
<Input
placeholder="製品名で検索..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredItems.length > 0 ? (
filteredItems.map((item) => (
<Card
key={item.id}
className="border border-gray-200 shadow-sm hover:shadow-md transition"
>
<CardHeader>
<CardTitle className="text-lg">{item.name}</CardTitle>
</CardHeader>
<CardContent className="text-sm space-y-1">
<p>
<span className="font-medium">製品ID:</span> {item.id}
</p>
<p>
<span className="font-medium">削除日:</span> {item.deletedAt}
</p>
<p>
<span className="font-medium">理由:</span> {item.reason}
</p>
<Button variant="outline" className="mt-3 w-full text-xs">
詳細を見る
</Button>
</CardContent>
</Card>
))
) : (
<p>該当する履歴は見つかりませんでした。</p>
)}
</div>
</main>
)
}
