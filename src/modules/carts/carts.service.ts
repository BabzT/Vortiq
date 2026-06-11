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

const touchCartTimestamp = async (cartId: string) => {
  return await db("carts")
    .where({ id: cartId })
    .update({ updated_at: db.fn.now() });
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
  return { error: false, data: { ...cart, items } };
};

export const addToCart = async (
  userId: string,
  input: AddToCartInput,
): Promise<ResponseType<CartWithItemsType>> => {
  const { product_id, quantity } = input;

  const transactionResult = await db.transaction(async (trx) => {
    const product = await trx("products")
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

    if (product.stock <= 0) {
      return {
        error: true,
        message: "Out of stock",
        statusCode: 400
      }
    }

    const cart = await getOrCreateCart(userId, trx);

    await trx("cart_items")
      .insert({ cart_id: cart.id, product_id, quantity })
      .onConflict(["cart_id", "product_id"])
      .merge({
        quantity: trx.raw("cart_items.quantity + ?", [quantity]),
        updated_at: trx.fn.now()
      });

    await touchCartTimestamp(cart.id)

  });

  if (transactionResult?.error) return {
    error: true,
    message: transactionResult?.message,
    statusCode: transactionResult?.statusCode
  }

  return getCart(userId);
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

  await db("cart_items").where({ id: itemId }).update({ quantity, updated_at: db.fn.now() });

  await touchCartTimestamp(item.cart_id)

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

  await db("cart_items").where({ id: itemId }).delete();

  await touchCartTimestamp(item.cart_id)

  return getCart(userId);
};

export const clearCart = async (
  userId: string,
): Promise<ResponseType<CartWithItemsType>> => {
  const cart = await db("carts").where({ user_id: userId }).first();
  if (!cart) {
    return { error: false, data: { items: [] } };
  }

  await db("cart_items").where({ cart_id: cart.id }).delete();

  await touchCartTimestamp(cart.id)

  return { error: false, data: { items: [] } };
};
