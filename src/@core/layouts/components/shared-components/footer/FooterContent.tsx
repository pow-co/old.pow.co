// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© pow.co`}
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Link target='_blank' href='https://github.com/pow-co'>
            Github
          </Link>
          <Link
            target='_blank'
            href='https://demos.themeselection.com/marketplace/materio-mui-react-nextjs-admin-template/documentation'
          >
            API Docs
          </Link>
          <Link
            target='_blank'
            href='https://demos.themeselection.com/marketplace/materio-mui-react-nextjs-admin-template/documentation'
          >
            Web UI Docs
          </Link>
          <Link target='_blank' href='https://themeselection.com/support/'>
            Telegram
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
