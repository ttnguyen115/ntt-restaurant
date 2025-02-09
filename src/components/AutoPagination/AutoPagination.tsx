import { memo } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface AutoPaginationProps {
    page: number;
    pageSize: number;
    pathname?: string;
    isLink?: boolean;
    onClick?: (pageNumber: number) => void;
}

const RANGE = 2;

function AutoPagination({
    page,
    pageSize,
    pathname = AppNavigationRoutes.DEFAULT,
    isLink = true,
    onClick = () => {},
}: AutoPaginationProps) {
    const renderPagination = () => {
        let dotAfter = false;
        let dotBefore = false;

        const renderDotBefore = (_: number) => {
            if (!dotBefore) {
                dotBefore = true;
                return (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            return null;
        };

        const renderDotAfter = (_: number) => {
            if (!dotAfter) {
                dotAfter = true;
                return (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            return null;
        };

        return Array(pageSize)
            .fill(0)
            .map((_, index) => {
                const pageNumber = index + 1;

                if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                    return renderDotAfter(index);
                }

                if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
                    if (pageNumber < page - RANGE && pageNumber > RANGE) {
                        return renderDotBefore(index);
                    }
                    if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                        return renderDotAfter(index);
                    }
                } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
                    return renderDotBefore(index);
                }

                return (
                    <PaginationItem key={index}>
                        {isLink ? (
                            <PaginationLink
                                href={{
                                    pathname,
                                    query: {
                                        page: pageNumber,
                                    },
                                }}
                                isActive={pageNumber === page}
                            >
                                {pageNumber}
                            </PaginationLink>
                        ) : (
                            <Button
                                className="w-9 h-9 p-0"
                                onClick={() => onClick(pageNumber)}
                                variant={pageNumber === page ? 'outline' : 'ghost'}
                            >
                                {pageNumber}
                            </Button>
                        )}
                    </PaginationItem>
                );
            });
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {isLink ? (
                        <PaginationPrevious
                            href={{
                                pathname,
                                query: {
                                    page: page - 1,
                                },
                            }}
                            className={cn({
                                'cursor-not-allowed': page === 1,
                            })}
                            onClick={(e) => {
                                if (page === 1) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    ) : (
                        <Button
                            disabled={page === 1}
                            className="h-9 p-0 px-2"
                            variant="ghost"
                            onClick={() => {
                                onClick(page - 1);
                            }}
                        >
                            <ChevronLeft className="w-5 h-5" /> Previous
                        </Button>
                    )}
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                    {isLink ? (
                        <PaginationNext
                            href={{
                                pathname,
                                query: {
                                    page: page + 1,
                                },
                            }}
                            className={cn({
                                'cursor-not-allowed': page === pageSize,
                            })}
                            onClick={(e) => {
                                if (page === pageSize) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    ) : (
                        <Button
                            disabled={page === pageSize}
                            className="h-9 p-0 px-2"
                            variant="ghost"
                            onClick={() => {
                                onClick(page + 1);
                            }}
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </Button>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default memo(AutoPagination);
