import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Documents"
      description="Generated and uploaded documents."
      group="Main"
      source="app/Filament/Resources/DocumentResource.php"
    />
  );
}
