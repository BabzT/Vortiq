export interface PaystackInitializeInput {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, any>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata?: Record<string, any>;
    customer: { email: string };
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata?: Record<string, any>;
    customer: { email: string };
  };
}

export interface PaystackRefundResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    amount: number;
    currency: string;
    status: string;
  };
}

export interface CheckoutSnapshot {
  user_id: string;
  shipping_address: {
    fullname: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  items: Array<{
    product_id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    product_cover_image: object;
    product_other_images?: object;
  }>;
}
