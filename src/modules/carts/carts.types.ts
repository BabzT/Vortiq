export interface CartType {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CartItemType {
  id: string;
  cart_id: string;
  quantity: number;
  product_name: string;
  product_price: number;
  product_cover_image: object;
  created_at: Date;
  updated_at: Date;
}

export interface CartWithItemsType extends CartType {
  items: CartItemType[];
}

export interface AddToCartInput {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number
}
