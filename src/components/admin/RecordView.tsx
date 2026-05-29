import Link from 'next/link';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/src/lib/utils';

type RecordViewProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  backHref: string;
  backLabel?: string;
  children: ReactNode;
};

export function RecordView({
  title,
  subtitle,
  badge,
  backHref,
  backLabel = 'Back to records',
  children,
}: RecordViewProps) {
  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <Badge variant="outline">{subtitle}</Badge> : null}
          {badge ? <div>{badge}</div> : null}
        </div>

        <Link
          href={backHref}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-full')}
        >
          {backLabel}
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </div>
  );
}

type RecordPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function RecordPanel({ title, description, children }: RecordPanelProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3 pt-4">{children}</CardContent>
    </Card>
  );
}
