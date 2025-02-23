import React, { ChangeEvent, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import {
  Box,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionType,
} from '../types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface CategoryChartProps {
  monthlyTransactions: Transaction[]
  isLoading: boolean
}

const CategoryChart = ({ monthlyTransactions, isLoading }: CategoryChartProps) => {
  const theme = useTheme()
  const [selectedType, setSelectedType] = useState<TransactionType>('expense')
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedType(e.target.value as TransactionType)
  }
  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0
      }
      acc[transaction.category] += transaction.amount
      return acc
    }, {} as Record<IncomeCategory | ExpenseCategory, number>)

  const categoryLabels = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[]
  const categoryValues = Object.values(categorySums)

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  }

  const incomeCategoryColor = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  }
  const expenseCategoryColor = {
    食費: theme.palette.expenseCategoryColor.食費,
    住居費: theme.palette.expenseCategoryColor.住居費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    交通費: theme.palette.expenseCategoryColor.交通費,
  }
  const getCategoryColor = (category: IncomeCategory | ExpenseCategory) => {
    if (selectedType === 'income') {
      return incomeCategoryColor[category as IncomeCategory]
    } else {
      return expenseCategoryColor[category as ExpenseCategory]
    }
  }

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),
        borderColor: categoryLabels.map((category) => getCategoryColor(category)),
        borderWidth: 1,
      },
    ],
  }

  return (
    <>
      <TextField
        id='select-type'
        label='収支の種類'
        select
        fullWidth
        value={selectedType}
        onChange={handleChange}
      >
        <MenuItem value={'income'}>収入</MenuItem>
        <MenuItem value={'expense'}>支出</MenuItem>
      </TextField>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  )
}

export default CategoryChart
