import React from "react";

export interface WrapperAnimationFCProps {
  children: React.ReactNode | React.ReactNode[];
  triggerOnce: boolean;
  className: string;
  index?: any;
  postData?: any;
}

export type ProductType = {
  id: number;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
};

export type ProductStoreType = {
  id: number;
  name: string;
  thumb: string;
  price: number;
  count: number;
  color: string;
  size: string;
};

export enum TemplateEnum {
  THEME = "theme",
  TEMPLATE = "template",
}

export type ProductContentType<> = {
  url: string;
  postData?: any;
  WrapperAnimation?: React.FunctionComponent<WrapperAnimationFCProps>;
  // index?: any;
  wrapperClass?: any;
  containerTagName?: any;
  hasPaginate?: boolean;
  sortBy?: any;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  view?: any;
  itemColClass?: any;
};

export interface Product {
  id: string;
  title: string;
  image: string;
  newPrice: number;
}

export interface Order {
  orderId: string;
  date: string;
  shippingMethod: string;
  totalItems: number;
  totalPrice: number;
  status: string;
  products: Product[];
}

export interface SubSubcategory {
  _id: string;
  name: string;
  icon: string; // تأكد من إضافة هذه الخاصية

  productCount: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  productCount: number;
  icon: string; // تأكد من إضافة هذه الخاصية

  subcategories: SubSubcategory[];
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  productCount: number;
  subcategories: Subcategory[];
}