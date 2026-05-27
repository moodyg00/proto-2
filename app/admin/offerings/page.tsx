import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Offerings"
      description="Service offerings and packages."
      group="Accounting"
      source="app/Filament/Resources/OfferingResource.php"
    />
  );
}
