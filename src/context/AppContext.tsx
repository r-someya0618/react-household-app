import { useMediaQuery, useTheme } from '@mui/material'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { createContext, ReactNode, useContext, useState } from 'react'

import { db } from '../firebase'
import { isFireStoreError } from '../utils/errorHandling'
import { Transaction } from '../types'
import { Schema } from '../validations/schema'

interface AppContextType {
  transactions: Transaction[]
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  currentMonth: Date
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  onSaveTransaction: (transaction: Schema) => Promise<void>
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

// プロバイダ
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  // 取引を保存する処理
  const onSaveTransaction = async (transaction: Schema) => {
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

  const onDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds]

      for (const id of idsToDelete) {
        await deleteDoc(doc(db, 'Transactions', id))
      }
      // firestoreデータ削除
      const filteredTransaction = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
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

  const onUpdateTransaction = async (transaction: Schema, transactionId: string) => {
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
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction,
        onDeleteTransaction,
        onUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// カスタムフック
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('グローバルデータはプロバイダ内で取得してください')
  }
  return context
}
