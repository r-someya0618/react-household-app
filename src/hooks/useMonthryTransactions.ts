import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { formatMonth } from '../utils/formatting'

const useMonthlyTransactions = () => {
  const { transactions, currentMonth } = useAppContext()
  // 一ヶ月分のデータのみ取得
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(formatMonth(currentMonth))
    )
  }, [transactions, currentMonth])

  return monthlyTransactions
}

export default useMonthlyTransactions
