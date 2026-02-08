import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-[#e5a91a] mb-2">
          LEGO QUEST
        </h1>
        <p className="text-lg text-zinc-400">Digital GM Toolkit</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link
          href="/character"
          className="flex items-center justify-center gap-3 rounded-xl bg-[#16213e] border border-[#0f3460] px-6 py-5 text-lg font-semibold hover:bg-[#0f3460] transition-colors"
        >
          <span className="text-2xl">🛡️</span>
          Character Sheets
        </Link>

        <Link
          href="/combat"
          className="flex items-center justify-center gap-3 rounded-xl bg-[#16213e] border border-[#0f3460] px-6 py-5 text-lg font-semibold hover:bg-[#0f3460] transition-colors"
        >
          <span className="text-2xl">⚔️</span>
          Combat Tracker
        </Link>

        <Link
          href="/config"
          className="flex items-center justify-center gap-3 rounded-xl bg-[#16213e] border border-[#0f3460] px-6 py-5 text-lg font-semibold hover:bg-[#0f3460] transition-colors"
        >
          <span className="text-2xl">⚙️</span>
          GM Config
        </Link>
      </div>

      <p className="text-sm text-zinc-600 mt-8">
        Built for iPad &bull; Dark Fantasy Theme &bull; Claude AI Powered
      </p>
    </div>
  );
}
