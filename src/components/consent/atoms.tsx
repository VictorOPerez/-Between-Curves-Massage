'use client';
import * as React from 'react';


export const PaperHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <header className="text-center">
        <h1 className="font-serif tracking-[0.3em] text-2xl sm:text-3xl">{title}</h1>
        <p className="mt-1 text-base opacity-80">{subtitle}</p>
    </header>
);


export const UnderlineInput: React.FC<{
    value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}> = ({ value, onChange, placeholder, className }) => (
    <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={"w-full border-b border-neutral-400/70 bg-transparent pb-1 text-[14px] outline-none focus:border-neutral-700 " + (className ?? '')}
    />
);


export const Checkbox: React.FC<{
    label: string; checked: boolean; onChange: () => void;
}> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" className="h-4 w-4" checked={checked} onChange={onChange} />
        <span className="select-none leading-tight">{label}</span>
    </label>
);


export const Radio: React.FC<{
    label: string; checked: boolean; onChange: () => void;
}> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 text-[14px]">
        <input type="radio" className="h-4 w-4" checked={checked} onChange={onChange} />
        <span className="select-none leading-tight">{label}</span>
    </label>
);


export const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="mt-2 text-[13px] font-semibold tracking-wide text-neutral-700">{children}</h3>
);