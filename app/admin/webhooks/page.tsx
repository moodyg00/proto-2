import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Webhooks"
      description="Inbound and outbound webhook subscriptions."
      group="Integrations"
      source="app/Filament/Resources/WebhookResource.php"
    />
  );
}
