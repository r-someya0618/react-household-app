import { format } from 'date-fns'

export const formatMonth = (date: Date) => {
  return format(date, 'yyyy-MM')
}
