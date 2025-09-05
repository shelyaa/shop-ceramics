import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import db from "@/src/db/db";

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/");
  const downloadVerificationId = segments[segments.length - 1];

  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  if (!data) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
