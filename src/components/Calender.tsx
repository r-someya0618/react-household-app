import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import jaLocale from '@fullcalendar/core/locales/ja'
import '../calender.css'
import { DatesSetArg, EventContentArg } from '@fullcalendar/core/index.js'
import { Balance, CalendarContent } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formatCurrency } from '../utils/formatting'
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'
import useMonthlyTransactions from '../hooks/useMonthryTransactions'
import { useAppContext } from '../context/AppContext'

interface CalendarProps {
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>
  currentDay: string
  today: string
  onDateClick: (dateInfo: DateClickArg) => void
}

const Calender = ({
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const { setCurrentMonth } = useAppContext()
  const monthlyTransactions = useMonthlyTransactions()
  const theme = useTheme()
  const dailyBalances = calculateDailyBalances(monthlyTransactions)

  // FullCalender用のイベントを生成
  const createCalenderEvents = (
    dailyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date]
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      }
    })
  }

  const calendarEvents = createCalenderEvents(dailyBalances)

  const backgroundEvent = {
    start: currentDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className='money' id='event-income'>
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id='event-expense'>
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id='event-balance'>
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart
    setCurrentMonth(datesetInfo.view.currentStart)
    const todayDate = new Date()
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today)
    }
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      locale={jaLocale}
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  )
}

export default Calender
