
import { useState } from 'react'

import moment from 'moment'

export default function useDateRange() {
    
  const [startDate, setStartDate] = useState<Date>(moment().subtract(1, 'days').toDate())

  const [endDate, setEndDate] = useState<Date>(moment().toDate())

  return { startDate, endDate, setStartDate, setEndDate }

}