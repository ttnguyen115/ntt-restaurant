import { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react';

import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utilities';

type BreadcrumbProps = ComponentPropsWithRef<'nav'> & { separator?: ReactNode };
const Breadcrumb = ({ ref, ...props }: BreadcrumbProps) => (
    <nav
        ref={ref}
        aria-label="breadcrumb"
        {...props}
    />
);
Breadcrumb.displayName = 'Breadcrumb';

type BreadcrumbListProps = ComponentPropsWithRef<'ol'>;
const BreadcrumbList = ({ className, ref, ...props }: BreadcrumbListProps) => (
    <ol
        ref={ref}
        className={cn(
            'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
            className
        )}
        {...props}
    />
);
BreadcrumbList.displayName = 'BreadcrumbList';

type BreadcrumbItemProps = ComponentPropsWithRef<'li'>;
const BreadcrumbItem = ({ className, ref, ...props }: BreadcrumbItemProps) => (
    <li
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', className)}
        {...props}
    />
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

type BreadcrumbLinkProps = ComponentPropsWithRef<'a'> & { asChild?: boolean };
const BreadcrumbLink = ({ asChild, className, ref, ...props }: BreadcrumbLinkProps) => {
    const Comp = asChild ? Slot : 'a';

    return (
        <Comp
            ref={ref}
            className={cn('transition-colors hover:text-foreground', className)}
            {...props}
        />
    );
};
BreadcrumbLink.displayName = 'BreadcrumbLink';

type BreadcrumbPageProps = ComponentPropsWithRef<'span'>;
const BreadcrumbPage = ({ className, ref, ...props }: BreadcrumbPageProps) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn('font-normal text-foreground', className)}
        {...props}
    />
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: ComponentProps<'li'>) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cn('[&>svg]:size-3.5', className)}
        {...props}
    >
        {children ?? <ChevronRightIcon />}
    </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: ComponentProps<'span'>) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <DotsHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More</span>
    </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
};
