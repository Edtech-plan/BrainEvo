import { Card } from "@/shared/components/ui";

function PerformanceSnapshot() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        Performance Snapshot
      </h2>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">On-time Submissions</span>
            <span className="font-bold text-slate-900">90%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[90%] rounded-full" />
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
            <div className="text-2xl font-bold text-slate-900 mb-1">1</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
              Missed Deadlines
            </div>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600 mb-1">Up</div>
            <div className="text-xs text-emerald-700 uppercase tracking-wide font-semibold">
              Attendance Trend
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PerformanceSnapshot;
