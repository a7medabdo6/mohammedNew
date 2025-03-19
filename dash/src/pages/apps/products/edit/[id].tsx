// // ** Next Import
// import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// // ** Third Party Imports
// import axios from 'axios'

// // ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// // ** Demo Components Imports
// import Edit from 'src/views/apps/products/edit/Edit'

// // ** Styled Component
// import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// const InvoiceEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
//   return (
//     <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
//       <Edit id={id} />
//     </DatePickerWrapper>
//   )
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await axios.get('/apps/invoice/invoices')
//   const data: InvoiceType[] = await res.data.allData

//   const paths = data.map((item: InvoiceType) => ({
//     params: { id: `${item.id}` }
//   }))

//   return {
//     paths,
//     fallback: false
//   }
// }

// export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
//   return {
//     props: {
//       id: params?.id
//     }
//   }
// }

// export default InvoiceEdit
// ** Next Imports
import { GetServerSideProps } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** API Service

// ** Component Import
import Edit from 'src/views/apps/products/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getProductById } from 'src/services/products'

type ProductPageProps = {
  id: string
  product: any
}

const ProductEdit = ({ id, product }: ProductPageProps) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} product={product} />
    </DatePickerWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.id || typeof params.id !== 'string') {
      return { notFound: true }
    }

    const product = await getProductById(params.id)

    return {
      props: {
        id: params.id,
        product
      }
    }
  } catch (error) {
    return { notFound: true }
  }
}

export default ProductEdit
