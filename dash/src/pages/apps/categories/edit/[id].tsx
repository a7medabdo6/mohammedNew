import { GetServerSideProps } from "next/types";

// ** API Service
import { getCategoryById } from "src/services/categories";

// ** Component Import

// ** Styled Component
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import CategoryEditForm from "src/views/apps/categories/edit/Edit";

// ** Define Interface for Category
interface CategoryData {
  _id: string;
  name: string;
  description?: string;
  subcategories?: { _id: string; name: string }[];
}

type CategoryPageProps = {
  id: string;
  category: CategoryData;
};

const CategoryEdit = ({ id, category }: CategoryPageProps) => {
  return (
    <DatePickerWrapper sx={{ "& .react-datepicker-wrapper": { width: "auto" } }}>
      <CategoryEditForm id={id} category={category} />
    </DatePickerWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.id || typeof params.id !== "string") {
      return { notFound: true };
    }

    const category = await getCategoryById(params.id);

    return {
      props: {
        id: params.id,
        category,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default CategoryEdit;
