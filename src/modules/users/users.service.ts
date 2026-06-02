import db from "@/db";
import { ResponseType } from "@/types/response";
import { User } from "@/modules/users/user.types";

export const getUserByEmail = async (
  email: string,
): Promise<ResponseType<User>> => {
  const user = await db("users").where({ email }).first();
  if (!user) {
    return {
      error: true,
      message: "User not found",
      statusCode: 404,
    };
  }
  return {
    error: false,
    data: user,
  };
};
