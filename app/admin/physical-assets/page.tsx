import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Physical"
      description="Physical marketing assets (signage, mailers, etc)."
      group="Content & Blog"
      source="app/Filament/Resources/PhysicalAssetResource.php"
    />
  );
}
