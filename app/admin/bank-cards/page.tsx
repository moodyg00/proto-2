import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Cards"
      description="Issued / linked cards."
      group="Banking"
      source="app/Filament/Resources/BankCardResource.php"
    />
  );
}
