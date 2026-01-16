import { AlertCard } from "@/shared/components/ui";


function AttentionAlerts() {
  const alerts = [
  'You missed 1 assignment deadline on Mar 12',
  'Your live class on React Hooks starts in 30 minutes',
  'New project feedback has been posted by your mentor',
  'Your subscription will expire in 3 days',
  'You have 2 unread messages in the discussion forum'
  ];


  return (
    <div className="h-full">
      <AlertCard
        title="Attention Needed"
        alerts={alerts}
        variant="error"
        className="h-full"
      />
    </div>
  );
}

export default AttentionAlerts;
