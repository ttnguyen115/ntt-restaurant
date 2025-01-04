import { HTMLAttributes, memo, RefAttributes } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Children } from '@/types';

interface CardContainerProps {
    cardProps?: HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>;
    children: Readonly<Children>;
    containerClassName?: string;
    description?: string;
    headerClassName?: string;
    title: string;
    titleClassName?: string;
}

function CardContainer({
    children,
    containerClassName,
    title,
    description,
    headerClassName,
    titleClassName,
    ...cardProps
}: CardContainerProps) {
    return (
        <Card
            {...cardProps}
            className={containerClassName}
        >
            <CardHeader className={headerClassName}>
                <CardTitle className={titleClassName}>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default memo(CardContainer);
