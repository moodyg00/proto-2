'use client';

import React from 'react';
import { RecordIndexPage } from '@/src/components/admin/RecordIndexPage';
import { CONTACTS_CONFIG } from '@/src/components/admin/record-index-config';

export default function ContactsPage() {
  return <RecordIndexPage config={CONTACTS_CONFIG} />;
}
