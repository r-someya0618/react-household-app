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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { formatMonth } from './utils/formattiong'
import { Schema } from './validations/schema'

function isFireStoreError(err: unknown): err is { code: string; message: string } {
  return typeof err === 'object' && err !== null && 'code' in err
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  // 一ヶ月分のデータのみ取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth))
  })

  // 取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      // firesotreにデータを保存
      const docRef = await addDoc(collection(db, 'Transactions'), transaction)

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction
      setTransactions([...transactions, newTransaction])
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

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      // firestoreデータ削除
      await deleteDoc(doc(db, 'Transactions', transactionId))
      const filteredTransaction = transactions.filter(
        (transaction) => transaction.id !== transactionId
      )
      setTransactions(filteredTransaction)
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

  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      // firesotreにデータを保存
      const docRef = doc(db, 'Transactions', transactionId)
      await updateDoc(docRef, transaction)
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[]
      setTransactions(updatedTransactions)
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route
              index
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              }
            />
            <Route
              path='/report'
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                />
              }
            />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
