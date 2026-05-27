import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Transactions"
      description="Bank transactions and categorization."
      group="Banking"
      source="app/Filament/Resources/BankTransactionResource.php"
    />
  );
}
