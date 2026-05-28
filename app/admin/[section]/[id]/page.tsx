import { notFound } from 'next/navigation';

import { SingleRecordViewPage } from '@/src/components/admin/SingleRecordViewPage';
import {
  ADS_CONFIG,
  BANK_ACCOUNTS_CONFIG,
  BANK_CARDS_CONFIG,
  CAMPAIGNS_CONFIG,
  CATALOG_CONFIG,
  CHART_OF_ACCOUNTS_CONFIG,
  CONTACTS_CONFIG,
  ESTIMATES_CONFIG,
  INVOICES_CONFIG,
  LEADS_CONFIG,
  OFFERINGS_CONFIG,
  ORGANIZATIONS_CONFIG,
  WORK_ORDERS_CONFIG,
} from '@/src/components/admin/record-index-config';

type PageParams = {
  section: string;
  id: string;
};

const RECORD_INDEX_CONFIG_BY_SECTION = {
  ads: ADS_CONFIG,
  'bank-accounts': BANK_ACCOUNTS_CONFIG,
  'bank-cards': BANK_CARDS_CONFIG,
  campaigns: CAMPAIGNS_CONFIG,
  catalog: CATALOG_CONFIG,
  'chart-of-accounts': CHART_OF_ACCOUNTS_CONFIG,
  contacts: CONTACTS_CONFIG,
  estimates: ESTIMATES_CONFIG,
  invoices: INVOICES_CONFIG,
  jobs: WORK_ORDERS_CONFIG,
  leads: LEADS_CONFIG,
  offerings: OFFERINGS_CONFIG,
  organizations: ORGANIZATIONS_CONFIG,
} as const;

const BILL_RECORDS = [
  { id: 'bill_001', vendor: 'Allied Supply', description: 'Copper fittings and valves', dueDate: '2026-06-03', amount: 4280, status: 'pending' },
  { id: 'bill_002', vendor: 'Metro Logistics', description: 'Fleet service and toll pass', dueDate: '2026-05-30', amount: 920, status: 'paid' },
  { id: 'bill_003', vendor: 'North Electric', description: 'Panel components batch', dueDate: '2026-05-25', amount: 3180, status: 'overdue' },
  { id: 'bill_004', vendor: 'Studio Print Co', description: 'Campaign print collateral', dueDate: '2026-06-08', amount: 640, status: 'draft' },
  { id: 'bill_005', vendor: 'Twilio', description: 'SMS and call routing usage', dueDate: '2026-06-01', amount: 380, status: 'pending' },
] as const;

const USER_RECORDS = [
  { id: 'usr_001', name: 'Jordan Diaz', email: 'jordan@proto2.app', role: 'admin', status: 'active', lastSeen: '2m ago' },
  { id: 'usr_002', name: 'Nina Tran', email: 'nina@proto2.app', role: 'manager', status: 'active', lastSeen: '19m ago' },
  { id: 'usr_003', name: 'Sam Ortega', email: 'sam@proto2.app', role: 'operator', status: 'pending', lastSeen: 'never' },
  { id: 'usr_004', name: 'Maya Chen', email: 'maya@proto2.app', role: 'manager', status: 'active', lastSeen: '1h ago' },
  { id: 'usr_005', name: 'Alex Reid', email: 'alex@proto2.app', role: 'operator', status: 'blocked', lastSeen: '4d ago' },
] as const;

const TRANSACTION_RECORDS = [
  { id: 'tx_001', date: '2026-05-27', avatar: 'AC', name: 'Acme Corp', description: 'Invoice #4821 payment', amount: 12450, type: 'income', status: 'posted' },
  { id: 'tx_002', date: '2026-05-27', avatar: 'ST', name: 'Stripe', description: 'Payout batch May 26', amount: 8920, type: 'income', status: 'posted' },
  { id: 'tx_003', date: '2026-05-26', avatar: 'AD', name: 'Adobe', description: 'Creative Cloud subscription', amount: -5999, type: 'expense', status: 'posted' },
  { id: 'tx_004', date: '2026-05-26', avatar: 'GG', name: 'Google Ads', description: 'Campaign spend - May', amount: -1240, type: 'expense', status: 'pending' },
  { id: 'tx_005', date: '2026-05-25', avatar: 'SH', name: 'Shopify', description: 'Platform fees', amount: -450, type: 'expense', status: 'posted' },
  { id: 'tx_006', date: '2026-05-25', avatar: 'CL', name: 'Client: Vertex Labs', description: 'Retainer Q2', amount: 8500, type: 'income', status: 'reconciled' },
  { id: 'tx_007', date: '2026-05-24', avatar: 'AP', name: 'Apple', description: 'iCloud storage', amount: -99, type: 'expense', status: 'posted' },
  { id: 'tx_008', date: '2026-05-24', avatar: 'TW', name: 'Twilio', description: 'SMS & voice API', amount: -320, type: 'expense', status: 'failed' },
] as const;

const TABLE_RECORDS_BY_SECTION = {
  'bank-transactions': { title: 'Bank Transactions', records: TRANSACTION_RECORDS },
  bills: { title: 'Bills', records: BILL_RECORDS },
  users: { title: 'Users', records: USER_RECORDS },
} as const;

function toSchemaRecord(record: {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  metric?: string;
  accent?: string;
  badge?: { label: string; variant?: string };
  tags?: string[];
  meta: Array<{ label: string; value: string }>;
}) {
  return {
    id: record.id,
    name: record.name,
    subtitle: record.subtitle,
    category: record.category,
    metric: record.metric ?? null,
    accent: record.accent ?? null,
    badge: record.badge ?? null,
    tags: record.tags ?? [],
    meta: record.meta.reduce<Record<string, string>>((acc, item) => {
      acc[item.label] = item.value;
      return acc;
    }, {}),
  };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { id, section } = await params;

  const recordIndexConfig = RECORD_INDEX_CONFIG_BY_SECTION[section as keyof typeof RECORD_INDEX_CONFIG_BY_SECTION];
  if (recordIndexConfig) {
    const record = recordIndexConfig.records.find((entry) => entry.id === id);
    if (!record) notFound();

    return (
      <SingleRecordViewPage
        sectionTitle={recordIndexConfig.title}
        recordTitle={record.name}
        recordId={record.id}
        record={toSchemaRecord(record)}
        backHref={`/admin/${section}`}
      />
    );
  }

  const tableSection = TABLE_RECORDS_BY_SECTION[section as keyof typeof TABLE_RECORDS_BY_SECTION];
  if (tableSection) {
    const record = tableSection.records.find((entry) => entry.id === id);
    if (!record) notFound();

    return (
      <SingleRecordViewPage
        sectionTitle={tableSection.title}
        recordTitle={'name' in record ? String(record.name) : String(record.id)}
        recordId={String(record.id)}
        record={record as unknown as Record<string, unknown>}
        backHref={`/admin/${section}`}
      />
    );
  }

  notFound();
}
