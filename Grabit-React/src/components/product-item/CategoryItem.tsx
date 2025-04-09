// import Link from "next/link";
// import React from "react";

// const CategoryItem = ({ data }) => {
//   return (
//     <div className="gi-cat-icon">
//       <span className="gi-lbl">{data.persantine}</span>
//       <i className={data.icon}></i>
//       <div className="gi-cat-detail">
//         <Link href="/shop-left-sidebar-col-3">
//           <h4 className="gi-cat-title">{data.name}</h4>
//         </Link>
//         <p className="items">{data.item} Items</p>
//       </div>
//     </div>
//   );
// };

// export default CategoryItem;

import Link from "next/link";
import React from "react";

const CategoryItem = ({ data }) => {
  return (
    <div className="gi-cat-icon" style={{ height: "150px" }}> {/* تحديد ارتفاع الكارت */}
      {/* عرض الأيقونة */}
      <img src={data.icon} alt={data.name} className="category-icon" />

      <div className="gi-cat-detail">
        {/* رابط إلى صفحة الفئة */}
        <Link href="/shop-left-sidebar-col-3">
          <h4 className="gi-cat-title">{data?.name}</h4>
        </Link>
        {/* عرض عدد المنتجات */}
        <p className="items">{data.productCount > 0 ? `${data.productCount} Items` : "No items available"}</p>
      </div>
    </div>
  );
};

export default CategoryItem;
