import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Agents"
      description="Agent registry and configuration."
      group="AI Tools"
      source="app/Filament/Resources/AgentResource.php"
    />
  );
}
