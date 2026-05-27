/**
 * Canonical admin navigation for Proto-2.
 *
 * Mirrors Proto-1 Filament navigation groups + sort order 1:1:
 *   app/Providers/Filament/AdminPanelProvider.php (group order)
 *   app/Filament/Resources/**::$navigationGroup + $navigationSort
 *   app/Filament/Pages/**::$navigationGroup     + $navigationSort
 *
 * Source of truth: Proto-1. On any conflict, Proto-1 wins.
 *
 * Icons are lucide-react names. We use these instead of Heroicon names directly
 * because lucide is the default icon set bundled in this project.
 */

import type {
  LucideIcon,
} from 'lucide-react';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Image as ImageIcon,
  Folder,
  FileText,
  CalendarDays,
  Clock,
  Link as LinkIcon,
  Copy,
  Building2,
  Users,
  Mail,
  UserPlus,
  Home,
  ListOrdered,
  BookOpen,
  Scale,
  CreditCard,
  RotateCw,
  Package,
  Wrench,
  BarChart3,
  Building,
  ArrowLeftRight,
  Receipt,
  Megaphone,
  Sparkles,
  Palette,
  Globe,
  MessagesSquare,
  PenLine,
  Box,
  Cpu,
  Database,
  ShoppingBag,
  Inbox,
  Terminal,
  Server,
  Code,
  Settings as SettingsIcon,
  ClipboardList,
  UsersRound,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  sort: number;
  /** Optional alternate matches for active-state. */
  match?: string[];
}

export interface NavGroup {
  label: string;
  sort: number;
  items: NavItem[];
}

/**
 * Group order is fixed by Proto-1 AdminPanelProvider.navigationGroups().
 * Item order is determined by `sort`. We expose both so the sidebar
 * can render groups in declaration order and items by sort.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    sort: 1,
    items: [
      { href: '/admin/tasks',          label: 'Dashboard',     icon: LayoutDashboard, sort: 0, match: ['/admin'] },
      { href: '/admin/task-library',   label: 'Tasks',         icon: CheckSquare,     sort: 1 },
      { href: '/admin/opportunities',  label: 'Opportunities', icon: Briefcase,       sort: 1 },
      { href: '/admin/images',         label: 'Images',        icon: ImageIcon,       sort: 2 },
      { href: '/admin/assets',         label: 'Assets',        icon: Folder,          sort: 3 },
      { href: '/admin/documents',      label: 'Documents',     icon: FileText,        sort: 4 },
    ],
  },
  {
    label: 'Operations',
    sort: 2,
    items: [
      { href: '/admin/operations-dashboard',       label: 'Dashboard',       icon: Home,         sort: 1 },
      { href: '/admin/jobs',                       label: 'Work Orders',     icon: Briefcase,    sort: 2 },
      { href: '/admin/schedulings',                label: 'Schedule',        icon: CalendarDays, sort: 3 },
      { href: '/admin/schedulings/availability',   label: 'Availability',    icon: Clock,        sort: 4 },
      { href: '/admin/schedulings/booking-links',  label: 'Booking Links',   icon: LinkIcon,     sort: 5 },
      { href: '/admin/estimates',                  label: 'Estimates',       icon: Copy,         sort: 5 },
      { href: '/admin/invoices',                   label: 'Invoices',        icon: FileText,     sort: 6 },
    ],
  },
  {
    label: 'Customer Relations',
    sort: 3,
    items: [
      { href: '/admin/crm-dashboard',  label: 'Dashboard',     icon: Home,      sort: 1 },
      { href: '/admin/organizations',  label: 'Organizations', icon: Building2, sort: 2 },
      { href: '/admin/contacts',       label: 'Contacts',      icon: Users,     sort: 3 },
      { href: '/admin/mail',           label: 'Mail',          icon: Mail,      sort: 4 },
      { href: '/admin/leads',          label: 'Leads',         icon: UserPlus,  sort: 4 },
    ],
  },
  {
    label: 'Accounting',
    sort: 4,
    items: [
      { href: '/admin/accounting-dashboard', label: 'Dashboard',          icon: Home,         sort: 1 },
      { href: '/admin/chart-of-accounts',    label: 'Chart of Accounts',  icon: ListOrdered,  sort: 2 },
      { href: '/admin/journal-entries',      label: 'Journal Entries',    icon: BookOpen,     sort: 3 },
      { href: '/admin/balances',             label: 'Balances',           icon: Scale,        sort: 3 },
      { href: '/admin/payments',             label: 'Payments',           icon: CreditCard,   sort: 5 },
      { href: '/admin/recurring-invoices',   label: 'Recurring Invoices', icon: RotateCw,     sort: 7 },
      { href: '/admin/catalog',              label: 'Catalog',            icon: Package,      sort: 8 },
      { href: '/admin/offerings',            label: 'Offerings',          icon: Wrench,       sort: 8 },
      { href: '/admin/accounting-reports',   label: 'Reports',            icon: BarChart3,    sort: 11 },
    ],
  },
  {
    label: 'Banking',
    sort: 5,
    items: [
      { href: '/admin/bank-accounts',     label: 'Bank Accounts', icon: Building,        sort: 1 },
      { href: '/admin/bank-transactions', label: 'Transactions',  icon: ArrowLeftRight,  sort: 2 },
      { href: '/admin/bank-cards',        label: 'Cards',         icon: CreditCard,      sort: 3 },
      { href: '/admin/bills',             label: 'Bills',         icon: Receipt,         sort: 5 },
    ],
  },
  {
    label: 'Marketing & Ads',
    sort: 6,
    items: [
      { href: '/admin/marketing-dashboard', label: 'Dashboard',     icon: Home,      sort: 1 },
      { href: '/admin/ads',                 label: 'Ads',           icon: Megaphone, sort: 2 },
      { href: '/admin/campaigns',           label: 'Campaigns',     icon: Sparkles,  sort: 3 },
      { href: '/admin/design-studio',       label: 'Design Studio', icon: Palette,   sort: 4 },
    ],
  },
  {
    label: 'Content & Blog',
    sort: 7,
    items: [
      { href: '/admin/content-dashboard',   label: 'Dashboard',    icon: Home,            sort: 1 },
      { href: '/admin/web-contents',        label: 'Web',          icon: Globe,           sort: 2 },
      { href: '/admin/social-media-posts',  label: 'Social Media', icon: MessagesSquare,  sort: 3 },
      { href: '/admin/blog-posts',          label: 'Blog',         icon: PenLine,         sort: 4 },
      { href: '/admin/physical-assets',     label: 'Physical',     icon: Box,             sort: 5 },
    ],
  },
  {
    label: 'AI Tools',
    sort: 8,
    items: [
      { href: '/admin/ai-dashboard',  label: 'Dashboard',    icon: Home,     sort: 1 },
      { href: '/admin/agents',        label: 'Agents',       icon: Cpu,      sort: 2 },
      { href: '/admin/workflows',     label: 'Workflows',    icon: RotateCw, sort: 3 },
      { href: '/admin/architectures', label: 'Architecture', icon: Database, sort: 4 },
    ],
  },
  {
    label: 'Integrations',
    sort: 9,
    items: [
      { href: '/admin/integrations-dashboard',  label: 'Dashboard',     icon: Home,        sort: 1 },
      { href: '/admin/marketplace-workspace',   label: 'Marketplace',   icon: ShoppingBag, sort: 2 },
      { href: '/admin/webhooks',                label: 'Webhooks',      icon: LinkIcon,    sort: 2 },
      { href: '/admin/messages-workspace',      label: 'Messages',      icon: Inbox,       sort: 3 },
      { href: '/admin/api-integrations',        label: 'API',           icon: Terminal,    sort: 3 },
      { href: '/admin/external-leads',          label: 'External Leads',icon: UserPlus,    sort: 4 },
      { href: '/admin/mcp-servers',             label: 'MCP',           icon: Server,      sort: 4 },
      { href: '/admin/snippets',                label: 'Snippets',      icon: Code,        sort: 5 },
      { href: '/admin/google-workspace',        label: 'Google',        icon: Globe,       sort: 5 },
    ],
  },
  {
    label: 'Administration',
    sort: 10,
    items: [
      { href: '/admin/settings', label: 'Settings', icon: SettingsIcon,    sort: 1 },
      { href: '/admin/log',      label: 'Log',      icon: ClipboardList,   sort: 2 },
      { href: '/admin/users',    label: 'Users',    icon: UsersRound,      sort: 3 },
    ],
  },
];

/**
 * Flat list of every nav target, useful for breadcrumbs / page titles
 * / route-existence checks.
 */
export const NAV_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) =>
  [...g.items].sort((a, b) => a.sort - b.sort)
);

export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_FLAT.find(
    (i) =>
      i.href === pathname ||
      i.match?.includes(pathname) ||
      (i.href !== '/admin' && pathname.startsWith(i.href))
  );
}

export function navGroupForPath(pathname: string): NavGroup | undefined {
  for (const g of NAV_GROUPS) {
    if (g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + '/'))) {
      return g;
    }
  }
  return undefined;
}
