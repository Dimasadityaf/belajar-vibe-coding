import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const userRoutes = new Elysia({ prefix: "/api/users" })
  .get("/", async () => {
    try {
      const allUsers = await db.select().from(users);
      return { success: true, data: allUsers };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      };
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const result = await db.insert(users).values({
          name: body.name,
          email: body.email,
        });
        set.status = 201;
        return {
          success: true,
          message: "User created successfully",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to create user",
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
      }),
    }
  )
  .get("/:id", async ({ params: { id }, set }) => {
    try {
      const numId = Number(id);
      if (isNaN(numId)) {
        set.status = 400;
        return { success: false, message: "Invalid ID parameter" };
      }
      const [user] = await db.select().from(users).where(eq(users.id, numId)).limit(1);
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
