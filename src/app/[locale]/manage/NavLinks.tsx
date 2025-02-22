'use client';

import { memo, use } from 'react';

import { Package2, Settings } from 'lucide-react';

import { cn } from '@/utilities';

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes, manageMenuItems } from '@/constants';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Link, usePathname } from '@/lib/i18n';

function NavLinks() {
    const pathname = usePathname();

    const { role } = use(AuthContext);

    const settingLinkClassnames = cn(
        'flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8',
        {
            'bg-accent text-accent-foreground': pathname === AppNavigationRoutes.MANAGE_SETTING,
            'text-muted-foreground': pathname !== AppNavigationRoutes.MANAGE_SETTING,
        }
    );

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 py-4">
                    <Link
                        href="#"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>

                    {manageMenuItems.map((Item, index) => {
                        const isActive = pathname === Item.href;

                        // role can be undefined, but it is fine with general logic.
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        if (Item.roles.includes(role)) return null;

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={Item.href}
                                        className={cn(
                                            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                                            {
                                                'bg-accent text-accent-foreground': isActive,
                                                'text-muted-foreground': !isActive,
                                            }
                                        )}
                                    >
                                        <Item.Icon className="h-5 w-5" />
                                        <span className="sr-only">{Item.title}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{Item.title}</TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={AppNavigationRoutes.MANAGE_SETTING}
                                className={settingLinkClassnames}
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Cài đặt</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Cài đặt</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </TooltipProvider>
    );
}

export default memo(NavLinks);
