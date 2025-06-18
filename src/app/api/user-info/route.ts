import db from "@/src/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { firstName, lastName, city, deliveryDepartment, phoneNumber } = await req.json();

  if (!firstName || !lastName || !city || !deliveryDepartment || !phoneNumber) {
    return NextResponse.json({ error: "Validation error" }, { status: 400 });
  }

  try {
    await db.user.create({
      data: {
        firstName,
        lastName,
        city,
        deliveryDepartment,
        phoneNumber,
        // userId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}