// app/items/[id]/page.tsx
import { Metadata } from "next";

type Props = {
params: {
id: string;
};
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
return {
title: `商品 ${params.id} の詳細`,
};
}

export default function ItemDetailPage({ params }: Props) {
const { id } = params;

const dummyItem = {
id,
name: `仮商品名（ID: ${id}）`,
stock: 8,
unit: "本",
updatedAt: "2025-06-11",
checker: "佐藤太郎",
};

return (
<main className="p-6">
<h1 className="text-2xl font-bold mb-4">在庫詳細ページ</h1>
<div className="border rounded-lg p-4 space-y-2 shadow-sm bg-white">
<p>
<strong>商品名：</strong>
{dummyItem.name}
</p>
<p>
<strong>在庫数：</strong>
{dummyItem.stock} {dummyItem.unit}
</p>
<p>
<strong>チェック日：</strong>
{dummyItem.updatedAt}
</p>
<p>
<strong>チェック者：</strong>
{dummyItem.checker}
</p>
</div>
</main>
);
}