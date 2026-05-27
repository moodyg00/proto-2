import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Invoices"
      description="Customer invoices."
      group="Operations"
      source="app/Filament/Resources/InvoiceResource.php"
    />
  );
}
