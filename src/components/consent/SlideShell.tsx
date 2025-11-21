'use client';
import * as React from 'react';
import { PaperHeader } from './atoms';


export const SlideShell: React.FC<{
    title: string; subtitle: string; brandName?: string; children: React.ReactNode;
}> = ({ title, subtitle, brandName = 'HERBAL THERAPIES AND MASSAGE', children }) => (
    <div className="h-full w-full px-3">
        <div className="grid h-full grid-rows-[auto_1fr_auto] rounded-xl bg-white text-neutral-900 shadow-lg ring-1 ring-black/10">
            <div className="px-5 pt-5"><PaperHeader title={title} subtitle={subtitle} /></div>
            <div className="px-5 py-2 text-[14px] leading-snug">{children}</div>
            <div className="py-2 text-center text-xs text-neutral-500">{brandName}</div>
        </div>
    </div>
);