import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      { Variable_name: string; Value: string }[]
    >`SHOW SESSION STATUS LIKE 'Ssl_cipher'`;

    const cipher = rows[0]?.Value ?? "";

    return Response.json({
      ok: true,
      tls: cipher !== "",
      cipher,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "DBに接続できません" },
      {
        status: 503,
      },
    );
  }
}
