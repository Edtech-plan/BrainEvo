function AttentionAlerts() {
  const alerts = [
    'You missed 1 assignment deadline',
  ];

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-red-200 p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Attention Needed
      </h2>

      <ul className="space-y-2 text-sm text-gray-700">
        {alerts.map((alert, index) => (
          <li key={index}>• {alert}</li>
        ))}
      </ul>
    </div>
  );
}

export default AttentionAlerts;
