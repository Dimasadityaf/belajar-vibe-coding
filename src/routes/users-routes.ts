import { Elysia, t } from "elysia";
import { UsersService } from "../service/users-service";
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const result = await UsersService.register({
          name: body.name,
          email: body.email,
          password: body.password,
        });

        set.status = 201;
        return result;
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400;
          return { Error: "Email sudah terdaftar" };
        }

        set.status = 500;
        return { Error: error.message || "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, error: "Name wajib diisi" }),
        email: t.String({ minLength: 1, error: "Email wajib diisi" }),
        password: t.String({ minLength: 1, error: "Password wajib diisi" }),
      }),
    }
  )
  .get("/", async () => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users);

      return { success: true, data: allUsers };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      };
    }
  })
  .get("/:id", async ({ params: { id }, set }) => {
    try {
      const numId = Number(id);
      if (isNaN(numId)) {
        set.status = 400;
        return { success: false, message: "Invalid ID parameter" };
      }

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, numId))
        .limit(1);

      if (!user) {
        set.status = 404;
        return { success: false, message: "User not found" };
      }

      return { success: true, data: user };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        message: "Failed to get user",
        error: error.message,
      };
    }
  });
