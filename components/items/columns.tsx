"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Item } from "@/types/item"
import Link from "next/link"
import { deleteItemById } from "@/lib/deleteItem"

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "商品名",
  },
  {
    accessorKey: "unit",
    header: "単位",
  },
  {
    accessorKey: "stock",
    header: "在庫数",
  },
  {
    accessorKey: "checker",
    header: "チェック者",
  },
  {
    accessorKey: "day",
    header: "チェック日",
    cell: ({ row }) => {
      const date = row.original.day
      return date ? new Date(date).toLocaleDateString("ja-JP") : ""
    },
  },
  {
    accessorKey: "updated_at",
    header: "更新日時",
    cell: ({ row }) => {
      const updated = row.original.updated_at
      return updated ? new Date(updated).toLocaleString("ja-JP") : ""
    },
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => {
      const item = row.original

      return (
        <div className="flex gap-4">
          <Link
            href={`/items/${item.id}`}
            className="text-blue-600 hover:underline"
          >
            編集
          </Link>

          <form
            action={async () => {
              const confirmed = confirm(`ID:${item.id} を削除しますか？`)
              if (!confirmed) return

              try {
                await deleteItemById(item.id)
                alert("削除に成功しました")
                location.reload()
              } catch {
                alert("削除に失敗しました")
              }
            }}
          >
            <button type="submit" className="text-red-600 hover:underline">
              削除
            </button>
          </form>
        </div>
      )
    },
  },
]
