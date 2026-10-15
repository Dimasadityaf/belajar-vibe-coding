import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/users";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class UsersService {
  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return existing ?? null;
  }

  /**
   * Register a new user
   * Throws an Error with message "Email sudah terdaftar" if email exists
   */
  static async register(data: RegisterUserInput) {
    // 1. Check if email already registered
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Hash password using bcrypt
    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Insert user into database
    await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return { data: "OK" };
  }
}
