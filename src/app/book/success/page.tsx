import Link from 'next/link'

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-serif text-[#25413A] mb-4">¡Pago Recibido!</h1>
                <p className="text-gray-600 mb-8">
                    Tu cita ha sido confirmada exitosamente. Hemos enviado los detalles a tu correo electrónico.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-[#25413A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a2e29] transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    )
}