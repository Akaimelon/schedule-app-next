import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { ChildList } from "@/components/ChildList";
import { ChildForm } from "@/components/ChildForm";
import { DayModal } from "@/components/DayModal";
import Calendar from "@/components/Calendar";

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
    <>
      {session.user?.name}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">ログアウト</button>
      </form>
      <ChildList />
      <ChildForm />
      <Calendar year={year} month={month} />
      <DayModal />
    </>
  );

  redirect("/login");
}
