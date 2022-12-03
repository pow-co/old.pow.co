// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Demo Imports
import PricingCTA from 'src/views/pages/pricing/PricingCTA'
import PricingPlans from 'src/views/pages/pricing/PricingPlans'
import PricingHeader from 'src/views/pages/pricing/PricingHeader'
import PricingFooter from 'src/views/pages/pricing/PricingFooter'

// ** Styled Components
const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(17.5, 36, 28.25),
  [theme.breakpoints.down('xl')]: {
    padding: theme.spacing(12.5, 20, 20)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 5)
  }
}))

const Pricing = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** States
  const [plan, setPlan] = useState<'monthly' | 'annually'>('monthly')

  const handleChange = (e: ChangeEvent<{ checked: boolean }>) => {
    if (e.target.checked) {
      setPlan('annually')
    } else {
      setPlan('monthly')
    }
  }

  return (
    <Card>
      <CardContent>
        <PricingHeader plan={plan} handleChange={handleChange} />
        <PricingPlans plan={plan} data={apiData} />
      </CardContent>
      <PricingCTA />
      <PricingFooter data={apiData} />
    </Card>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/pricing')
  const apiData: PricingDataType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default Pricing
