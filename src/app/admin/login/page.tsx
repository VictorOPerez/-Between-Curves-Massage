'use client'

import { loginAction } from '@/app/api/admin/actions'
import { useActionState } from 'react'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        // Fondo Verde Corporativo (Extraído de sus fotos)
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#25413A] px-4 font-sans text-slate-100">

            {/* Elemento Decorativo de Fondo (Círculo sutil tipo 'glow') */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2DD4BF] opacity-5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-sm relative z-10">

                {/* Logo Branding */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-serif text-[#D4B886] tracking-widest">BCM</h1>
                    <p className="text-[#D4B886]/80 text-sm tracking-widest mt-2 uppercase font-light">
                        Between Curves Massage
                    </p>
                    <div className="h-px w-16 bg-[#D4B886]/30 mx-auto mt-6"></div>
                </div>

                {/* Tarjeta de Login (Efecto Glassmorphism sutil) */}
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-medium text-white">
                            Acceso Administrativo
                        </h2>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="PIN de Seguridad"
                                className="block w-full rounded-lg border-0 bg-white/10 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#2DD4BF] sm:text-sm sm:leading-6 transition-all text-center tracking-widest"
                            />
                        </div>

                        {state?.message && (
                            <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200 text-center animate-pulse">
                                {state.message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-[#1a2e29]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verificando...
                                    </span>
                                ) : (
                                    'INGRESAR AL SISTEMA'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center text-xs text-white/20 mt-8">
                    Sistema Privado de Gestión v1.0
                </p>
            </div>
        </div>
    )
}