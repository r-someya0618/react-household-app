import { Box } from '@mui/material'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { useState } from 'react'
import { format } from 'date-fns'

interface HomeProps {
  monthlyTransactions: Transaction[]
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [currentDay, setCurrentDay] = useState(today)
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false)

  const dailyTransactions = monthlyTransactions.filter(
    (transaction) => transaction.date === currentDay
  )

  const onCloseForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
  }

  const handleAddTransactionForm = () => setIsEntryDrawerOpen(!isEntryDrawerOpen)

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          handleAddTransactionForm={handleAddTransactionForm}
        />
        <TransactionForm
          isEntryDrawerOpen={isEntryDrawerOpen}
          onCloseForm={onCloseForm}
          currentDay={currentDay}
        />
      </Box>
    </Box>
  )
}

export default Home
