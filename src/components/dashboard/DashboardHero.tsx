import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type DashboardHeroProps = {
  weeklyTotal: number;
  weeklyGoal: number;
  trend: number | null;
};

export default function DashboardHero({
  weeklyTotal,
  weeklyGoal,
  trend,
}: DashboardHeroProps): JSX.Element {
  const remaining = Math.max(weeklyGoal - weeklyTotal, 0);
  const goalCopy =
    remaining === 0
      ? "Weekly goal reached. Keep the momentum going."
      : `${remaining} application${remaining === 1 ? "" : "s"} away from this week's target.`;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-2xl">
      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm tracking-wide text-white/70">Weekly focus</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {weeklyTotal > 0
                ? `Great work—${weeklyTotal} application${weeklyTotal === 1 ? "" : "s"} so far`
                : "Kickstart your application streak"}
            </h1>
          </div>
          <p className="text-white/80">{goalCopy}</p>
          <p className="text-xs uppercase text-white/60">
            7-day trend: {trend !== null ? `${trend >= 0 ? "+" : ""}${trend}%` : "N/A"}
          </p>
        </div>
        <div className="space-y-3 text-white">
          <p className="text-sm text-white/70">
            Add a new opportunity or log activity to stay on target.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="bg-white text-slate-900">
              <Link href="/dashboard/myjobs">Add job</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="border border-white/40 text-white hover:bg-white/10"
            >
              <Link href="/dashboard/activities">Log activity</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

