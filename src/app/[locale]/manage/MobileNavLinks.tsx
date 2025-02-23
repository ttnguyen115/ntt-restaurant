'use client';

import { memo, use } from 'react';

import { Package2, PanelLeft } from 'lucide-react';

import { cn } from '@/utilities';

import { AuthContext } from '@/contexts';

import { manageMenuItems } from '@/constants';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Link, usePathname } from '@/lib';

function MobileNavLinks() {
    const pathname = usePathname();

    const { role } = use(AuthContext);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="sm:hidden"
                >
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="sm:max-w-xs"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle />
                    <SheetDescription />
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                        href="#"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    {manageMenuItems.map((Item, index) => {
                        const isActive = pathname === Item.href;

                        // role can be undefined, but it is fine with general logic.
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        if (Item.roles.includes(role)) return null;

                        return (
                            <Link
                                key={index}
                                href={Item.href}
                                className={cn('flex items-center gap-4 px-2.5  hover:text-foreground', {
                                    'text-foreground': isActive,
                                    'text-muted-foreground': !isActive,
                                })}
                            >
                                <Item.Icon className="h-5 w-5" />
                                {Item.title}
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export default memo(MobileNavLinks);
