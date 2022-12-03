// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import PlanDetails from 'src/@core/components/plan-details'

// ** Types
import { PricingDataType, PricingPlanType } from 'src/@core/components/plan-details/types'

interface Props {
  plan: string
  data: PricingDataType | null
}

const PricingPlans = (props: Props) => {
  // ** Props
  const { plan, data } = props

  const renderPlan = () => {
    return data?.pricingPlans.map((item: PricingPlanType) => {
      return (
        <Grid item xs={12} md={4} key={item.title.toLowerCase()}>
          <PlanDetails plan={plan} data={item} />
        </Grid>
      )
    })
  }

  return (
    <Grid container spacing={6}>
      {renderPlan()}
    </Grid>
  )
}

export default PricingPlans
