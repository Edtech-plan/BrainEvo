import { AlertCard } from '../../../../src/shared/components/ui';

function AttentionAlerts() {
  const alerts = ['You missed 1 assignment deadline'];

  return (
    <AlertCard
      title="Attention Needed"
      alerts={alerts}
      variant="error"
    />
  );
}

export default AttentionAlerts;
