import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="Users"
      description="Users, roles, and permissions."
      group="Administration"
      source="app/Filament/Resources/UserResource.php"
    />
  );
}
