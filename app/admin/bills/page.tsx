import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Bills"
      description="A/P bills."
      group="Banking"
      source="app/Filament/Resources/BillResource.php"
    />
  );
}
