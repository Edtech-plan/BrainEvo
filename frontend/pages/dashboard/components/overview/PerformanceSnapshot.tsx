function PerformanceSnapshot() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Performance Snapshot
      </h2>

      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          On-time Submissions: <strong>90%</strong>
        </p>
        <p className="text-sm text-gray-700">
          Missed Deadlines: <strong>1</strong>
        </p>
        <p className="text-sm text-gray-700">
          Attendance Trend: <strong>Improving</strong>
        </p>
      </div>
    </div>
  );
}

export default PerformanceSnapshot;
