// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

const PickersOptions = () => {
  // ** States
  const [dateOpen, setDateOpen] = useState<DateType>(null)
  const [dateClear, setDateClear] = useState<DateType>(new Date())
  const [dateTodayBtn, setDateTodayBtn] = useState<DateType>(null)
  const [dateFilter, setDateFilter] = useState<DateType>(new Date())
  const [dateWeekNum, setDateWeekNum] = useState<DateType>(new Date())

  const isWeekday = (date: Date) => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
      <Box>
        <DatePicker
          isClearable
          id='picker-clear'
          selected={dateClear}
          popperPlacement='top-start'
          portalId='react-datepicker-portal'
          customInput={<CustomInput label='Clear' />}
          onChange={(date: Date) => setDateClear(date)}
        />
      </Box>
      <Box>
        <DatePicker
          showWeekNumbers
          id='picker-week-num'
          selected={dateWeekNum}
          popperPlacement='top-start'
          portalId='react-datepicker-portal'
          onChange={(date: Date) => setDateWeekNum(date)}
          customInput={<CustomInput label='Week Numbers' />}
        />
      </Box>
      <Box>
        <DatePicker
          id='picker-filter'
          selected={dateFilter}
          filterDate={isWeekday}
          popperPlacement='top-start'
          portalId='react-datepicker-portal'
          onChange={(date: Date) => setDateFilter(date)}
          customInput={<CustomInput label='Filter Dates' />}
        />
      </Box>
      <Box>
        <DatePicker
          selected={dateOpen}
          id='picker-open-date'
          popperPlacement='top-start'
          portalId='react-datepicker-portal'
          openToDate={new Date('1993/09/28')}
          onChange={(date: Date) => setDateOpen(date)}
          customInput={<CustomInput label='Open To Date' />}
        />
      </Box>
      <Box>
        <DatePicker
          todayButton='Today'
          selected={dateTodayBtn}
          id='picker-date-today-btn'
          popperPlacement='top-start'
          portalId='react-datepicker-portal'
          onChange={(date: Date) => setDateTodayBtn(date)}
          customInput={<CustomInput label='Date Today Button' />}
        />
      </Box>
    </Box>
  )
}

export default PickersOptions
