import {forwardRef} from 'react';
import {Link} from '@remix-run/react';
import clsx from 'clsx';

import {missingClass} from '~/lib/utils';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: 'primary' | 'secondary' | 'accent' | 'void' | 'inline';
      width?: 'auto' | 'full';
      [key: string]: any;
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    const baseButtonClasses =
      'inline-block text-center transition-colors duration-300';

    const variants = {
      primary: `${baseButtonClasses} rounded-none bg-primary text-contrast font-medium py-3 px-6 hover:bg-primary/90`,
      secondary: `${baseButtonClasses} rounded-none border border-primary/10 bg-surface text-primary font-medium py-3 px-6 hover:border-primary/25`,
      accent: `${baseButtonClasses} rounded-none bg-accent text-primary text-fine font-medium uppercase tracking-void-nav py-4 px-8 hover:bg-accent/85`,
      void: `${baseButtonClasses} rounded-none border border-accent/50 bg-transparent text-fine font-normal uppercase tracking-[0.28em] text-primary/90 py-[1.125rem] px-10 hover:border-accent hover:bg-accent/[0.06] hover:text-primary`,
      inline: 'border-b border-primary/10 leading-none pb-1',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    const styles = clsx(
      missingClass(className, 'bg-') && variants[variant],
      missingClass(className, 'w-') && widths[width],
      className,
    );

    return (
      <Component
        // @todo: not supported until react-router makes it into Remix.
        // preventScrollReset={true}
        className={styles}
        {...props}
        ref={ref}
      />
    );
  },
);
