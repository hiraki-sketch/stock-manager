import { ColumnDef } from "@tanstack/react-table"
import { Item } from "@/types/item"
import { deleteItemById } from "@/lib/deleteItem"
import Link from "next/link"

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
    cell: ({ row }) => `${row.original.stock} ${row.original.unit}`,
  },
  {
    accessorKey: "checker",
    header: "チェック者",
  },
  {
    accessorKey: "day",
    header: "チェック日",
    cell: ({ row }) =>
      row.original.day
        ? new Date(row.original.day).toLocaleDateString("ja-JP")
        : "-",
  },
  {
    accessorKey: "created_at",
    header: "登録日時",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleString("ja-JP", {
        year:   "numeric",
        month:  "2-digit",
        day:    "2-digit",
        hour:   "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "updated_at",
    header: "更新日時",
    cell: ({ row }) =>
      new Date(row.original.updated_at).toLocaleString("ja-JP", {
        year:   "numeric",
        month:  "2-digit",
        day:    "2-digit",
        hour:   "2-digit",
        minute: "2-digit",
      }),
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => {
      const item = row.original

      const handleDelete = async () => {
        if (!confirm(`ID:${item.id} を本当に削除しますか？`)) return
        try {
          await deleteItemById(item.id)
          alert("削除に成功しました")
          location.reload()
        } catch {
          alert("削除に失敗しました")
        }
      }

      return (
        <div className="flex gap-4">
          <Link
            href={`/items/${item.id}`}
            className="text-blue-600 hover:underline"
          >
            編集
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline"
          >
            削除
          </button>
        </div>
      )
    },
  },
]
