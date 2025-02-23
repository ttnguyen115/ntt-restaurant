import { ReactNode } from 'react';

export type Children = ReactNode;

export type ChildrenObject = { children: ReactNode };

export type ChildrenObjectWithLocale = ChildrenObject & { params: Promise<{ locale: string }> };
