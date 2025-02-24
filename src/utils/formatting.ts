import { format } from 'date-fns'

export const formatMonth = (date: Date) => {
  return format(date, 'yyyy-MM')
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP')
}
