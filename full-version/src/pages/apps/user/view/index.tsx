// ** Next Import
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage id='1' invoiceData={invoiceData} />
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData: InvoiceType[] = res.data.allData

  return {
    props: {
      invoiceData
    }
  }
}

export default UserView
