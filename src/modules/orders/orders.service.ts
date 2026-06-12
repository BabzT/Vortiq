import db from "@/db";
import { ResponseType, ResponseTypeWithPagination } from "@/types/response";
import { OrderStatus } from "./orders.enums";
import { PaymentStatus } from "../payments/payments.enums";
import { generateOrderNumber } from "@/helpers/generate";
import { OrderType, OrderWithItemsType, GetOrdersQuery } from "./orders.types";
export const createOrderFromSnapshot = async (snapshot: {
  user_id: string;
  shipping_address: object;
  items: Array<{
    product_id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    product_cover_image: object;
    product_other_images?: object;
  }>;
  payment_reference: string;
}): Promise<ResponseType<string>> => {
  const totalAmount = snapshot.items.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0,
  );

  try {
    const orderId = await db.transaction(async (trx) => {
      const [order] = await trx("orders")
        .insert({
          order_number: generateOrderNumber(),
          user_id: snapshot.user_id,
          total_amount: totalAmount,
          shipping_address: JSON.stringify(snapshot.shipping_address),
          order_status: OrderStatus.PROCESSING,
          payment_status: PaymentStatus.PAID,
          payment_reference: snapshot.payment_reference,
        })
        .returning("id");

      const orderItems = snapshot.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: Number(item.product_price) * item.quantity,
        product_cover_image: JSON.stringify(item.product_cover_image),
        product_other_images: item.product_other_images
          ? JSON.stringify(item.product_other_images)
          : null,
      }));

      await trx("order_items").insert(orderItems);

      for (const item of snapshot.items) {
        // Single atomic UPDATE: decrements only if stock >= quantity.
        // Affected rows = 0 means stock was insufficient (race-safe, no row lock needed).
        const affected = await trx("products")
          .where({ id: item.product_id })
          .where("stock", ">=", item.quantity)
          .decrement("stock", item.quantity);

        if (affected === 0) {
          throw new Error(`Insufficient stock for: ${item.product_name}`);
        }
      }

      return order.id;
    });

    return { error: false, data: orderId };
  } catch (error: any) {
    return { error: true, message: error.message, statusCode: 500 };
  }
};

export const getOrders = async (
  userId: string,
  query: GetOrdersQuery
): Promise<ResponseTypeWithPagination<OrderType[]>> => {
  const { page, limit } = query

  const countQuery = db("orders as o")
    .count("o.id as total").first()

  const ordersQuery = db("orders as o")
    .select(
      "o.id",
      "o.order_number",
      "o.order_status",
      "o.payment_status",
      "o.payment_reference",
      "o.shipping_address",
      db.raw("(SELECT COUNT(*)::int FROM order_items WHERE order_id = o.id) as total_items"),
      "o.total_amount",
      "o.created_at",
      "o.updated_at"
    )
    .where({ user_id: userId })
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset((page - 1) * limit);

  const [count, orders] = await Promise.all([countQuery, ordersQuery])

  const total = Number(count?.total) || 0



  return { error: false, data: orders, pagination: { total, page, limit, total_pages: Math.ceil(total / limit) } };
};

export const getOrderById = async (
  userId: string,
  orderId: string,
): Promise<ResponseType<OrderWithItemsType>> => {
  const order = await db("orders")
    .where({ id: orderId, user_id: userId })
    .first();

  if (!order) {
    return { error: true, message: "Order not found", statusCode: 404 };
  }

  const items = await db("order_items").where({ order_id: orderId });


  return { error: false, data: { ...order, items, total_items: items.length } };
};

export const cancelOrder = async (
  userId: string,
  orderId: string,
): Promise<ResponseType<null>> => {
  const order = await db("orders")
    .where({ id: orderId, user_id: userId })
    .first();

  if (!order) {
    return { error: true, message: "Order not found", statusCode: 404 };
  }

  if (order.order_status !== OrderStatus.PROCESSING) {
    return {
      error: true,
      message: "Only processing orders can be cancelled",
      statusCode: 400,
    };
  }

  await db.transaction(async (trx) => {
    await trx("orders")
      .where({ id: orderId })
      .update({
        order_status: OrderStatus.CANCELLED,
        updated_at: trx.fn.now(),
      });

    const items = await trx("order_items").where({ order_id: orderId });
    for (const item of items) {
      await trx("products")
        .where({ id: item.product_id })
        .increment("stock", item.quantity);
    }
  });

  return { error: false, data: null };
};
