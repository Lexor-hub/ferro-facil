import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

const SectionHeader = ({
  title,
  subtitle,
  badge,
  align = 'left',
  className,
  ...props
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div
      className={cn(
        'flex flex-col w-full mb-8',
        alignmentClasses[align],
        className
      )}
      {...props}
    >
      {badge && <div className="mb-2">{badge}</div>}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export { SectionHeader };