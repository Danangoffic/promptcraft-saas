import { NextResponse } from "next/server";
import { getUserFromBearerToken } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  const { user } = await getUserFromBearerToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
}
