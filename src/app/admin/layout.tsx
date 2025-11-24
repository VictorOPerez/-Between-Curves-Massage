import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.COOKIE_NAME || 'admin_session')

    // Obtenemos la ruta actual (truco simple en server components)
    // Nota: En layout server-side a veces no tenemos la URL directa fácilmente,
    // pero la protección básica funciona verificando la cookie.

    // Si NO hay cookie, forzamos login.
    // PERO: Si ya estamos en /login, no queremos un bucle infinito.
    // Como este layout envuelve también a /login, necesitamos una lógica condicional
    // O MÁS FÁCIL: Sacamos el login FUERA de este layout o simplemente controlamos
    // la redirección en la página protegida.

    // ESTRATEGIA MEJORADA PARA TU ESTRUCTURA:
    // Vamos a dejar que este layout sea solo un contenedor visual y protegeremos
    // página por página o usaremos Middleware. 

    // Para hacerlo MINIMALISTA y sin middleware complejo ahora mismo:
    // Vamos a asumir que si entran aquí es seguro, PERO en la página
    // del calendario haremos el check final.

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Aquí podrías poner una barra de navegación Admin simple */}
            {children}
        </div>
    )
}