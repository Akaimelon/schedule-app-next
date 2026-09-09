import Image from "next/image";
import { signIn } from "@/auth";

export function Landing() {
  return (
    <main className="mx-auto w-[min(94vw,880px)] px-4 py-16">
      <div className="text-center">
        <Image
          src="/house_icon.png"
          alt=""
          width={96}
          height={91}
          className="mx-auto h-20 w-20 object-contain"
        />

        <h1 className="text-ink-strong mt-4 text-[32px] font-extrabold tracking-[1px]">
          ひまわり予定表
        </h1>

        <p className="text-ink-soft mx-auto mt-3 max-w-md text-[15px] leading-relaxed">
          学童保育の月間予定表です。子どもごとの出席日・時間帯・送り迎えを、カレンダー上でまとめて管理できます。
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="bg-accent cursor-pointer rounded-xl px-8 py-3.5 font-semibold text-white transition-colors duration-120 hover:bg-[#3f76ae]"
          >
            Google でログイン
          </button>
        </form>

        <p className="text-ink-muted mt-3 text-[13px]">
          ご利用には管理者の承認が必要です
        </p>
      </div>

      <div className="border-line mt-14 overflow-hidden rounded-[18px] border bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <Image
          src="/calendar.png"
          alt="カレンダー画面"
          width={1600}
          height={900}
          className="h-auto w-full"
        />
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        <div className="border-line rounded-[18px] border bg-white px-5 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="text-ink-strong font-semibold">出席と送迎の管理</div>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            日付をクリックして、午前・午後の区分と送り迎えの有無を設定できます。
          </p>
        </div>
        <div className="border-line rounded-[18px] border bg-white px-5 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="text-ink-strong font-semibold">
            先月の予定をコピー
          </div>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            「第2火曜」のように曜日の位置をそろえて写します。祝日と、すでに入っている予定は自動で除きます。
          </p>
        </div>

        <div className="border-line rounded-[18px] border bg-white px-5 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="text-ink-strong font-semibold">利用状況の集計</div>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            契約日数に対する利用日数と残り日数を、その月のぶんだけ自動で計算します。超過した子は赤字で表示されます。
          </p>
        </div>
      </div>
    </main>
  );
}
