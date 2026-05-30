export type AdminCreateSection =
  | 'work-orders'
  | 'invoices'
  | 'estimates'
  | 'contacts'
  | 'leads'
  | 'organizations'
  | 'bank-accounts'
  | 'catalog'
  | 'offerings'
  | 'bills'
  | 'ads'
  | 'campaigns';

export type AdminDbSection = AdminCreateSection | 'bank-cards' | 'chart-of-accounts';

export type AdminCreateFieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox';

export type AdminCreateField = {
  name: string;
  label: string;
  type: AdminCreateFieldType;
  placeholder?: string;
  helperText?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string | boolean;
};

export type AdminCreateFieldGroup = {
  title: string;
  description?: string;
  fields: AdminCreateField[];
};

export type AdminCreateDefinition = {
  section: AdminCreateSection;
  title: string;
  description: string;
  submitLabel: string;
  groups: AdminCreateFieldGroup[];
};

function selectOptions(values: string[]) {
  return values.map((value) => ({
    label: value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '),
    value,
  }));
}

export const ADMIN_CREATE_DEFINITIONS: Record<AdminCreateSection, AdminCreateDefinition> = {
  'work-orders': {
    section: 'work-orders',
    title: 'New Work Order',
    description: 'Create a work order and link it to a new or existing contact.',
    submitLabel: 'Create work order',
    groups: [
      {
        title: 'Record',
        fields: [
          { name: 'customerName', label: 'Customer name', type: 'text', placeholder: 'Northside Plaza' },
          { name: 'organizationName', label: 'Organization name', type: 'text', placeholder: 'Northside Plaza Holdings' },
          { name: 'contactName', label: 'Contact name', type: 'text', placeholder: 'Avery Kim' },
          { name: 'serviceName', label: 'Service name', type: 'text', placeholder: 'HVAC retrofit' },
        ],
      },
      {
        title: 'Scheduling',
        fields: [
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'scheduled',
            options: selectOptions(['new', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rework', 'archived']),
          },
          { name: 'scheduledDate', label: 'Scheduled date', type: 'date' },
          { name: 'specialInstructions', label: 'Special instructions', type: 'textarea', placeholder: 'Arrival gate code, parking notes, or access details.' },
        ],
      },
      {
        title: 'Notes',
        fields: [{ name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Internal notes, dispatch context, or scope summary.' }],
      },
    ],
  },
  invoices: {
    section: 'invoices',
    title: 'New Invoice',
    description: 'Create an invoice with the core billing totals and account context.',
    submitLabel: 'Create invoice',
    groups: [
      {
        title: 'Billing',
        fields: [
          { name: 'organizationName', label: 'Organization name', type: 'text', placeholder: 'Northside Plaza' },
          { name: 'contactName', label: 'Contact name', type: 'text', placeholder: 'Jordan Pike' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'draft',
            options: selectOptions(['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled']),
          },
          { name: 'issueDate', label: 'Issue date', type: 'date' },
          { name: 'dueDate', label: 'Due date', type: 'date' },
        ],
      },
      {
        title: 'Totals',
        fields: [
          { name: 'subtotal', label: 'Subtotal', type: 'number', placeholder: '18400' },
          { name: 'taxAmount', label: 'Tax amount', type: 'number', placeholder: '0' },
          { name: 'totalAmount', label: 'Total amount', type: 'number', placeholder: '18400' },
          { name: 'amountPaid', label: 'Amount paid', type: 'number', placeholder: '0' },
          { name: 'paymentTerms', label: 'Payment terms', type: 'text', placeholder: 'Net 30' },
        ],
      },
      {
        title: 'Notes',
        fields: [{ name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Payment reminders, scope notes, or billing details.' }],
      },
    ],
  },
  estimates: {
    section: 'estimates',
    title: 'New Estimate',
    description: 'Create a new estimate and capture the core quote details.',
    submitLabel: 'Create estimate',
    groups: [
      {
        title: 'Record',
        fields: [
          { name: 'title', label: 'Title', type: 'text', placeholder: 'Main Street Rewire' },
          { name: 'organizationName', label: 'Organization name', type: 'text', placeholder: 'Main Street Dental' },
          { name: 'contactName', label: 'Contact name', type: 'text', placeholder: 'Jordan Pike' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'draft',
            options: selectOptions(['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired']),
          },
          { name: 'validUntil', label: 'Valid until', type: 'date' },
        ],
      },
      {
        title: 'Pricing',
        fields: [
          { name: 'subtotal', label: 'Subtotal', type: 'number', placeholder: '18400' },
          { name: 'taxAmount', label: 'Tax amount', type: 'number', placeholder: '0' },
          { name: 'totalAmount', label: 'Total amount', type: 'number', placeholder: '18400' },
          { name: 'paymentTerms', label: 'Payment terms', type: 'text', placeholder: 'Net 30' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Project scope, assumptions, and constraints.' },
        ],
      },
    ],
  },
  contacts: {
    section: 'contacts',
    title: 'New Contact',
    description: 'Create a contact record with the primary communication details.',
    submitLabel: 'Create contact',
    groups: [
      {
        title: 'Identity',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Avery Kim' },
          { name: 'organizationName', label: 'Organization name', type: 'text', placeholder: 'Northside Plaza' },
          { name: 'title', label: 'Title', type: 'text', placeholder: 'Facilities lead' },
          { name: 'email', label: 'Email', type: 'text', placeholder: 'avery@northside.com' },
          { name: 'phone', label: 'Phone', type: 'text', placeholder: '(555) 123-4567' },
        ],
      },
      {
        title: 'Classification',
        fields: [
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            defaultValue: 'other',
            options: selectOptions(['customer', 'vendor', 'contractor', 'owner', 'employee', 'business_contact', 'other']),
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'active',
            options: selectOptions(['active', 'inactive']),
          },
          { name: 'source', label: 'Source', type: 'text', placeholder: 'Website form' },
        ],
      },
      {
        title: 'Notes',
        fields: [{ name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Decision-maker notes, follow-up context, or CRM details.' }],
      },
    ],
  },
  leads: {
    section: 'leads',
    title: 'New Lead',
    description: 'Create a lead and capture the follow-up context in one form.',
    submitLabel: 'Create lead',
    groups: [
      {
        title: 'Core',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Acme Expansion' },
          { name: 'organizationName', label: 'Organization name', type: 'text', placeholder: 'Acme Corp' },
          { name: 'contactName', label: 'Contact name', type: 'text', placeholder: 'Jordan Diaz' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'new',
            options: selectOptions(['new', 'contacted', 'quoted', 'converted', 'lost']),
          },
          {
            name: 'source',
            label: 'Source',
            type: 'select',
            defaultValue: 'website_organic',
            options: selectOptions(['website_organic', 'facebook', 'instagram', 'craigslist', 'nextdoor', 'referral', 'physical_media', 'in_person']),
          },
        ],
      },
      {
        title: 'Qualification',
        fields: [
          { name: 'expectedValue', label: 'Expected value', type: 'number', placeholder: '48000' },
          { name: 'nextFollowUp', label: 'Next follow-up', type: 'date' },
          { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Pipeline notes, objections, or qualification context.' },
        ],
      },
    ],
  },
  organizations: {
    section: 'organizations',
    title: 'New Organization',
    description: 'Create a customer or vendor organization record.',
    submitLabel: 'Create organization',
    groups: [
      {
        title: 'Identity',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Northside Plaza' },
          {
            name: 'relationshipType',
            label: 'Relationship type',
            type: 'select',
            defaultValue: 'other',
            options: selectOptions(['customer', 'vendor', 'contractor', 'affiliate', 'lead', 'partner', 'supplier', 'other']),
          },
          {
            name: 'organizationType',
            label: 'Organization type',
            type: 'select',
            defaultValue: 'company',
            options: selectOptions(['company', 'nonprofit', 'government', 'individual', 'other']),
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'active',
            options: selectOptions(['active', 'inactive', 'pending']),
          },
        ],
      },
      {
        title: 'Profile',
        fields: [
          { name: 'industry', label: 'Industry', type: 'text', placeholder: 'Real estate' },
          { name: 'phone', label: 'Phone', type: 'text', placeholder: '(555) 123-4567' },
          { name: 'website', label: 'Website', type: 'text', placeholder: 'https://example.com' },
          { name: 'source', label: 'Source', type: 'text', placeholder: 'Referral' },
        ],
      },
      {
        title: 'Notes',
        fields: [{ name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Relationship notes, account context, or billing details.' }],
      },
    ],
  },
  'bank-accounts': {
    section: 'bank-accounts',
    title: 'New Bank Account',
    description: 'Create a connected bank account record.',
    submitLabel: 'Create bank account',
    groups: [
      {
        title: 'Identity',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Operating Checking' },
          {
            name: 'accountType',
            label: 'Account type',
            type: 'select',
            defaultValue: 'checking',
            options: selectOptions(['checking', 'savings', 'cash', 'credit_card', 'other']),
          },
          { name: 'bankName', label: 'Bank name', type: 'text', placeholder: 'Chase' },
          { name: 'provider', label: 'Provider', type: 'text', placeholder: 'Plaid' },
          { name: 'providerAccountId', label: 'Provider account ID', type: 'text', placeholder: 'acct_1234' },
          { name: 'status', label: 'Status', type: 'text', placeholder: 'active' },
        ],
      },
      {
        title: 'Balances',
        fields: [
          { name: 'currentBalance', label: 'Current balance', type: 'number', placeholder: '187402.00' },
          { name: 'chartOfAccountId', label: 'Chart of account ID', type: 'text', placeholder: 'uuid or leave blank' },
          { name: 'lastReconciledDate', label: 'Last reconciled date', type: 'date' },
          { name: 'isActive', label: 'Active account', type: 'checkbox', defaultValue: true },
        ],
      },
    ],
  },
  catalog: {
    section: 'catalog',
    title: 'New Catalog Item',
    description: 'Create a product record for the catalog.',
    submitLabel: 'Create catalog item',
    groups: [
      {
        title: 'Product',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Copper Coil 3/4"' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            defaultValue: 'other',
            options: selectOptions(['tools', 'materials', 'consumables', 'equipment', 'safety_gear', 'other']),
          },
          { name: 'sku', label: 'SKU', type: 'text', placeholder: 'MAT-302' },
          { name: 'unitOfMeasure', label: 'Unit of measure', type: 'text', placeholder: 'roll' },
          { name: 'unitPrice', label: 'Unit price', type: 'number', placeholder: '84.00' },
        ],
      },
      {
        title: 'Flags',
        fields: [
          { name: 'isForSale', label: 'For sale', type: 'checkbox', defaultValue: false },
          { name: 'isInternalUse', label: 'Internal use', type: 'checkbox', defaultValue: true },
        ],
      },
      {
        title: 'Description',
        fields: [{ name: 'description', label: 'Description', type: 'textarea', placeholder: 'Stock and reorder details.' }],
      },
    ],
  },
  offerings: {
    section: 'offerings',
    title: 'New Offering',
    description: 'Create a service offering record.',
    submitLabel: 'Create offering',
    groups: [
      {
        title: 'Service',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Comfort Baseline' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            defaultValue: 'general',
            options: selectOptions(['plumbing', 'electrical', 'hvac', 'landscaping', 'cleaning', 'general', 'other']),
          },
          { name: 'estimatedDurationMinutes', label: 'Estimated duration (minutes)', type: 'number', placeholder: '120' },
          { name: 'suggestedPrice', label: 'Suggested price', type: 'number', placeholder: '159.00' },
          { name: 'isActive', label: 'Active offering', type: 'checkbox', defaultValue: true },
        ],
      },
      {
        title: 'Details',
        fields: [
          { name: 'quotePrompt', label: 'Quote prompt', type: 'textarea', placeholder: 'Short prompt used in quoting and sales copy.' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Bundle or service description.' },
        ],
      },
    ],
  },
  bills: {
    section: 'bills',
    title: 'New Bill',
    description: 'Create a bill and vendor record together.',
    submitLabel: 'Create bill',
    groups: [
      {
        title: 'Vendor',
        fields: [
          { name: 'vendorName', label: 'Vendor name', type: 'text', placeholder: 'Allied Supply' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'draft',
            options: selectOptions(['draft', 'received', 'approved', 'paid', 'overdue', 'cancelled']),
          },
          { name: 'issueDate', label: 'Issue date', type: 'date' },
          { name: 'dueDate', label: 'Due date', type: 'date' },
        ],
      },
      {
        title: 'Totals',
        fields: [
          { name: 'subtotal', label: 'Subtotal', type: 'number', placeholder: '4280' },
          { name: 'taxAmount', label: 'Tax amount', type: 'number', placeholder: '0' },
          { name: 'totalAmount', label: 'Total amount', type: 'number', placeholder: '4280' },
          { name: 'amountPaid', label: 'Amount paid', type: 'number', placeholder: '0' },
        ],
      },
      {
        title: 'Notes',
        fields: [{ name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Approval details, aging notes, or payment context.' }],
      },
    ],
  },
  ads: {
    section: 'ads',
    title: 'New Ad',
    description: 'Create an ad record and optionally seed a matching campaign.',
    submitLabel: 'Create ad',
    groups: [
      {
        title: 'Creative',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Emergency Cooling Reel' },
          { name: 'platform', label: 'Platform', type: 'text', placeholder: 'meta' },
          { name: 'campaignName', label: 'Campaign name', type: 'text', placeholder: 'Summer Comfort Push' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'draft',
            options: selectOptions(['draft', 'active', 'paused', 'completed']),
          },
        ],
      },
      {
        title: 'Budget and schedule',
        fields: [
          { name: 'budget', label: 'Budget', type: 'number', placeholder: '1280' },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'endDate', label: 'End date', type: 'date' },
        ],
      },
      {
        title: 'Copy',
        fields: [
          { name: 'headline', label: 'Headline', type: 'text', placeholder: 'Fast response, same-day repair' },
          { name: 'hook', label: 'Hook', type: 'text', placeholder: 'Call before the heat gets worse' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Creative brief or ad copy.' },
        ],
      },
    ],
  },
  campaigns: {
    section: 'campaigns',
    title: 'New Campaign',
    description: 'Create a campaign record with its budget and pacing window.',
    submitLabel: 'Create campaign',
    groups: [
      {
        title: 'Campaign',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Summer Comfort Push' },
          { name: 'platform', label: 'Platform', type: 'text', placeholder: 'meta' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            defaultValue: 'active',
            options: selectOptions(['active', 'paused', 'completed']),
          },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Campaign objective and targeting summary.' },
        ],
      },
      {
        title: 'Budget and schedule',
        fields: [
          { name: 'totalBudget', label: 'Total budget', type: 'number', placeholder: '9200' },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'endDate', label: 'End date', type: 'date' },
        ],
      },
    ],
  },
};

export const ADMIN_CREATEABLE_SECTIONS = Object.keys(ADMIN_CREATE_DEFINITIONS) as AdminCreateSection[];

const ADMIN_DB_SECTIONS: AdminDbSection[] = [...ADMIN_CREATEABLE_SECTIONS, 'bank-cards', 'chart-of-accounts'];

export function isAdminCreateSection(section: string): section is AdminCreateSection {
  return Object.prototype.hasOwnProperty.call(ADMIN_CREATE_DEFINITIONS, section);
}

export function getAdminCreateDefinition(section: string): AdminCreateDefinition | null {
  return isAdminCreateSection(section) ? ADMIN_CREATE_DEFINITIONS[section] : null;
}

export function isAdminDbSection(section: string): section is AdminDbSection {
  return ADMIN_DB_SECTIONS.includes(section as AdminDbSection);
}

export function getAdminCreateHref(section: AdminCreateSection) {
  return `/admin/${section}/new`;
}
