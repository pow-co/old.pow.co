// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ id, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage id={id} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get('/apps/users/list')
  const userDate: InvoiceType[] = await res.data.allData

  const paths = userDate.map((item: InvoiceType) => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData: InvoiceType[] = res.data.allData

  return {
    props: {
      invoiceData,
      id: params?.id
    }
  }
}

export default UserView
