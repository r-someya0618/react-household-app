import { Box } from '@mui/material'
import MonthlySummary from '../components/MonthlySummary'
import Calender from '../components/Calender'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { DateClickArg } from '@fullcalendar/interaction/index.js'
import { useAppContext } from '../context/AppContext'
import useMonthlyTransactions from '../hooks/useMonthryTransactions'

const Home = () => {
  const { isMobile } = useAppContext()
  const monthlyTransactions = useMonthlyTransactions()
  const today = format(new Date(), 'yyyy-MM-dd')
  const [currentDay, setCurrentDay] = useState(today)
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null
  )

  const dailyTransactions = useMemo(
    () =>
      monthlyTransactions.filter((transaction) => transaction.date === currentDay),
    [monthlyTransactions, currentDay]
  )

  const onCloseForm = () => {
    setSelectedTransaction(null)
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen)
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen)
    }
  }

  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true)
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null)
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen)
      }
    }
  }

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)

    if (isMobile) {
      setIsDialogOpen(true)
    } else {
      setIsEntryDrawerOpen(true)
    }
  }

  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr)
    setIsMobileDrawerOpen(true)
  }
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary />
        <Calender
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          isOpen={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          isEntryDrawerOpen={isEntryDrawerOpen}
          onCloseForm={onCloseForm}
          currentDay={currentDay}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  )
}

export default Home
