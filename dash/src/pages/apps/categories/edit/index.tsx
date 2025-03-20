// ** Component Imports

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import CategoryEditForm from 'src/views/apps/categories/edit/Edit';

const InvoiceEdit = () => {
  // بيانات تجريبية مؤقتة، يجب استبدالها بالبيانات الفعلية
  const category = {
    _id: "123",
    name: "تصنيف تجريبي",
    description: "هذا مجرد وصف تجريبي",
    subcategories: [{ _id: "sub1", name: "فرعي 1" }],
  };

  return (
    <DatePickerWrapper sx={{ "& .react-datepicker-wrapper": { width: "auto" } }}>
      <CategoryEditForm id={category._id} category={category} />
    </DatePickerWrapper>
  );
};

export default InvoiceEdit;
