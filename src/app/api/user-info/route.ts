import db from "@/src/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userInfoSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  city: z.string().min(1),
  deliveryDepartment: z.number().min(1),
  phoneNumber: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parseResult = userInfoSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation error", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { email, firstName, lastName, city, deliveryDepartment, phoneNumber } = parseResult.data;

  try {
    await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        city,
        deliveryDepartment,
        phoneNumber,
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}