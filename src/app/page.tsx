import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { ChildPanel } from "@/components/ChildPanel";
import { DayModal } from "@/components/DayModal";
import Calendar from "@/components/Calendar";
import { Header } from "@/components/Header";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year) || now.getFullYear();
  const month = params.month ? Number(params.month) - 1 : now.getMonth();

  return (
    <div className="mx-auto w-[min(98.8vw,1540px)] px-3 pt-6 pb-7">
      {session.user?.name}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">ログアウト</button>
      </form>

      <Header />

      <div className="flex items-start gap-4 max-[980px]:flex-col">
        {/* カード1：カレンダー */}

        <div className="border-line min-w-0 flex-1 rounded-[18px] border bg-white px-3 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <Calendar year={year} month={month} />
        </div>

        {/* カード2：サイドバー */}
        <aside className="border-line w-72 flex-none rounded-[18px] border bg-white px-3.5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] max-[980]:w-full">
          <ChildPanel />
        </aside>
      </div>

      <DayModal />
    </div>
  );
}
