// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import useAPI from '../../@core/hooks/useAPI'

const Top = () => {

  let { data, error, loading } = useAPI('/api/v1/boost/rankings')

  console.log('result', { data, error, loading })

  if (!data && !error) {
    return <>Loading</>
  }

  if (error) {
    return <div>
      <h2>Error</h2>
      <h5>{error}</h5>
    </div>
  }

  const { rankings } = data

  return (
    <Grid container spacing={6}>
      {rankings.map((job) => {
          return (
            <Grid item xs={12}>
            <Card>
              <CardHeader title={`${job.rank}) ${job.content_type}`}></CardHeader>
              <CardContent>
                <Typography sx={{ mb: 2 }}>
                  content: {job.content}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  difficulty: {job.difficulty}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  value: {job.value}
                </Typography>

              </CardContent>
            </Card>
          </Grid>
          )
      })}

    </Grid>
  )
}

export default Top
