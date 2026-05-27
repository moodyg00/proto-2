import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Schedule"
      description="Calendar of scheduled work."
      group="Operations"
      source="app/Filament/Resources/SchedulingResource.php"
    />
  );
}
