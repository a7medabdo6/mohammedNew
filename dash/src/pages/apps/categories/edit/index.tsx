// ** Demo Components Imports
import Edit from 'src/views/apps/categories/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const InvoiceEdit = () => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id='4987' product={{
        name: { ar: "", en: "" },
        description: { ar: "", en: "" },
        images: [],
        price: 0,
        quantity: 0,
        category: "",
        subcategory: "",
        isOffer: false,
        priceBeforeOffer: 0,
        isTopSelling: false,
        isTopRating: false,
        isTrending: false
      }} />
    </DatePickerWrapper>
  )
}

export default InvoiceEdit
