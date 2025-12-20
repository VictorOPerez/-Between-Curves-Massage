import Link from "next/link";

const CONSENT_URL = "https://www.curvesmassages.com/consent";

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-serif text-[#25413A] mb-4">¡Pago Recibido!</h1>
                <p className="text-gray-600 mb-6">
                    Tu cita ha sido confirmada exitosamente. Hemos enviado los detalles a tu correo electrónico.
                </p>

                {/* Highlighted consent block */}
                <div className="text-left bg-[#F3F7F6] border border-[#25413A]/10 rounded-2xl p-5 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-9 h-9 rounded-full bg-[#25413A] flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-[#25413A]">
                                Próximo paso: Consentimiento informado
                            </h2>
                            <p className="text-sm text-gray-700 mt-1">
                                Para ahorrar tiempo, te recomendamos completar el consentimiento informado antes de tu cita.
                            </p>

                            <p className="text-sm text-gray-600 mt-3">
                                Si no lo llenas ahora o tienes algún problema, no te preocupes: puedes hacerlo al llegar al spa
                                con la ayuda de un profesional.
                            </p>

                            <a
                                href={CONSENT_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex items-center justify-center w-full bg-[#25413A] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#1a2e29] transition-colors"
                            >
                                Llenar consentimiento informado
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 3h7v7m0-7L10 14m-1 7H5a2 2 0 01-2-2v-4"
                                    />
                                </svg>
                            </a>

                            <p className="text-xs text-gray-500 mt-3">
                                (Se abre en una nueva pestaña)
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/"
                    className="inline-block bg-white border border-[#25413A]/20 text-[#25413A] px-8 py-3 rounded-xl font-bold hover:bg-[#F7FBFA] transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}
