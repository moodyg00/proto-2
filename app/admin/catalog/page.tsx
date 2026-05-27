import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Catalog"
      description="Inventory and product catalog."
      group="Accounting"
      source="app/Filament/Resources/CatalogResource.php"
    />
  );
}
