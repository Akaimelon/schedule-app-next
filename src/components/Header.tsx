import Image from "next/image";

export function Header() {
  return (
    <header className="mb-5.5 flex items-start justify-between gap-6 max-[980px]:flex-col max-[980px]:items-stretch">
      <div className="flex items-center gap-4">
        <Image
          src="/house_icon.png"
          alt=""
          width={96}
          height={91}
          className={"h-15 w-15 shrink-0 object-contain"}
        />
        <div>
          <div className="text-ink-strong text-[28px] font-extrabold tracking-[1px] whitespace-nowrap">
            ひまわり予定表
          </div>
          <div className="text-ink-muted mt-1 text-sm">
            月間スケジュールを管理し、子どもたちの利用状況を把握しましょう
          </div>
        </div>
      </div>
    </header>
  );
}
