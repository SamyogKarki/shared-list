import { CreateListButton } from "@/components/CreateListButton";
import { JoinListInput } from "@/components/JoinListInput";
import { RecentLists } from "@/components/RecentLists";
import { CheckSquare } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen px-4 pt-16 pb-8">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckSquare size={40} strokeWidth={1.5} />
          <h1 className="text-2xl font-bold tracking-tight">ListShare</h1>
          <p className="text-sm text-muted-foreground">Real-time shared lists. No account needed.</p>
        </div>

        <div className="flex flex-col gap-4">
          <CreateListButton />
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or join existing</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <JoinListInput />
        </div>

        <RecentLists />
      </div>
    </main>
  );
}
