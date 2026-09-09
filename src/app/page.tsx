import { auth, signOut } from "@/auth";
import { DayModal } from "@/components/DayModal";
import Calendar from "@/components/Calendar";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ChildManageModal } from "@/components/ChildManageModal";
import { Landing } from "@/components/Landing";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const session = await auth();
  if (!session) return <Landing />;

  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year) || now.getFullYear();
  const month = params.month ? Number(params.month) - 1 : now.getMonth();

  return (
    <div className="mx-auto w-[min(98.8vw,1540px)] px-3 pt-6 pb-7">
      <div className="mb-3 flex items-center justify-end gap-3">
        <span className="text-ink-muted text-sm">{session.user?.name}</span>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="text-ink-soft hover:text-ink cursor-pointer text-sm underline"
          >
            ログアウト
          </button>
        </form>
      </div>

      <Header year={year} month={month} />

      <div className="flex items-start gap-4 max-[980px]:flex-col">
        <div className="border-line min-w-0 flex-1 rounded-[18px] border bg-white px-3 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <Calendar year={year} month={month} />
        </div>

        <aside className="border-line w-72 flex-none rounded-[18px] border bg-white px-3.5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] max-[980]:w-full">
          <Sidebar year={year} month={month} />
        </aside>
      </div>

      <DayModal />
      <ChildManageModal />
    </div>
  );
}
