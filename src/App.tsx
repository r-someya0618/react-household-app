import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import NoMatch from './pages/NoMatch'
import AppLayout from './components/AppLayout'
import { theme } from './theme/theme'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { useEffect, useState } from 'react'
import { Transaction } from './types'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { formatMonth } from './utils/formattiong'

function isFireStoreError(err: unknown): err is { code: string; message: string } {
  return typeof err === 'object' && err !== null && 'code' in err
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentMonth] = useState(new Date())

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transactions'))

        const transactionData = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Transaction
        })
        setTransactions(transactionData)
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error('fireStoreのエラーは: ', err)
          console.error('fireStoreのErrorメッセージ: ', err.message)
          console.error('fireStoreのErrorコード: ', err.code)
        } else {
          console.error('一般的なエラーは: ', err)
        }
      }
    }
    fetchTransactions()
  }, [])

  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth))
  })

  console.log(monthlyTransactions)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route
              index
              element={<Home monthlyTransactions={monthlyTransactions} />}
            />
            <Route path='/report' element={<Report />} />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
