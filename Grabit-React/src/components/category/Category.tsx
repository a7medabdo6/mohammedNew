// "use client";
// import { Col, Row } from "react-bootstrap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import CategoryItem from "../product-item/CategoryItem";
// import useSWR from "swr";
// import fetcher from "../fetcher-api/Fetcher";
// import Spinner from "../button/Spinner";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";

// const Category = ({
//   onSuccess = () => {},
//   hasPaginate = false,
//   onError = () => {},
//   className = "padding-tb-40",
// }) => {
//   const { direction } = useSelector((state: RootState) => state.theme);
//   const { data, error } = useSWR("/api/grocerycategory", fetcher, {
//     onSuccess,
//     onError,
//   });

//   if (error) return <div>Failed to load products11111111</div>;
//   if (!data)
//     return (
//       <div>
//         <Spinner />
//       </div>
//     );

//   const getData = () => {
//     if (hasPaginate) return data.data;
//     else return data;
//   };

//   return (
//     <section className={`gi-category body-bg ${className}`}>
//       <div className="container">
//         <Row className="m-b-minus-15px">
//           <Col xl={12}>
//             <Swiper
//               dir={direction == "RTL" ? "rtl" : "ltr"}
//               loop={true}
//               autoplay={{ delay: 1000 }}
//               slidesPerView={5}
//               spaceBetween={20}
//               breakpoints={{
//                 0: {
//                   slidesPerView: 1,
//                 },
//                 320: {
//                   slidesPerView: 1,
//                 },
//                 425: {
//                   slidesPerView: 2,
//                 },
//                 767: {
//                   slidesPerView: 2,
//                 },
//                 768: {
//                   slidesPerView: 3,
//                 },
//                 1024: {
//                   slidesPerView: 4,
//                 },
//                 1200: {
//                   slidesPerView: 5,
//                 },
//                 1440: {
//                   slidesPerView: 6,
//                 },
//               }}
//               className={`gi-category-block owl-carousel  ${direction == "RTL" ? "rtl" : "ltr"}`}
//             >
//               {getData().map((item: any, index: number) => (
//                 <SwiperSlide
//                   key={index}
//                   className={`gi-cat-box gi-cat-box-${item.num}`}
//                 >
//                   <CategoryItem data={item} />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Col>
//         </Row>
//       </div>
//     </section>
//   );
// };

// export default Category;
"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CategoryItem from "../product-item/CategoryItem";
import Spinner from "../button/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { fetchCategoriesAsync } from "@/store/reducers/categorySlice";

const Category = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
  className = "padding-tb-40",
}) => {
  const dispatch = useDispatch<AppDispatch>();  // تحديد نوع dispatch كـ AppDispatch
  const { direction } = useSelector((state: RootState) => state.theme);

  // استرجاع بيانات الفئات من الـ Redux store
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );
  

  // جلب الفئات عند تحميل الكومبوننت
  useEffect(() => {
    if (!categories) {
      dispatch(fetchCategoriesAsync({ lang: "en", page: 1, limit: 6 }));
    }
  }, [dispatch, categories]);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>حدث خطأ في تحميل الفئات: {error}</div>;
  }

  const getData = () => {
    // تأكد من أن `categories` ليست null أو undefined وهي مصفوفة
    if (!categories || !Array.isArray(categories)) return []; // العودة بمصفوفة فارغة إذا كانت البيانات غير صالحة
    if (hasPaginate) return categories || [];
    else return categories || [];
  };

  return (
    <section className={`gi-category body-bg ${className}`}>
      <div className="container">
        <Row className="m-b-minus-15px">
          <Col xl={12}>
            <Swiper
              dir={direction === "RTL" ? "rtl" : "ltr"}
              loop={true}
              autoplay={{ delay: 1000 }}
              slidesPerView={5}
              spaceBetween={20}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                320: {
                  slidesPerView: 1,
                },
                425: {
                  slidesPerView: 2,
                },
                767: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
                1440: {
                  slidesPerView: 6,
                },
              }}
              className={`gi-category-block owl-carousel  ${
                direction === "RTL" ? "rtl" : "ltr"
              }`}
            >
              {getData().map((item: any, index: number) => (
                <SwiperSlide
                  key={index}
                  className={`gi-cat-box gi-cat-box-${item.num}`}
                >
                  <CategoryItem data={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Category;
