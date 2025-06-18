import { ColumnDef } from "@tanstack/react-table"
import { Item } from "@/types/item" // 型は別ファイルに定義しておくのが理想

export const columns: ColumnDef<Item>[] = [
{
accessorKey: "name",
header: "商品名",
},
{
accessorKey: "stock",
header: "在庫数",
cell: ({ row }) => `${row.original.stock} ${row.original.unit}`,
},
{
accessorKey: "updated_at",
header: "更新日",
cell: ({ row }) =>
new Date(row.original.updated_at).toLocaleDateString(),
},
{
accessorKey: "checker",
header: "チェック者",
},
]