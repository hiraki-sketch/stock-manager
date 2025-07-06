// File: app/history/RestoreButtonWrapper.tsx
"use client"

import dynamic from "next/dynamic"

// ✅ クライアント側でしか使えないので、これでOK
const RestoreButton = dynamic(
  () => import("./RestoreButton").then((mod) => mod.RestoreButton),
  { ssr: false }
)

export function RestoreButtonWrapper({ id }: { id: string }) {
  return <RestoreButton id={id} />
}
