import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Reports"
      description="P&L, balance sheet, cash flow, tax."
      group="Accounting"
      source="app/Filament/Pages/AccountingReport.php"
    />
  );
}
