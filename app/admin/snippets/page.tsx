import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Snippets"
      description="Reusable code/text snippets."
      group="Integrations"
      source="app/Filament/Resources/SnippetResource.php"
    />
  );
}
