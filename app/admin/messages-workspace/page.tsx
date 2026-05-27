import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Messages"
      description="Unified messaging inbox."
      group="Integrations"
      source="app/Filament/Resources/MessagesWorkspaceResource.php"
    />
  );
}
