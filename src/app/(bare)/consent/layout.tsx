// app/(bare)/consent/layout.tsx
export const metadata = {
    robots: { index: false, follow: false },
};

export default function ConsentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh w-ful">
            {children}
        </div>
    );
}
