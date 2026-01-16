import ActionButton from "@/shared/components/live/ActionButton";


function ClassSnapshot() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Current Batch</h2>
        <p className="text-sm text-slate-500">Full Stack Development</p>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
           <span className="text-slate-600 text-sm">Batch</span>
           <span className="font-medium text-slate-900">Batch A</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
           <span className="text-slate-600 text-sm">Instructor</span>
           <span className="font-medium text-slate-900">John Doe</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50">
           <span className="text-slate-600 text-sm">Next Class</span>
           <span className="font-medium text-blue-600">Tomorrow, 6:00 PM</span>
        </div>
      </div>
      
      <div className="mt-6">
        <ActionButton label="View Course Details" variant="outline" />
      </div>
    </div>
  );
}

export default ClassSnapshot;
