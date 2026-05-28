'use client';

import React from 'react';
import { RecordIndexPage } from '@/src/components/admin/RecordIndexPage';
import { ORGANIZATIONS_CONFIG } from '@/src/components/admin/record-index-config';

export default function OrganizationsPage() {
  return <RecordIndexPage config={ORGANIZATIONS_CONFIG} />;
}
