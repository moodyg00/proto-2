import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { Client } from 'pg';

const envPaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const connectionString =
  process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_POOLER_URL;
if (!connectionString) {
  throw new Error(
    'No database URL is set. Create .env.local with DATABASE_URL (or SUPABASE_DB_URL / SUPABASE_POOLER_URL).'
  );
}

const client = new Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});

const ids = {
  users: {
    admin: '11111111-1111-1111-1111-111111111111',
    manager: '22222222-2222-2222-2222-222222222222',
    operator: '33333333-3333-3333-3333-333333333333',
  },
  business: '44444444-4444-4444-4444-444444444444',
  organizations: {
    northside: '55555555-5555-5555-5555-555555555551',
    oakridge: '55555555-5555-5555-5555-555555555552',
    summit: '55555555-5555-5555-5555-555555555553',
    alliedSupply: '55555555-5555-5555-5555-555555555554',
    metroLogistics: '55555555-5555-5555-5555-555555555555',
  },
  contacts: {
    avery: '66666666-6666-6666-6666-666666666661',
    jordan: '66666666-6666-6666-6666-666666666662',
    mara: '66666666-6666-6666-6666-666666666663',
  },
  leads: {
    northside: '77777777-7777-7777-7777-777777777771',
    oakridge: '77777777-7777-7777-7777-777777777772',
    summit: '77777777-7777-7777-7777-777777777773',
  },
  bankAccounts: {
    operating: '88888888-8888-8888-8888-888888888881',
    cardClearing: '88888888-8888-8888-8888-888888888882',
  },
  bankMerchants: {
    stripe: '99999999-9999-9999-9999-999999999991',
    adobe: '99999999-9999-9999-9999-999999999992',
    googleAds: '99999999-9999-9999-9999-999999999993',
    twilio: '99999999-9999-9999-9999-999999999994',
  },
  bankCards: {
    operations: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    marketing: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  },
  bankTransactions: {
    income1: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    income2: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    expense1: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    expense2: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
  },
  bills: {
    allied: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    north: 'cccccccc-cccc-cccc-cccc-ccccccccccc2',
  },
  payments: {
    bill1: 'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    bill2: 'dddddddd-dddd-dddd-dddd-ddddddddddd2',
  },
  expenses: {
    adobe: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
    metro: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
  },
};

function quoteIdentifier(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function serializeValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return JSON.stringify(value);
  }

  return value;
}

async function upsertById(table, row) {
  const entries = Object.entries(row).filter(([, value]) => value !== undefined);
  const columns = entries.map(([key]) => quoteIdentifier(key));
  const placeholders = entries.map((_, index) => `$${index + 1}`);
  const updateAssignments = entries
    .filter(([key]) => key !== 'id')
    .map(([key]) => `${quoteIdentifier(key)} = EXCLUDED.${quoteIdentifier(key)}`);

  const query = updateAssignments.length > 0
    ? `INSERT INTO ${quoteIdentifier(table)} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT (${quoteIdentifier('id')}) DO UPDATE SET ${updateAssignments.join(', ')}`
    : `INSERT INTO ${quoteIdentifier(table)} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT (${quoteIdentifier('id')}) DO NOTHING`;

  await client.query(query, entries.map(([, value]) => serializeValue(value)));
}

async function main() {
  await client.connect();
  await client.query('BEGIN');

  try {
    const now = new Date();
    const today = new Date('2026-05-29T00:00:00.000Z');
    const nextWeek = new Date('2026-06-05T00:00:00.000Z');

    const userRows = [
      {
        id: ids.users.admin,
        email: 'jordan@proto2.app',
        full_name: 'Jordan Diaz',
        user_type: 'human',
        role: 'admin',
        is_active: true,
      },
      {
        id: ids.users.manager,
        email: 'nina@proto2.app',
        full_name: 'Nina Tran',
        user_type: 'human',
        role: 'manager',
        is_active: true,
      },
      {
        id: ids.users.operator,
        email: 'sam@proto2.app',
        full_name: 'Sam Ortega',
        user_type: 'human',
        role: 'user',
        is_active: true,
      },
    ];
    for (const row of userRows) {
      await upsertById('users', row);
    }

    await upsertById('businesses', {
      id: ids.business,
      name: 'Proto 2 Demo Co',
      legal_name: 'Proto 2 Demo Company LLC',
      email: 'hello@proto2.app',
      phone: '+1 (555) 010-2000',
      website: 'https://proto2.app',
      city: 'Austin',
      state: 'TX',
      country: 'US',
      primary_color: '#0f172a',
      accent_color: '#0891b2',
      default_payment_terms: 'Net 15',
      document_intro_text: 'Thanks for choosing Proto 2 Demo Co.',
      document_footer_text: 'Built with the Proto-2 admin layer.',
      is_primary: true,
    });

    const organizationRows = [
      {
        id: ids.organizations.northside,
        name: 'Northside Plaza',
        relationship_type: 'customer',
        organization_type: 'company',
        industry: 'Commercial property',
        phone: '+1 (512) 555-0101',
        website: 'https://northside-plaza.example',
        status: 'active',
        address: { city: 'Austin', state: 'TX', country: 'US' },
        tags: ['commercial', 'multi-site'],
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.organizations.oakridge,
        name: 'Oakridge HOA',
        relationship_type: 'customer',
        organization_type: 'other',
        industry: 'Homeowners association',
        phone: '+1 (512) 555-0102',
        website: 'https://oakridge-hoa.example',
        status: 'active',
        address: { city: 'Round Rock', state: 'TX', country: 'US' },
        tags: ['hoa', 'recurring'],
        created_by: ids.users.manager,
        updated_by: ids.users.manager,
      },
      {
        id: ids.organizations.summit,
        name: 'Summit Estates',
        relationship_type: 'customer',
        organization_type: 'company',
        industry: 'Residential development',
        phone: '+1 (512) 555-0103',
        website: 'https://summit-estates.example',
        status: 'pending',
        address: { city: 'Cedar Park', state: 'TX', country: 'US' },
        tags: ['builder', 'referral'],
        created_by: ids.users.manager,
        updated_by: ids.users.manager,
      },
      {
        id: ids.organizations.alliedSupply,
        name: 'Allied Supply',
        relationship_type: 'vendor',
        organization_type: 'company',
        industry: 'Wholesale supply',
        phone: '+1 (512) 555-0104',
        website: 'https://allied-supply.example',
        status: 'active',
        tags: ['vendor', 'materials'],
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.organizations.metroLogistics,
        name: 'Metro Logistics',
        relationship_type: 'vendor',
        organization_type: 'company',
        industry: 'Fleet services',
        phone: '+1 (512) 555-0105',
        website: 'https://metro-logistics.example',
        status: 'active',
        tags: ['vendor', 'transport'],
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of organizationRows) {
      await upsertById('organizations', row);
    }

    const contactRows = [
      {
        id: ids.contacts.avery,
        organization_id: ids.organizations.northside,
        title: 'Facilities Lead',
        type: 'customer',
        name: 'Avery Kim',
        email: 'avery@northside-plaza.example',
        phone: '+1 (512) 555-0110',
        status: 'active',
        source: 'referral',
        tags: ['decision maker', 'sms'],
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.contacts.jordan,
        organization_id: ids.organizations.oakridge,
        title: 'Controller',
        type: 'customer',
        name: 'Jordan Pike',
        email: 'jpike@oakridge-hoa.example',
        phone: '+1 (512) 555-0111',
        status: 'active',
        source: 'website_organic',
        tags: ['billing', 'ach'],
        created_by: ids.users.manager,
        updated_by: ids.users.manager,
      },
      {
        id: ids.contacts.mara,
        organization_id: ids.organizations.summit,
        title: 'Regional VP',
        type: 'customer',
        name: 'Mara Quinn',
        email: 'mara@summit-estates.example',
        phone: '+1 (512) 555-0112',
        status: 'inactive',
        source: 'in_person',
        tags: ['vip', 'escalation'],
        created_by: ids.users.manager,
        updated_by: ids.users.manager,
      },
    ];
    for (const row of contactRows) {
      await upsertById('contacts', row);
    }

    const leadRows = [
      {
        id: ids.leads.northside,
        contact_id: ids.contacts.avery,
        organization_id: ids.organizations.northside,
        name: 'Northside HVAC Retrofit',
        phone: '+1 (512) 555-0110',
        email: 'avery@northside-plaza.example',
        source: 'referral',
        status: 'quoted',
        assigned_to: ids.users.manager,
        next_follow_up: nextWeek,
        expected_value: '18400.00',
        notes: { summary: 'Quote sent, waiting on facility review.' },
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.leads.oakridge,
        contact_id: ids.contacts.jordan,
        organization_id: ids.organizations.oakridge,
        name: 'Oakridge Comfort Plan',
        phone: '+1 (512) 555-0111',
        email: 'jpike@oakridge-hoa.example',
        source: 'website_organic',
        status: 'contacted',
        assigned_to: ids.users.manager,
        next_follow_up: today,
        expected_value: '6920.00',
        notes: { summary: 'Maintenance package review in progress.' },
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.leads.summit,
        contact_id: ids.contacts.mara,
        organization_id: ids.organizations.summit,
        name: 'Summit Cooling Retrofit',
        phone: '+1 (512) 555-0112',
        email: 'mara@summit-estates.example',
        source: 'in_person',
        status: 'new',
        assigned_to: ids.users.operator,
        next_follow_up: today,
        expected_value: '24300.00',
        notes: { summary: 'New commercial retrofit opportunity.' },
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of leadRows) {
      await upsertById('leads', row);
    }

    const bankAccountRows = [
      {
        id: ids.bankAccounts.operating,
        name: 'Operating Checking',
        account_type: 'checking',
        bank_name: 'Mercury',
        provider: 'mercury',
        provider_account_id: 'acct_proto2_operating',
        status: 'active',
        currency: 'USD',
        current_balance: '287420.00',
        is_active: true,
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.bankAccounts.cardClearing,
        name: 'Card Clearing',
        account_type: 'credit_card',
        bank_name: 'Mercury',
        provider: 'mercury',
        provider_account_id: 'acct_proto2_card',
        status: 'active',
        currency: 'USD',
        current_balance: '12430.00',
        is_active: true,
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of bankAccountRows) {
      await upsertById('bank_accounts', row);
    }

    const bankMerchantRows = [
      {
        id: ids.bankMerchants.stripe,
        display_name: 'Stripe',
        normalized_name: 'stripe',
        domain: 'stripe.com',
        avatar_initials: 'ST',
        avatar_color: '#635bff',
      },
      {
        id: ids.bankMerchants.adobe,
        display_name: 'Adobe',
        normalized_name: 'adobe',
        domain: 'adobe.com',
        avatar_initials: 'AD',
        avatar_color: '#ff0000',
      },
      {
        id: ids.bankMerchants.googleAds,
        display_name: 'Google Ads',
        normalized_name: 'google ads',
        domain: 'google.com',
        avatar_initials: 'GG',
        avatar_color: '#4285f4',
      },
      {
        id: ids.bankMerchants.twilio,
        display_name: 'Twilio',
        normalized_name: 'twilio',
        domain: 'twilio.com',
        avatar_initials: 'TW',
        avatar_color: '#f22f46',
      },
    ];
    for (const row of bankMerchantRows) {
      await upsertById('bank_merchants', row);
    }

    const bankCardRows = [
      {
        id: ids.bankCards.operations,
        card_name: 'Operations Card',
        last4: '4242',
        provider: 'mercury',
        provider_card_id: 'card_operations_4242',
        vendor_id: ids.organizations.alliedSupply,
        bank_account_id: ids.bankAccounts.cardClearing,
        status: 'active',
        card_type: 'business',
        network: 'visa',
        daily_limit: '2500.00',
        per_transaction_limit: '1200.00',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.bankCards.marketing,
        card_name: 'Marketing Card',
        last4: '1212',
        provider: 'mercury',
        provider_card_id: 'card_marketing_1212',
        vendor_id: ids.organizations.metroLogistics,
        bank_account_id: ids.bankAccounts.cardClearing,
        status: 'active',
        card_type: 'business',
        network: 'mastercard',
        daily_limit: '1500.00',
        per_transaction_limit: '750.00',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of bankCardRows) {
      await upsertById('bank_cards', row);
    }

    const bankTransactionRows = [
      {
        id: ids.bankTransactions.income1,
        bank_account_id: ids.bankAccounts.operating,
        merchant_id: ids.bankMerchants.stripe,
        provider: 'mercury',
        provider_transaction_id: 'txn_demo_001',
        provider_status: 'posted',
        provider_kind: 'card_payment',
        counterparty_name: 'Acme Corp',
        posted_at: now,
        transaction_date: new Date('2026-05-27T00:00:00.000Z'),
        amount: '12450.00',
        transaction_type: 'deposit',
        description: 'Invoice #4821 payment',
        reference: 'INV-4821',
        external_category: 'income',
        internal_category: 'receipts',
        category_source: 'manual',
        status: 'reconciled',
        rule_resolution_status: 'processed',
        llm_review_status: 'not_requested',
        notes: 'Seeded cash receipt',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.bankTransactions.income2,
        bank_account_id: ids.bankAccounts.operating,
        merchant_id: ids.bankMerchants.stripe,
        provider: 'mercury',
        provider_transaction_id: 'txn_demo_002',
        provider_status: 'posted',
        provider_kind: 'payout',
        counterparty_name: 'Stripe',
        posted_at: now,
        transaction_date: new Date('2026-05-27T00:00:00.000Z'),
        amount: '8920.00',
        transaction_type: 'deposit',
        description: 'Payout batch May 26',
        reference: 'PAYOUT-0526',
        external_category: 'income',
        internal_category: 'receipts',
        category_source: 'manual',
        status: 'categorized',
        rule_resolution_status: 'processed',
        llm_review_status: 'not_requested',
        notes: 'Seeded payout',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.bankTransactions.expense1,
        bank_account_id: ids.bankAccounts.cardClearing,
        card_id: ids.bankCards.operations,
        merchant_id: ids.bankMerchants.adobe,
        provider: 'mercury',
        provider_transaction_id: 'txn_demo_003',
        provider_status: 'posted',
        provider_kind: 'card_charge',
        counterparty_name: 'Adobe',
        posted_at: now,
        transaction_date: new Date('2026-05-26T00:00:00.000Z'),
        amount: '-5999.00',
        transaction_type: 'withdrawal',
        description: 'Creative Cloud subscription',
        reference: 'ADOBE-CC',
        external_category: 'software',
        internal_category: 'subscriptions',
        category_source: 'manual',
        status: 'pending',
        rule_resolution_status: 'unprocessed',
        llm_review_status: 'not_requested',
        notes: 'Seeded SaaS expense',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.bankTransactions.expense2,
        bank_account_id: ids.bankAccounts.cardClearing,
        card_id: ids.bankCards.marketing,
        merchant_id: ids.bankMerchants.googleAds,
        provider: 'mercury',
        provider_transaction_id: 'txn_demo_004',
        provider_status: 'posted',
        provider_kind: 'card_charge',
        counterparty_name: 'Google Ads',
        posted_at: now,
        transaction_date: new Date('2026-05-26T00:00:00.000Z'),
        amount: '-1240.00',
        transaction_type: 'fee',
        description: 'Campaign spend - May',
        reference: 'ADS-MAY',
        external_category: 'marketing',
        internal_category: 'ads',
        category_source: 'manual',
        status: 'pending',
        rule_resolution_status: 'unprocessed',
        llm_review_status: 'not_requested',
        notes: 'Seeded ad spend',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of bankTransactionRows) {
      await upsertById('bank_transactions', row);
    }

    const billRows = [
      {
        id: ids.bills.allied,
        bill_number: 'BILL-2026-001',
        vendor_id: ids.organizations.alliedSupply,
        vendor_name: 'Allied Supply',
        issue_date: new Date('2026-05-20T00:00:00.000Z'),
        due_date: new Date('2026-06-03T00:00:00.000Z'),
        status: 'pending',
        subtotal: '3920.00',
        tax_amount: '360.00',
        total_amount: '4280.00',
        amount_paid: '0.00',
        notes: 'Copper fittings and valves',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.bills.north,
        bill_number: 'BILL-2026-002',
        vendor_id: ids.organizations.metroLogistics,
        vendor_name: 'Metro Logistics',
        issue_date: new Date('2026-05-18T00:00:00.000Z'),
        due_date: new Date('2026-05-30T00:00:00.000Z'),
        status: 'paid',
        subtotal: '900.00',
        tax_amount: '20.00',
        total_amount: '920.00',
        amount_paid: '920.00',
        notes: 'Fleet service and toll pass',
        paid_at: new Date('2026-05-24T00:00:00.000Z'),
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of billRows) {
      await upsertById('bills', row);
    }

    const paymentRows = [
      {
        id: ids.payments.bill1,
        payment_number: 'PAY-2026-001',
        bill_id: ids.bills.allied,
        organization_id: ids.organizations.alliedSupply,
        amount: '4280.00',
        payment_date: new Date('2026-06-01T00:00:00.000Z'),
        method: 'bank_transfer',
        reference: 'ACH-4280',
        payment_direction: 'outgoing',
        reconciliation_status: 'pending',
        notes: 'Queued payment for Allied Supply',
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.payments.bill2,
        payment_number: 'PAY-2026-002',
        bill_id: ids.bills.north,
        organization_id: ids.organizations.metroLogistics,
        amount: '920.00',
        payment_date: new Date('2026-05-24T00:00:00.000Z'),
        method: 'bank_transfer',
        reference: 'ACH-920',
        payment_direction: 'outgoing',
        reconciliation_status: 'reconciled',
        notes: 'Processed payment for Metro Logistics',
        paid_at: new Date('2026-05-24T00:00:00.000Z'),
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of paymentRows) {
      await upsertById('payments', row);
    }

    const expenseRows = [
      {
        id: ids.expenses.adobe,
        expense_number: 'EXP-2026-001',
        vendor_id: ids.organizations.metroLogistics,
        amount: '5999.00',
        expense_date: new Date('2026-05-26T00:00:00.000Z'),
        category: 'software',
        description: 'Creative Cloud subscription',
        journal_entry_id: null,
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
      {
        id: ids.expenses.metro,
        expense_number: 'EXP-2026-002',
        vendor_id: ids.organizations.metroLogistics,
        amount: '1240.00',
        expense_date: new Date('2026-05-26T00:00:00.000Z'),
        category: 'marketing',
        description: 'Google Ads campaign spend',
        journal_entry_id: null,
        created_by: ids.users.admin,
        updated_by: ids.users.admin,
      },
    ];
    for (const row of expenseRows) {
      await upsertById('expenses', row);
    }

    await client.query('COMMIT');

    console.log('Seed complete. Demo data is available for users, CRM, finance, and banking pages.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
