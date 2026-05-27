import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Tasks"
      description="Task library and templates."
      group="Main"
      source="app/Filament/Resources/TaskResource.php"
    />
  );
}
