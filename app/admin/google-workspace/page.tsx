import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Google Workspace"
      description="Google integration status and scopes."
      group="Integrations"
      source="app/Filament/Resources/GoogleWorkspaceResource.php"
    />
  );
}
