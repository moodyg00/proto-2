import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Social Media"
      description="Social posts across channels."
      group="Content & Blog"
      source="app/Filament/Resources/SocialMediaPostResource.php"
    />
  );
}
