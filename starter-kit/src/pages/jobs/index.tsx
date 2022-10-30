// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import useAPI from '../../@core/hooks/useAPI'

const Top = () => {

  const { data, error, loading } = useAPI('/api/v1/boost/jobs')

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

  const { jobs } = data

  return (
    <Grid container spacing={6}>
      {jobs.map((job: any) => {
          return (
            <Grid item xs={12} key={job.job_txid}>
            <Card>
              <CardHeader title={`${job.timestamp}`}></CardHeader>
              <CardContent>
              <Typography sx={{ mb: 2 }}>
                  job txid: {job.job_txid}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  work txid: {job.spend_txid}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  content: {job.content}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  difficulty: {job.difficulty}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  value: {job.value}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                tag: {job.tag}
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
