import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Work Orders"
      description="Field work orders / jobs."
      group="Operations"
      source="app/Filament/Resources/JobResource.php"
    />
  );
}
