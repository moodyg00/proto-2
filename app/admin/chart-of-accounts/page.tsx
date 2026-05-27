import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Chart of Accounts"
      description="GL account hierarchy."
      group="Accounting"
      source="app/Filament/Resources/ChartOfAccountResource.php"
    />
  );
}
