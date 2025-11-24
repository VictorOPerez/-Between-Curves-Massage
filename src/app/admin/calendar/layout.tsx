import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.COOKIE_NAME || 'admin_session')

    if (!token) {
        redirect('/admin/login')
    }

    return (
        <section>
            <header className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
                <h1 className="font-bold text-xl">Panel de Reservas</h1>
                {/* Aquí pondremos el botón de Logout después */}
                <div className="text-sm text-gray-500">Modo Admin</div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </section>
    )
}