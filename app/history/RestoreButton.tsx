// File: app/history/RestoreButton.tsx
"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { restoreItem } from "./restoreItem";
import { Hammer } from "lucide-react";

export function RestoreButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <form
      action={async () => {
        const confirmed = confirm(`ID:${id} を復元しますか？`);
        if (!confirmed) return;

        try {
          await restoreItem(id);
          toast.success("✅ 復元しました");
          startTransition(() => {
            router.push("/items");
          });
        } catch {
          toast.error("❌ 復元に失敗しました（権限なし）");
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1 text-green-600 hover:underline text-sm sm:text-base"
      >
        <Hammer className="w-4 h-4" aria-label="復元" />
        <span>復元</span>
      </button>
    </form>
  );
}
