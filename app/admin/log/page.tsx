import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Log"
      description="System and audit log."
      group="Administration"
      source="app/Filament/Resources/LogResource.php"
    />
  );
}
