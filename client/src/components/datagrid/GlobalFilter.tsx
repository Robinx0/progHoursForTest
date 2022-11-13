import { TextInput } from "@mantine/core"
import { FilterFn, Table } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Search } from "tabler-icons-react"
import { DataGridLocale } from "./types"

type GlobalFilterProps<TData> = {
  table: Table<TData>
  className: string
  locale?: DataGridLocale
}

export function GlobalFilter<TData>({ table, className, locale }: GlobalFilterProps<TData>) {
  const globalFilter = table.getState().globalFilter
  const [value, setValue] = useState(globalFilter || "")

  useEffect(() => {
    setValue(globalFilter || "")
  }, [globalFilter])

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(value)
    }, 200)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <TextInput
      mb="md"
      sx={{ maxWidth: 340 }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={locale?.globalSearch || "Search..."}
      rightSection={<Search size={16} />}
      className={className}
    />
  )
}

export const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue: string) => {
  const value = row.getValue<string>(columnId)
  if (!value) return false
  return value.toString().toLowerCase().includes(filterValue.toString().toLowerCase())
}
