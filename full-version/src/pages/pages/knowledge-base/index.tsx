// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { KnowledgeBaseData } from 'src/@fake-db/types'

// ** Demo Imports
import KnowledgeBaseHeader from 'src/views/pages/knowledge-base/KnowledgeBaseHeader'

// Styled Link component
const StyledLink = styled('a')({
  textDecoration: 'none'
})

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(5),
  backgroundColor: `rgba(${theme.palette.customColors.main}, 0.08)`
}))

const KnowledgeBase = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** States
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [data, setData] = useState<KnowledgeBaseData | null>(null)

  useEffect(() => {
    if (searchTerm !== '') {
      axios.get('/pages/knowledge-base', { params: { q: searchTerm } }).then(response => {
        if (response.data && response.data.length) {
          setData(response.data)
        } else {
          setData(null)
        }
      })
    } else {
      setData(apiData)
    }
  }, [searchTerm, apiData])

  const renderGrid = () => {
    if (data !== null && Array.isArray(data)) {
      return data.map((item: KnowledgeBaseData, index: number) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Link passHref href={`/pages/knowledge-base/[category]`} as={`/pages/knowledge-base/${item.category}`}>
              <StyledLink>
                <StyledBox>
                  <img
                    src={item.imgSrc}
                    width={item.imgWidth}
                    height={item.imgHeight}
                    alt={`knowledge-base-${item.category}`}
                  />
                </StyledBox>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant='h6' sx={{ mb: 1.75 }}>
                    {item.title}
                  </Typography>
                  <Typography variant='body2'>{item.desc}</Typography>
                </CardContent>
              </StyledLink>
            </Link>
          </Card>
        </Grid>
      ))
    } else {
      return (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <InformationOutline sx={{ mr: 2 }} />
            <Typography variant='h6'>Data is not an array!</Typography>
          </Box>
        </Grid>
      )
    }
  }

  const renderNoResult = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AlertCircleOutline sx={{ mr: 2 }} />
      <Typography variant='h6'>No Results Found!</Typography>
    </Box>
  )

  return (
    <Fragment>
      <KnowledgeBaseHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {data !== null ? (
        <Grid container spacing={6} className='match-height'>
          {renderGrid()}
        </Grid>
      ) : (
        renderNoResult
      )}
    </Fragment>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/knowledge-base')
  const apiData: KnowledgeBaseData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default KnowledgeBase
