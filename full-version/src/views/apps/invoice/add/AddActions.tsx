// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import SendOutline from 'mdi-material-ui/SendOutline'

const OptionsWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = () => {
  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Button fullWidth sx={{ mb: 3.5 }} variant='contained' startIcon={<SendOutline />}>
            Send Invoice
          </Button>
          <Link href='/apps/invoice/preview/4987' passHref>
            <Button fullWidth component='a' sx={{ mb: 3.5 }} variant='outlined'>
              Preview
            </Button>
          </Link>
          <Button fullWidth variant='outlined' sx={{ mb: 3.5 }}>
            Save
          </Button>
        </CardContent>
      </Card>
      <Select fullWidth defaultValue='Internet Banking' sx={{ mb: 4 }}>
        <MenuItem value='Internet Banking'>Internet Banking</MenuItem>
        <MenuItem value='Debit Card'>Debit Card</MenuItem>
        <MenuItem value='Credit Card'>Credit Card</MenuItem>
        <MenuItem value='Paypal'>Paypal</MenuItem>
        <MenuItem value='UPI Transfer'>UPI Transfer</MenuItem>
      </Select>
      <OptionsWrapper sx={{ mb: 1 }}>
        <InputLabel
          htmlFor='invoice-add-payment-terms'
          sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
        >
          Payment Terms
        </InputLabel>
        <Switch defaultChecked id='invoice-add-payment-terms' />
      </OptionsWrapper>
      <OptionsWrapper sx={{ mb: 1 }}>
        <InputLabel
          htmlFor='invoice-add-client-notes'
          sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
        >
          Client Notes
        </InputLabel>
        <Switch id='invoice-add-client-notes' />
      </OptionsWrapper>
      <OptionsWrapper>
        <InputLabel
          htmlFor='invoice-add-payment-stub'
          sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
        >
          Payment Stub
        </InputLabel>
        <Switch id='invoice-add-payment-stub' />
      </OptionsWrapper>
    </Box>
  )
}

export default AddActions
