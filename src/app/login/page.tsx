import Image from "next/image";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="border-line w-full max-w-sm rounded-[18px] border bg-white px-8 py-10 text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <Image
          src="/house_icon.png"
          alt=""
          width={96}
          height={91}
          className="mx-auto h-20 w-20 object-contain"
        />

        <h1 className="text-ink-strong mt-4 text-[24px] font-extrabold tracking-[1px]">
          ひまわり予定表
        </h1>
        <p className="text-ink-muted mt-2 text-sm">
          続けるには GitHub でログインしてください
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
          className="mt-7"
        >
          <button
            type="submit"
            className="bg-accent w-full cursor-pointer rounded-xl px-4 py-3 font-semibold text-white transition-colors duration-120 hover:bg-[#3f76ae]"
          >
            GitHub でログイン
          </button>
        </form>
      </div>
    </main>
  );
}
