// @/types/item.ts
export type Item = {
  id:          string
  name:        string
  stock:       number
  unit:        string
  checker:     string
  day:         string | null
  created_at:  string     // ← 追加
  updated_at:  string
  user_id:     string     // ← RLS 対策で必要
  deleted:     boolean
}
