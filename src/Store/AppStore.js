import { configureStore } from '@reduxjs/toolkit'
import {
  attendanceReducer,
  commonReducer,
  leaveReducer,
  payslipReducer,
  expenseReducer,
  assetsReducer,
  loanReducer
} from './Reducers'

export const store = configureStore({
  reducer: {
    common: commonReducer,
    attendence: attendanceReducer,
    leave: leaveReducer,
    payslip: payslipReducer,
    expense: expenseReducer,
    assets: assetsReducer,
    loan:loanReducer
  },
})