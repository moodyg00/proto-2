import { prisma } from '@/src/lib/prisma';

import { isAdminCreateSection, type AdminCreateSection } from '@/src/lib/admin-record-form-config';

type RecordResult = {
  title: string;
  record: Record<string, unknown>;
};

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function optionalString(value: unknown) {
  const nextValue = trimString(value);
  return nextValue.length > 0 ? nextValue : undefined;
}

function optionalBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true' || value === 'on' || value === '1') return true;
    if (value === 'false' || value === 'off' || value === '0') return false;
  }
  return fallback;
}

function optionalNumber(value: unknown) {
  const nextValue = typeof value === 'string' && value.trim().length === 0 ? undefined : value;
  if (nextValue === undefined || nextValue === null) return undefined;
  const numericValue = typeof nextValue === 'number' ? nextValue : Number(nextValue);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function decimalValue(value: unknown, fallback = '0.00') {
  const nextValue = optionalNumber(value);
  return typeof nextValue === 'number' ? nextValue.toFixed(2) : fallback;
}

function optionalDecimalValue(value: unknown) {
  const nextValue = optionalNumber(value);
  return typeof nextValue === 'number' ? nextValue.toFixed(2) : undefined;
}

function parseDateInput(value: unknown) {
  const nextValue = optionalString(value);
  if (!nextValue) return undefined;
  const parsed = new Date(`${nextValue}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function createAutoNumber(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => serializeValue(entry));
  }

  if (value && typeof value === 'object') {
    if ((value as { constructor?: { name?: string } }).constructor?.name === 'Decimal') {
      return value.toString();
    }

    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, serializeValue(entry)]));
  }

  return value;
}

function serializeRecord(record: Record<string, unknown>) {
  return serializeValue(record) as Record<string, unknown>;
}

async function ensureOrganization(name: string) {
  return prisma.organization.create({
    data: {
      name,
      status: 'active',
    },
  });
}

async function ensureContact(args: { name: string; organizationId?: string; email?: string; phone?: string }) {
  return prisma.contact.create({
    data: {
      name: args.name,
      organizationId: args.organizationId,
      email: args.email,
      phone: args.phone,
      status: 'active',
    },
  });
}

function fieldValue(values: Record<string, unknown>, key: string) {
  return values[key];
}

export async function getAdminRecordDetail(section: string, id: string): Promise<RecordResult | null> {
  if (!isAdminCreateSection(section)) {
    return null;
  }

  switch (section) {
    case 'work-orders': {
      const record = await prisma.workOrder.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.workOrderNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'invoices': {
      const record = await prisma.invoice.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.invoiceNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'estimates': {
      const record = await prisma.estimate.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.estimateNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'contacts': {
      const record = await prisma.contact.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name ?? record.email ?? record.id, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'leads': {
      const record = await prisma.lead.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'organizations': {
      const record = await prisma.organization.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'bank-accounts': {
      const record = await prisma.bankAccount.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'catalog': {
      const record = await prisma.product.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'offerings': {
      const record = await prisma.service.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'bills': {
      const record = await prisma.bill.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.billNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'ads': {
      const record = await prisma.ad.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'campaigns': {
      const record = await prisma.adCampaign.findUnique({ where: { id } });
      if (!record) return null;
      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    default:
      return null;
  }
}

export async function createAdminRecord(section: AdminCreateSection, values: Record<string, unknown>): Promise<RecordResult> {
  switch (section) {
    case 'work-orders': {
      const organizationName = optionalString(fieldValue(values, 'organizationName'));
      const customerName = optionalString(fieldValue(values, 'customerName')) ?? optionalString(fieldValue(values, 'contactName')) ?? 'New Work Order';
      const contactName = optionalString(fieldValue(values, 'contactName')) ?? customerName;
      let organizationId: string | undefined;

      if (organizationName) {
        const organization = await ensureOrganization(organizationName);
        organizationId = organization.id;
      }

      const contact = await ensureContact({
        name: contactName,
        organizationId,
      });

      const record = await prisma.workOrder.create({
        data: {
          workOrderNumber: createAutoNumber('WO'),
          contactId: contact.id,
          customerName,
          serviceName: optionalString(fieldValue(values, 'serviceName')),
          status: optionalString(fieldValue(values, 'status')) ?? 'scheduled',
          scheduledDate: parseDateInput(fieldValue(values, 'scheduledDate')),
          specialInstructions: optionalString(fieldValue(values, 'specialInstructions')),
          notes: optionalString(fieldValue(values, 'notes')) ? { summary: optionalString(fieldValue(values, 'notes')) } : undefined,
        },
      });

      return { title: record.workOrderNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'invoices': {
      const organizationName = optionalString(fieldValue(values, 'organizationName'));
      const contactName = optionalString(fieldValue(values, 'contactName'));
      let organizationId: string | undefined;
      let contactId: string | undefined;

      if (organizationName) {
        const organization = await ensureOrganization(organizationName);
        organizationId = organization.id;
      }

      if (contactName) {
        const contact = await ensureContact({ name: contactName, organizationId });
        contactId = contact.id;
      }

      const subtotal = decimalValue(fieldValue(values, 'subtotal'));
      const taxAmount = decimalValue(fieldValue(values, 'taxAmount'));
      const amountPaid = decimalValue(fieldValue(values, 'amountPaid'));
      const totalAmount = optionalDecimalValue(fieldValue(values, 'totalAmount')) ?? decimalValue(Number(subtotal) + Number(taxAmount));
      const issueDate = parseDateInput(fieldValue(values, 'issueDate')) ?? new Date();
      const dueDate = parseDateInput(fieldValue(values, 'dueDate')) ?? addDays(issueDate, 30);

      const record = await prisma.invoice.create({
        data: {
          invoiceNumber: createAutoNumber('INV'),
          organizationId,
          organizationName,
          contactId,
          contactName,
          issueDate,
          dueDate,
          status: optionalString(fieldValue(values, 'status')) ?? 'draft',
          subtotal,
          taxAmount,
          totalAmount,
          amountPaid,
          amountDue: (Number(totalAmount) - Number(amountPaid)).toFixed(2),
          paymentTerms: optionalString(fieldValue(values, 'paymentTerms')),
          notes: optionalString(fieldValue(values, 'notes')),
        },
      });

      return { title: record.invoiceNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'estimates': {
      const organizationName = optionalString(fieldValue(values, 'organizationName'));
      const contactName = optionalString(fieldValue(values, 'contactName'));
      let organizationId: string | undefined;
      let contactId: string | undefined;

      if (organizationName) {
        const organization = await ensureOrganization(organizationName);
        organizationId = organization.id;
      }

      if (contactName) {
        const contact = await ensureContact({ name: contactName, organizationId });
        contactId = contact.id;
      }

      const subtotal = decimalValue(fieldValue(values, 'subtotal'));
      const taxAmount = decimalValue(fieldValue(values, 'taxAmount'));
      const totalAmount = optionalDecimalValue(fieldValue(values, 'totalAmount')) ?? decimalValue(Number(subtotal) + Number(taxAmount));

      const record = await prisma.estimate.create({
        data: {
          estimateNumber: createAutoNumber('EST'),
          title: optionalString(fieldValue(values, 'title')) ?? 'New Estimate',
          description: optionalString(fieldValue(values, 'description')),
          organizationId,
          organizationName,
          contactId,
          contactName,
          status: optionalString(fieldValue(values, 'status')) ?? 'draft',
          subtotal,
          taxAmount,
          totalAmount,
          paymentTerms: optionalString(fieldValue(values, 'paymentTerms')),
          validUntil: parseDateInput(fieldValue(values, 'validUntil')),
        },
      });

      return { title: record.estimateNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'contacts': {
      let organizationId: string | undefined;
      const organizationName = optionalString(fieldValue(values, 'organizationName'));
      if (organizationName) {
        const organization = await ensureOrganization(organizationName);
        organizationId = organization.id;
      }

      const record = await prisma.contact.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Contact',
          organizationId,
          title: optionalString(fieldValue(values, 'title')),
          type: optionalString(fieldValue(values, 'type')) ?? 'other',
          phone: optionalString(fieldValue(values, 'phone')),
          email: optionalString(fieldValue(values, 'email')),
          source: optionalString(fieldValue(values, 'source')),
          status: optionalString(fieldValue(values, 'status')) ?? 'active',
          notes: optionalString(fieldValue(values, 'notes')) ? { summary: optionalString(fieldValue(values, 'notes')) } : undefined,
        },
      });

      return { title: record.name ?? record.email ?? record.id, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'leads': {
      let organizationId: string | undefined;
      let contactId: string | undefined;
      const organizationName = optionalString(fieldValue(values, 'organizationName'));
      const contactName = optionalString(fieldValue(values, 'contactName'));

      if (organizationName) {
        const organization = await ensureOrganization(organizationName);
        organizationId = organization.id;
      }

      if (contactName) {
        const contact = await ensureContact({ name: contactName, organizationId });
        contactId = contact.id;
      }

      const record = await prisma.lead.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Lead',
          organizationId,
          contactId,
          source: optionalString(fieldValue(values, 'source')),
          status: optionalString(fieldValue(values, 'status')) ?? 'new',
          expectedValue: optionalDecimalValue(fieldValue(values, 'expectedValue')),
          nextFollowUp: parseDateInput(fieldValue(values, 'nextFollowUp')),
          notes: optionalString(fieldValue(values, 'notes')) ? { summary: optionalString(fieldValue(values, 'notes')) } : undefined,
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'organizations': {
      const record = await prisma.organization.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Organization',
          relationshipType: optionalString(fieldValue(values, 'relationshipType')) ?? 'other',
          organizationType: optionalString(fieldValue(values, 'organizationType')) ?? 'company',
          industry: optionalString(fieldValue(values, 'industry')),
          phone: optionalString(fieldValue(values, 'phone')),
          website: optionalString(fieldValue(values, 'website')),
          source: optionalString(fieldValue(values, 'source')),
          status: optionalString(fieldValue(values, 'status')) ?? 'active',
          notes: optionalString(fieldValue(values, 'notes')) ? { summary: optionalString(fieldValue(values, 'notes')) } : undefined,
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'bank-accounts': {
      const record = await prisma.bankAccount.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Bank Account',
          accountType: optionalString(fieldValue(values, 'accountType')) ?? 'checking',
          bankName: optionalString(fieldValue(values, 'bankName')),
          provider: optionalString(fieldValue(values, 'provider')),
          providerAccountId: optionalString(fieldValue(values, 'providerAccountId')),
          status: optionalString(fieldValue(values, 'status')),
          currentBalance: decimalValue(fieldValue(values, 'currentBalance')),
          chartOfAccountId: optionalString(fieldValue(values, 'chartOfAccountId')),
          lastReconciledDate: parseDateInput(fieldValue(values, 'lastReconciledDate')),
          isActive: optionalBoolean(fieldValue(values, 'isActive'), true),
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'catalog': {
      const record = await prisma.product.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Catalog Item',
          description: optionalString(fieldValue(values, 'description')),
          category: optionalString(fieldValue(values, 'category')) ?? 'other',
          unitPrice: optionalDecimalValue(fieldValue(values, 'unitPrice')),
          unitOfMeasure: optionalString(fieldValue(values, 'unitOfMeasure')),
          sku: optionalString(fieldValue(values, 'sku')),
          isForSale: optionalBoolean(fieldValue(values, 'isForSale')),
          isInternalUse: optionalBoolean(fieldValue(values, 'isInternalUse'), true),
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'offerings': {
      const record = await prisma.service.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Offering',
          description: optionalString(fieldValue(values, 'description')),
          quotePrompt: optionalString(fieldValue(values, 'quotePrompt')),
          category: optionalString(fieldValue(values, 'category')) ?? 'general',
          estimatedDurationMinutes: optionalNumber(fieldValue(values, 'estimatedDurationMinutes')),
          suggestedPrice: optionalDecimalValue(fieldValue(values, 'suggestedPrice')),
          isActive: optionalBoolean(fieldValue(values, 'isActive'), true),
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'bills': {
      const vendorName = optionalString(fieldValue(values, 'vendorName')) ?? 'New Vendor';
      const vendor = await ensureOrganization(vendorName);
      const issueDate = parseDateInput(fieldValue(values, 'issueDate')) ?? new Date();
      const dueDate = parseDateInput(fieldValue(values, 'dueDate')) ?? addDays(issueDate, 30);
      const subtotal = decimalValue(fieldValue(values, 'subtotal'));
      const taxAmount = decimalValue(fieldValue(values, 'taxAmount'));
      const totalAmount = optionalDecimalValue(fieldValue(values, 'totalAmount')) ?? decimalValue(Number(subtotal) + Number(taxAmount));
      const amountPaid = decimalValue(fieldValue(values, 'amountPaid'));

      const record = await prisma.bill.create({
        data: {
          billNumber: createAutoNumber('BILL'),
          vendorId: vendor.id,
          vendorName: vendor.name,
          issueDate,
          dueDate,
          status: optionalString(fieldValue(values, 'status')) ?? 'draft',
          subtotal,
          taxAmount,
          totalAmount,
          amountPaid,
          notes: optionalString(fieldValue(values, 'notes')),
        },
      });

      return { title: record.billNumber, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'ads': {
      const campaignName = optionalString(fieldValue(values, 'campaignName'));
      const platform = optionalString(fieldValue(values, 'platform')) ?? 'meta';
      let campaignId: string | undefined;

      if (campaignName) {
        const campaign = await prisma.adCampaign.create({
          data: {
            name: campaignName,
            platform,
            status: 'active',
            totalBudget: optionalDecimalValue(fieldValue(values, 'budget')),
            description: optionalString(fieldValue(values, 'description')),
          },
        });
        campaignId = campaign.id;
      }

      const record = await prisma.ad.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Ad',
          platform,
          campaignId,
          headline: optionalString(fieldValue(values, 'headline')),
          hook: optionalString(fieldValue(values, 'hook')),
          description: optionalString(fieldValue(values, 'description')),
          status: optionalString(fieldValue(values, 'status')) ?? 'draft',
          budget: optionalDecimalValue(fieldValue(values, 'budget')),
          startDate: parseDateInput(fieldValue(values, 'startDate')),
          endDate: parseDateInput(fieldValue(values, 'endDate')),
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    case 'campaigns': {
      const record = await prisma.adCampaign.create({
        data: {
          name: optionalString(fieldValue(values, 'name')) ?? 'New Campaign',
          platform: optionalString(fieldValue(values, 'platform')) ?? 'meta',
          status: optionalString(fieldValue(values, 'status')) ?? 'active',
          description: optionalString(fieldValue(values, 'description')),
          totalBudget: optionalDecimalValue(fieldValue(values, 'totalBudget')),
          startDate: parseDateInput(fieldValue(values, 'startDate')),
          endDate: parseDateInput(fieldValue(values, 'endDate')),
        },
      });

      return { title: record.name, record: serializeRecord(record as unknown as Record<string, unknown>) };
    }
    default:
      throw new Error(`Unsupported admin section: ${section}`);
  }
}
