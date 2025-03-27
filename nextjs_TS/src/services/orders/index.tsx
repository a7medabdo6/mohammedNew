import { useState, useEffect } from "react";
import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';
// نوع بيانات الطلب
interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { product: string; quantity: number }[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address: string;
  paymentMethod: "credit_card" | "paypal" | "cash_on_delivery";
  createdAt: string;
}

// 1️⃣ جلب الطلبات مع فلترة حسب الحالة باستخدام Axios
export const fetchOrders = async (status?: string): Promise<Order[]> => {
  try {
    const response = await axiosInstance.get("/orders", {
      params: status ? { status } : {}, // تمرير الحالة إذا كانت موجودة كـ Query Param
    });
    return response.data.orders;
  } catch (error) {
    console.error("خطأ في جلب الطلبات:", error);
    return [];
  }
};

// 2️⃣ تحديث حالة الطلب باستخدام Axios
export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  try {
    await axiosInstance.put(`/orders/${orderId}`, { status });
    return true;
  } catch (error) {
    console.error("خطأ في تحديث الحالة:", error);
    return false;
  }
};


export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    // إرسال طلب حذف للـ backend
    await axiosInstance.delete(`/orders/${orderId}`);
    return true;
  } catch (error) {
    console.error("خطأ في حذف الطلب:", error);
    return false;
  }
};


// نوع بيانات الطلب
interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { product: string; quantity: number }[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address: string;
  paymentMethod: "credit_card" | "paypal" | "cash_on_delivery";
  createdAt: string;
}

// 3️⃣ جلب تفاصيل الطلب باستخدام Axios
export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  console.log(orderId)
  try {
    // إرسال طلب GET للحصول على تفاصيل الطلب حسب الـ ID
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data.order; // Assuming the response contains an order object
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الطلب:", error);
    return null; // Return null if there's an error
  }
};
