import { auth } from "@/auth";
import { findUserById } from "@/repositories/userRepository";

export async function requireApprovedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, status: 401, message: "ログインが必要です" } as const;
  }

  const user = await findUserById(session.user.id);
  if (!user) {
    return { ok: false, status: 401, message: "ログインが必要です" } as const;
  }
  if (!user.approved) {
    return {
      ok: false,
      status: 403,
      message: "利用が承認されていません",
    } as const;
  }

  return { ok: true, user } as const;
}
