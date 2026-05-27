import React from 'react';
import { PagePlaceholder } from '../../../src/components/ui/PagePlaceholder';

export default function Page() {
  return (
    <PagePlaceholder
      title="MCP"
      description="MCP server registry and health."
      group="Integrations"
      source="app/Filament/Resources/McpServerResource.php"
    />
  );
}
