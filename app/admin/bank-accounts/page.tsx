import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Bank Accounts"
      description="Connected bank/credit accounts."
      group="Banking"
      source="app/Filament/Resources/BankAccountResource.php"
    />
  );
}
