import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Assets"
      description="Linked asset records."
      group="Main"
      source="app/Filament/Resources/AssetResource.php"
    />
  );
}
