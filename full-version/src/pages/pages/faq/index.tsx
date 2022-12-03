// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { FaqType } from 'src/@fake-db/types'

// ** Demo Imports
import FaqHeader from 'src/views/pages/faq/FaqHeader'
import FaqFooter from 'src/views/pages/faq/FaqFooter'
import FaqAccordions from 'src/views/pages/faq/FaqAccordions'

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(14.25, 24, 0, 24),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(14.25, 0, 0)
  },
  '& > :not(:first-of-type)': {
    marginTop: theme.spacing(13)
  }
}))

const FAQ = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** States
  const [data, setData] = useState<FaqType[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (searchTerm !== '') {
      axios.get('/pages/faqs', { params: { q: searchTerm } }).then(response => {
        if (response.data && response.data.length) {
          setData(response.data)
        } else {
          setData(null)
        }
      })
    } else {
      setData(apiData)
    }
  }, [apiData, searchTerm])

  const renderNoResult = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AlertCircleOutline sx={{ mr: 2 }} />
      <Typography variant='h6'>No Results Found!!</Typography>
    </Box>
  )

  return (
    <Fragment>
      <FaqHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StyledBox>
        {data !== null ? <FaqAccordions data={data} /> : renderNoResult}
        <FaqFooter />
      </StyledBox>
    </Fragment>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/faqs')
  const apiData: FaqType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default FAQ
