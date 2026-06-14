import { useEffect, useState } from "react";
import { LOGIN_CALENDAR, claimLoginReward, syncLogin } from "@/lib/snake/loginRewards";
import { type LoginState } from "@/lib/snake/settings";

export function DailyLoginModal() {
  const [minimized, setMinimized] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<LoginState | null>(null);
  const [claimed, setClaimed] = useState<string | null>(null);

  useEffect(() => {
    const l = syncLogin();
    setState(l);
    if (!l.claimedToday) setOpen(true);
  }, []);

  if (!open || !state) return null;
  const todayReward = LOGIN_CALENDAR[state.index];

  const handleClaim = () => {
    const r = claimLoginReward();
    if (r) {
      setClaimed(r.label);
      setTimeout(() => setMinimized(true), 600);
    }
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-[55] neon-panel rounded-full px-4 py-2 text-xs font-semibold animate-fade-up"
        style={{ boxShadow: "0 0 20px rgba(125,249,255,.35)" }}
      >
        ✓ Daily Reward Claimed
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-background/70 backdrop-blur-md animate-fade-up"
      onClick={() => setOpen(false)}
    >
      <div className="neon-panel rounded-3xl p-5 w-full max-w-md m-3" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Daily Reward</div>
          <div className="text-xl font-bold neon-text mt-1">Welcome Back!</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {LOGIN_CALENDAR.map((r, i) => {
            const isToday = i === state.index;
            const past = i < state.index;
            return (
              <div
                key={i}
                className="rounded-xl p-2 text-center border"
                style={{
                  borderColor: isToday ? "#7df9ff" : past ? "rgba(57,255,136,.4)" : "rgba(255,255,255,.08)",
                  background: isToday
                    ? "linear-gradient(180deg, rgba(125,249,255,.18), rgba(167,139,250,.18))"
                    : past
                      ? "rgba(57,255,136,.08)"
                      : "rgba(255,255,255,.03)",
                  boxShadow: isToday ? "0 0 16px rgba(125,249,255,.4)" : undefined,
                }}
              >
                <div className="text-[9px] uppercase text-muted-foreground">D{r.day}</div>
                <div className="text-[10px] font-semibold mt-0.5 leading-tight">{r.label.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 neon-panel rounded-2xl p-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Today · Day {state.index + 1}
          </div>
          <div className="text-lg font-bold neon-text mt-1">{todayReward.label}</div>
          {claimed ? (
            <div className="mt-3 text-sm text-green-300 animate-fade-up">Claimed! Minimizing…</div>
          ) : (
            <button className="neon-btn neon-btn-hover mt-3 w-full" onClick={handleClaim}>
              Claim Reward
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="mt-3 w-full text-xs text-muted-foreground uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    </div>
  );
}
