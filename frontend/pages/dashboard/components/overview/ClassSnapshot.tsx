function ClassSnapshot() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        My Class
      </h2>

      <div className="space-y-3">
        <p className="text-gray-700 font-medium">
          Full Stack Development – Batch A
        </p>
        <p className="text-sm text-gray-600">
          Instructor: John Doe
        </p>
        <p className="text-sm text-gray-600">
          Next Live Class: Tomorrow, 6:00 PM
        </p>
        <p className="text-sm text-gray-600">
          Attendance: <span className="font-medium">92%</span>
        </p>
      </div>
    </div>
  );
}

export default ClassSnapshot;
