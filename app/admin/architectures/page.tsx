import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Architecture"
      description="Agent architectures (memory + tools)."
      group="AI Tools"
      source="app/Filament/Resources/ArchitectureResource.php"
    />
  );
}
