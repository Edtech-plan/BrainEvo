
import ActionButton from "@/shared/components/live/ActionButton";
import ClassCard from "@/shared/components/live/ClassCard";
import SectionHeader from "@/shared/components/live/SectionHeader";


function OngoingClass() {
  const isJoinable = true;

  if (!isJoinable) return null;

  return (
    // OPTIMIZATION: Removed gradient. Used a simple blue border for emphasis. 
    // This is much faster for the browser to render.
    <div className="bg-blue-50/50 rounded-2xl p-1 border border-blue-100">
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <SectionHeader
          title="Ongoing Class"
          subtitle="Happening right now"
        />
        
        <div className="mt-4">
          <ClassCard
            title="Full Stack Development"
            teacher="John Doe"
            time="Started at 6:00 PM"
            status="Live Now"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center">
               {/* Simplified the recording indicator */}
               <span className="text-xs font-bold text-red-600 flex items-center gap-2 px-2">
                 <div className="w-2 h-2 rounded-full bg-red-600" /> 
                 Recording
               </span>
               <div className="w-full sm:w-auto ml-auto">
                 <ActionButton label="Join Live Room" />
               </div>
            </div>
          </ClassCard>
        </div>
      </div>
    </div>
  );
}

export default OngoingClass;
