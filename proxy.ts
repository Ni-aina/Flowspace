import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*"]
}