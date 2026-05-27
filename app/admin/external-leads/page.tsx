import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="External Leads"
      description="Incoming leads from external sources."
      group="Integrations"
      source="app/Filament/Resources/ExternalLeadResource.php"
    />
  );
}
