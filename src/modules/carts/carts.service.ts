import db from "@/db";
import { CartWithItemsType, AddToCartInput, UpdateCartItemInput, } from "./carts.types"
import { ResponseType } from "@/types/response";

// Internal helper
const getOrCreateCart = async (userId: string, trx: any) => {
  let cart = await trx("carts").where({ user_id: userId }).first();
  if (!cart) {
    [cart] = await trx("carts").insert({ user_id: userId }).returning("*");
  }
  return cart;
};

const touchCartTimestamp = async (cartId: string, trx = db) => {
  return await trx("carts")
    .where({ id: cartId })
    .update({ updated_at: trx.fn.now() });
}

export const getCart = async (
  userId: string
): Promise<ResponseType<CartWithItemsType>> => {
  const cart = await db("carts as c").select("c.id", "c.created_at", "c.updated_at").where({ user_id: userId }).first();

  if (!cart) {
    return {
      error: false,
      data: { items: [] }
    }
  }

  const items = await db("cart_items as ci")
    .join("products as p", "ci.product_id", "p.id")
    .select(
      "ci.id",
      "ci.product_id",
      "p.name as product_name",
      "p.price as product_price",
      "ci.quantity",
      "p.cover_image as product_cover_image",
      "ci.created_at",
      "ci.updated_at",
    )
    .where("ci.cart_id", cart.id);

  const subtotal = items.reduce((sum, item) => sum + Number(item.product_price) * item.quantity, 0)

  return { error: false, data: { ...cart, items, total_items: items.length, subtotal } };
};

export const addToCart = async (
  userId: string,
  input: AddToCartInput,
): Promise<ResponseType<null>> => {
  const { product_id, quantity } = input;

  const product = await db("products")
    .where({ id: product_id })
    .select("id", "stock")
    .first();

  if (!product) {
    return {
      error: true,
      message: "Product not found",
      statusCode: 404
    };
  }

  const existingItem = await db("cart_items as ci")
    .join("carts as c", "ci.cart_id", "c.id")
    .where({ "c.user_id": userId, "ci.product_id": product_id })
    .select("ci.quantity")
    .first();

  const existingQuantity = existingItem?.quantity ?? 0;

  if (existingQuantity + quantity > product.stock) {
    return {
      error: true,
      message: "Not enough stock available",
      statusCode: 400
    };
  }

  try {
    await db.transaction(async (trx) => {
      const cart = await getOrCreateCart(userId, trx);

      await trx("cart_items")
        .insert({ cart_id: cart.id, product_id, quantity })
        .onConflict(["cart_id", "product_id"])
        .merge({
          quantity: trx.raw("cart_items.quantity + ?", [quantity]),
          updated_at: trx.fn.now()
        });

      await touchCartTimestamp(cart.id, trx)
    });
  } catch (error) {
    return {
      error: true,
      message: "Failed to add item to cart",
      statusCode: 500
    }
  }

  return {
    error: false,
    data: null
  };
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  input: UpdateCartItemInput,
): Promise<ResponseType<CartWithItemsType>> => {
  const { quantity } = input;

  const item = await db("cart_items as ci")
    .join("carts as c", "ci.cart_id", "c.id")
    .where({ "ci.id": itemId, "c.user_id": userId })
    .select("ci.*")
    .first();

  if (!item) {
    return { error: true, message: "Cart item not found", statusCode: 404 };
  }

  try {
    await db.transaction(async (trx) => {
      await trx("cart_items")
        .where({ id: itemId })
        .update({ quantity, updated_at: trx.fn.now() });

      await touchCartTimestamp(item.cart_id, trx);
    });
  } catch (error) {
    return {
      error: true,
      message: "Failed to update cart item",
      statusCode: 500
    }
  }

  return getCart(userId);
};

export const removeCartItem = async (
  userId: string,
  itemId: string,
): Promise<ResponseType<CartWithItemsType>> => {
  const item = await db("cart_items as ci")
    .join("carts as c", "ci.cart_id", "c.id")
    .where({ "ci.id": itemId, "c.user_id": userId })
    .select("ci.*")
    .first();

  if (!item) {
    return { error: true, message: "Cart item not found", statusCode: 404 };
  }

  try {
    await db.transaction(async (trx) => {
      await trx("cart_items").where({ id: itemId }).delete();
      await touchCartTimestamp(item.cart_id, trx);
    });
  } catch (error) {
    return {
      error: true,
      message: "Failed to remove cart item",
      statusCode: 500
    }
  }

  return getCart(userId);
};

export const clearCart = async (
  userId: string,
): Promise<ResponseType<CartWithItemsType>> => {
  const cart = await db("carts").where({ user_id: userId }).first();

  if (!cart) {
    return { error: false, data: { items: [] } };
  }

  try {
    await db.transaction(async (trx) => {
      await trx("cart_items").where({ cart_id: cart.id }).delete();
      await touchCartTimestamp(cart.id, trx);
    });
  } catch (error) {
    return {
      error: true,
      message: "Failed to clear cart",
      statusCode: 500
    }
  }

  return { error: false, data: { items: [] } };
};
