import { OrderStatus } from "./orders.enums";
import { PaymentStatus } from "../payments/payments.enums";

export interface ShippingAddress {
  fullname: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface OrderType {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  shipping_address: ShippingAddress;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_reference: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItemType {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  product_cover_image: object;
  product_other_images?: object;
  created_at: Date;
}

export interface OrderWithItemsType extends OrderType {
  items: OrderItemType[];
}

export interface GetOrdersQuery {
  page: number;
  limit: number
}
