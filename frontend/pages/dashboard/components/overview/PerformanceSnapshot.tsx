function PerformanceSnapshot() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        Performance Snapshot
      </h2>

      <div className="space-y-4">
        {/* Simple Progress Bar Example */}
        <div>
           <div className="flex justify-between text-sm mb-1">
             <span className="text-slate-600">On-time Submissions</span>
             <span className="font-semibold text-slate-900">90%</span>
           </div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-[90%] rounded-full" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-slate-50 rounded-lg text-center">
             <div className="text-2xl font-bold text-slate-900">1</div>
             <div className="text-xs text-slate-500 uppercase tracking-wide">Missed Deadlines</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center">
             <div className="text-2xl font-bold text-emerald-600">Up</div>
             <div className="text-xs text-slate-500 uppercase tracking-wide">Attendance Trend</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceSnapshot;
