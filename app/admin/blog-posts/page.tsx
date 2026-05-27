import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Blog"
      description="Blog post authoring and publishing."
      group="Content & Blog"
      source="app/Filament/Resources/BlogPostResource.php"
    />
  );
}
