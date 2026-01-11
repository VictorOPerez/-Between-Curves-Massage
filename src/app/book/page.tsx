'use client'
import { Suspense } from 'react' // 👈 Importante
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { getService, ServiceData, SERVICES_DB } from '@/lib/services'
import { createStripeSession, getAvailableSlots } from '../api/admin/actions' // Usamos la nueva acción
import {
    format, addDays, startOfToday, isSameDay, isBefore,
    startOfMonth, endOfMonth, eachDayOfInterval,
    addMonths, subMonths, getDay, isToday, addMinutes
} from 'date-fns'
import { es, enUS } from 'date-fns/locale'

type Lang = 'es' | 'en'

const UI_TEXT: Record<Lang, {
    langLabel: string
    booking: string
    reserving: string
    changeMassageAria: string
    moreMassages: string
    tapToChoose: string
    investment: string

    selectService: string
    massageTypes: string
    closeAria: string
    close: string
    choose: string
    selected: string

    step1: string
    viewCalendar: string

    step2: string
    availableTimes: string
    loadingTimes: string
    selectTimePlaceholder: string
    selectedTime: string

    timesModalTitle: string
    morning: string
    afternoon: string
    cancel: string
    noSlots: string

    investmentDetail: string
    selectedService: string
    depositTitle: string
    depositNote: string

    redirecting: string
    goPayDeposit: string
    pickTime: string

    ssl: string
    loading: string

    calendarSelectDate: string
    weekdays: string[]

    premiumGuarantee: string
    stripeError: string
}> = {
    es: {
        langLabel: 'Idioma',
        booking: 'Estás Reservando:',
        reserving: 'Estás Reservando:',
        changeMassageAria: 'Cambiar tipo de masaje',
        moreMassages: 'MÁS MASAJES',
        tapToChoose: 'Toca aquí para elegir otro tipo de masaje',
        investment: 'Inversión',

        selectService: 'Selecciona un servicio',
        massageTypes: 'Tipos de masaje',
        closeAria: 'Cerrar',
        close: 'Cerrar',
        choose: 'Elegir',
        selected: 'Seleccionado',

        step1: 'SELECCIONA EL DÍA',
        viewCalendar: 'Ver Calendario',

        step2: 'HORARIOS DISPONIBLES',
        availableTimes: 'Horarios disponibles',
        loadingTimes: 'Cargando horarios...',
        selectTimePlaceholder: 'Selecciona un horario...',
        selectedTime: 'Seleccionado:',

        timesModalTitle: 'Horarios disponibles',
        morning: 'Mañana',
        afternoon: 'Tarde',
        cancel: 'Cancelar',
        noSlots: 'No hay horarios disponibles para este día.',

        investmentDetail: 'Detalle de la Inversión',
        selectedService: 'Servicio Seleccionado',
        depositTitle: 'Depósito de Reserva (10%)',
        depositNote: '*Pagable hoy vía Stripe Seguro',

        redirecting: 'Redirigiendo a Pago...',
        goPayDeposit: 'Ir a Pagar Depósito',
        pickTime: 'Selecciona un horario',

        ssl: 'Transacción encriptada SSL',
        loading: 'Cargando...',

        calendarSelectDate: 'Selecciona Fecha',
        weekdays: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],

        premiumGuarantee: 'Garantía Premium',
        stripeError: 'Hubo un error al conectar con Stripe. Intenta de nuevo.',
    },
    en: {
        langLabel: 'Language',
        booking: 'You are booking:',
        reserving: 'You are booking:',
        changeMassageAria: 'Change massage type',
        moreMassages: 'MORE SERVICES',
        tapToChoose: 'Tap here to choose another massage',
        investment: 'Investment',

        selectService: 'Select a service',
        massageTypes: 'Massage types',
        closeAria: 'Close',
        close: 'Close',
        choose: 'Choose',
        selected: 'Selected',

        step1: 'SELECT A DAY',
        viewCalendar: 'View Calendar',

        step2: 'AVAILABLE TIMES',
        availableTimes: 'Available times',
        loadingTimes: 'Loading times...',
        selectTimePlaceholder: 'Select a time...',
        selectedTime: 'Selected:',

        timesModalTitle: 'Available times',
        morning: 'Morning',
        afternoon: 'Afternoon',
        cancel: 'Cancel',
        noSlots: 'No available times for this day.',

        investmentDetail: 'Investment Details',
        selectedService: 'Selected Service',
        depositTitle: 'Booking Deposit (10%)',
        depositNote: '*Payable today via secure Stripe',

        redirecting: 'Redirecting to payment...',
        goPayDeposit: 'Pay Deposit',
        pickTime: 'Select a time',

        ssl: 'SSL encrypted transaction',
        loading: 'Loading...',

        calendarSelectDate: 'Select Date',
        weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

        premiumGuarantee: 'Premium Guarantee',
        stripeError: 'There was an error connecting to Stripe. Please try again.',
    },
}

const SERVICE_I18N: Partial<Record<string, Record<Lang, {
    title: string
    description: string
    features: string[]
}>>> = {
    'masaje-relajante-60': {
        en: {
            title: 'Relaxing Massage (60 min)',
            description:
                'A gentle to medium-pressure massage focused on relieving stress, relaxing muscles, and improving overall well-being in our relaxation room.',
            features: ['Stress relief', 'Improves circulation', 'Light to medium pressure'],
        },
        es: {
            title: 'Masaje Relajante (60 min)',
            description:
                'Un masaje suave a medio enfocado en liberar estrés, relajar músculos y mejorar el bienestar general en nuestra cabina de relajación.',
            features: ['Alivio del estrés', 'Mejora la circulación', 'Presión suave a media'],
        },
    },
    'masaje-relajante-90': {
        en: {
            title: 'Relaxing Massage (90 min)',
            description:
                'Extended session for deeper relaxation: full-body work, breathing, and release of accumulated tension in a calm environment.',
            features: ['Deep relaxation', 'Tension release', 'Ideal for chronic stress'],
        },
        es: {
            title: 'Masaje Relajante (90 min)',
            description:
                'Sesión extendida para una relajación más profunda: trabajo completo de cuerpo, respiración y descarga de tensión acumulada en un ambiente controlado.',
            features: ['Relajación profunda', 'Descarga de tensión', 'Ideal para estrés crónico'],
        },
    },
    'masaje-relajante-120': {
        en: {
            title: 'Relaxing Massage (120 min)',
            description:
                'A complete relaxation ritual to fully disconnect. Perfect if you have been carrying tension for weeks.',
            features: ['Maximum relaxation', 'Premium session', 'Full body'],
        },
        es: {
            title: 'Masaje Relajante (120 min)',
            description:
                'Ritual completo de relajación para desconectar del mundo exterior. Perfecto si llevas semanas con tensión acumulada.',
            features: ['Máxima relajación', 'Sesión premium', 'Cuerpo completo'],
        },
    },

    'deep-tissue-60': {
        es: {
            title: 'Masaje de Tejido Profundo (60 min)',
            description:
                'Trabajo terapéutico de presión firme en capas profundas del músculo. Ideal para tratar contracturas y rigidez.',
            features: ['Presión firme', 'Libera contracturas', 'Recuperación muscular'],
        },
        en: {
            title: 'Deep Tissue Massage (60 min)',
            description:
                'Therapeutic work with firm pressure in deeper muscle layers. Great for knots, stiffness, and recovery.',
            features: ['Firm pressure', 'Releases knots', 'Muscle recovery'],
        },
    },
    'deep-tissue-90': {
        es: {
            title: 'Masaje de Tejido Profundo (90 min)',
            description:
                'Sesión extendida para trabajar zonas específicas con más detalle (espalda, cuello, hombros, piernas) con técnicas profundas.',
            features: ['Terapéutico profundo', 'Enfoque por zonas', 'Alivio duradero'],
        },
        en: {
            title: 'Deep Tissue Massage (90 min)',
            description:
                'Extended session to work specific areas in more detail (back, neck, shoulders, legs) using deep techniques.',
            features: ['Deep therapeutic work', 'Targeted areas', 'Long-lasting relief'],
        },
    },

    'masaje-reductor-moldeador': {
        en: {
            title: 'Slimming / Sculpting Massage',
            description:
                'An aesthetic technique focused on sculpting the body, improving the look of the skin, and supporting lymphatic drainage.',
            features: ['Shape and define', 'Improves appearance', 'Supports drainage'],
        },
        es: {
            title: 'Masaje Reductor / Moldeador',
            description:
                'Técnica estética enfocada en moldear la figura, mejorar la apariencia de la piel y apoyar el drenaje linfático.',
            features: ['Moldear y definir', 'Mejora apariencia', 'Apoyo al drenaje'],
        },
    },

    'paquete-6-sesiones': {
        en: {
            title: '6-Session Package',
            description:
                'Ideal package for consistent progress. Recommended for sculpting goals and maintenance.',
            features: ['Package savings', 'Consistent plan', 'Cumulative results'],
        },
        es: {
            title: 'Paquete de 6 Sesiones',
            description:
                'Paquete ideal para progreso consistente en nuestro spa. Recomendado para objetivos de moldeado y mantenimiento.',
            features: ['Ahorro por paquete', 'Plan consistente', 'Resultados acumulativos'],
        },
    },
    'paquete-10-sesiones': {
        en: {
            title: '10-Session Package',
            description:
                'Recommended for more ambitious goals. Perfect for building a wellness routine with your visits.',
            features: ['Best value', 'Great for goals', 'Progress tracking'],
        },
        es: {
            title: 'Paquete de 10 Sesiones',
            description:
                'Paquete recomendado para objetivos más ambiciosos. Ideal para crear una rutina de bienestar en tus visitas.',
            features: ['Mejor valor', 'Ideal para metas', 'Seguimiento de progreso'],
        },
    },
    'paquete-12-sesiones': {
        en: {
            title: '12-Session Package',
            description:
                'Premium package for maximum consistency. Transform body and mind with a complete plan.',
            features: ['Complete plan', 'Maximum consistency', 'Sustained results'],
        },
        es: {
            title: 'Paquete de 12 Sesiones',
            description:
                'Paquete premium para máxima consistencia. Transforma tu cuerpo y mente con un plan completo.',
            features: ['Plan completo', 'Mejor consistencia', 'Resultados sostenidos'],
        },
    },

    'reflexologia-60': {
        en: {
            title: 'Reflexology (60 min)',
            description:
                'A relaxing therapy focused on reflex points in the feet to relieve tension and stress in a calm environment.',
            features: ['Deep relaxation', 'Stress relief', 'Overall balance'],
        },
        es: {
            title: 'Reflexología (60 min)',
            description:
                'Terapia relajante centrada en puntos reflejos del pie para aliviar tensión y estrés en un entorno tranquilo.',
            features: ['Relajación profunda', 'Alivio de estrés', 'Equilibrio general'],
        },
    },
    'full-reflexologia-detox-90': {
        en: {
            title: 'Full Detox Reflexology (90 min)',
            description:
                'A full ritual focused on relaxation, release, and an overall feeling of lightness.',
            features: ['Detox ritual', 'Extended session', 'Lightness and well-being'],
        },
        es: {
            title: 'Full Reflexología Detox (90 min)',
            description:
                'Ritual integral enfocado en relajación, descarga y sensación de ligereza total.',
            features: ['Ritual detox', 'Sesión extendida', 'Ligereza y bienestar'],
        },
    },
}

function getServiceCopy(s: ServiceData, lang: Lang) {
    const entry = SERVICE_I18N?.[s.id]?.[lang]
    return {
        title: entry?.title ?? s.title,
        description: entry?.description ?? s.description,
        features: entry?.features ?? s.features,
    }
}

function BookingContent() {
    const searchParams = useSearchParams() // Aquí es donde ocurre la magia
    // ... pega aquí todo el resto de tu lógica, estados, useEffects y el return del JSX
    const dateInputRef = useRef<HTMLInputElement>(null)

    const [lang, setLang] = useState<Lang>('es')

    useEffect(() => {
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem('book_lang') : null
        if (saved === 'es' || saved === 'en') setLang(saved)
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') window.localStorage.setItem('book_lang', lang)
    }, [lang])

    const t = UI_TEXT[lang]
    const locale = lang === 'es' ? es : enUS

    const [service, setService] = useState<ServiceData | null>(null)
    const [isLoadingPage, setIsLoadingPage] = useState(true)

    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false)
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [currentMonth, setCurrentMonth] = useState(startOfToday())
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
    const [isHeroImgLoading, setIsHeroImgLoading] = useState(true)

    useEffect(() => {
        const serviceSlug = searchParams.get('service')
        const data = getService(serviceSlug)
        setService(data)
        setIsLoadingPage(false)
    }, [searchParams])

    useEffect(() => {
        const fetchServerSlots = async () => {
            if (!service) return
            setIsLoadingSlots(true)
            setSelectedTime(null)

            const dateStr = format(selectedDate, 'yyyy-MM-dd')
            const response = await getAvailableSlots(dateStr, service.id)

            if (response.success && response.slots) {
                setAvailableSlots(response.slots)
            } else {
                setAvailableSlots([])
            }
            setIsLoadingSlots(false)
        }
        fetchServerSlots()
    }, [selectedDate, service])

    const selectService = (newService: ServiceData) => {
        setIsHeroImgLoading(true)
        setService(newService)
        setIsServiceMenuOpen(false)
        setSelectedTime(null)
    }

    // ACCIÓN DIRECTA DE PAGO
    const handleDirectBooking = async () => {
        if (!service || !selectedTime) return
        setIsSubmitting(true)

        const [hours, minutes] = selectedTime.split(':').map(Number)
        const startTime = new Date(selectedDate)
        startTime.setHours(hours, minutes)

        const endTime = new Date(startTime)
        endTime.setMinutes(startTime.getMinutes() + service.durationMin)

        // Llamamos a la acción que SOLO crea la sesión de Stripe
        const result = await createStripeSession({
            serviceId: service.id,
            serviceName: service.title,
            startTime,
            endTime,
            amountTotal: service.fullPrice,
            amountPaid: service.fullPrice * 0.10 // 10%
        })

        if (result.success && result.url) {
            window.location.href = result.url
        } else {
            alert(t.stripeError)
            setIsSubmitting(false)
        }
    }

    // --- CÁLCULOS VISUALES ---
    const horizontalDays = Array.from({ length: 14 }).map((_, i) => addDays(selectedDate, i - 1))
    const morningSlots = availableSlots.filter(time => parseInt(time.split(':')[0]) < 12)
    const afternoonSlots = availableSlots.filter(time => parseInt(time.split(':')[0]) >= 12)

    const getSlotLabel = (timeStr: string) => {
        if (!service) return timeStr
        const [hours, minutes] = timeStr.split(':').map(Number)
        const start = new Date()
        start.setHours(hours, minutes)
        const end = addMinutes(start, service.durationMin)
        return `${timeStr} - ${format(end, 'HH:mm')}`
    }

    const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
    const firstDayOfMonth = getDay(startOfMonth(currentMonth))
    const emptyDays = Array(firstDayOfMonth).fill(null)
    const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.value) setSelectedDate(new Date(e.target.value + 'T00:00:00')) }

    if (!service || isLoadingPage) return (
        <div className="min-h-screen flex items-center justify-center bg-[#25413A] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#2DD4BF] border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse tracking-widest text-sm uppercase">{t.loading}</p>
            </div>
        </div>
    )

    const depositAmount = service.fullPrice * 0.10
    const remainingAmount = service.fullPrice - depositAmount
    const allServices = Object.values(SERVICES_DB)

    const serviceCopy = getServiceCopy(service, lang)

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans pb-24 md:pb-0">

            {/* COLUMNA IZQUIERDA (Igual) */}
            <div className="w-full md:w-5/12 lg:w-1/3 bg-[#1D332E] text-white relative flex flex-col justify-end overflow-hidden shadow-2xl z-10">
                <img src={service.image} alt={serviceCopy.title} onLoad={() => setIsHeroImgLoading(false)} onError={() => setIsHeroImgLoading(false)} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 ease-in-out key={service.id}" />
                {isHeroImgLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#2DD4BF] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#13221E] via-[#13221E]/20 to-transparent"></div>
                <div className="relative z-10 p-8 md:p-12">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[#D4B886] text-[10px] font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md border border-white/10 shadow-lg">
                        <ShieldIcon /> {t.premiumGuarantee}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-4 drop-shadow-lg transition-all duration-300">{serviceCopy.title}</h1>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 font-light border-l-2 border-[#2DD4BF] pl-4">{serviceCopy.description}</p>
                    <div className="space-y-4 mb-8">
                        {serviceCopy.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-100 font-medium">
                                <div className="bg-[#2DD4BF]/20 p-1 rounded-full"><CheckIcon /></div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 text-[#2DD4BF] text-sm font-bold tracking-wide uppercase bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                        <ClockIcon /> <span>{lang === 'es' ? `Sesión de ${service.durationMin} minutos` : `Session of ${service.durationMin} minutes`}</span>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="w-full md:w-7/12 lg:w-2/3 bg-[#FAFAFA] p-6 md:p-12 overflow-y-auto">
                <div className="max-w-2xl mx-auto">

                    {/* BOTÓN IDIOMA */}
                    <div className="flex justify-end mb-4">
                        <div className="inline-flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.langLabel}</span>
                            <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setLang('es')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest transition ${lang === 'es'
                                        ? 'bg-[#25413A] text-white'
                                        : 'text-[#25413A] hover:bg-gray-100'
                                        }`}
                                    aria-label="Cambiar a Español"
                                >
                                    ES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLang('en')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest transition ${lang === 'en'
                                        ? 'bg-[#25413A] text-white'
                                        : 'text-[#25413A] hover:bg-gray-100'
                                        }`}
                                    aria-label="Switch to English"
                                >
                                    EN
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SELECTOR SERVICIO */}
                    <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-6 relative">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                {t.booking}
                            </p>

                            {/* ✅ UNA SOLA CAJA: el propio botón */}
                            <button
                                type="button"
                                onClick={() => setIsServiceMenuOpen(true)}
                                className="group w-full flex items-center justify-between gap-3 text-left
                 rounded-2xl px-4 py-3
                 bg-[#2DD4BF]/10 border border-[#2DD4BF]/30
                 shadow-sm shadow-[#2DD4BF]/10
                 hover:shadow-md hover:shadow-[#2DD4BF]/20 hover:border-[#2DD4BF]/45
                 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]/30"
                                aria-label={t.changeMassageAria}
                            >
                                <span className="truncate text-2xl md:text-3xl font-serif text-[#25413A] relative">
                                    {serviceCopy.title}
                                    {/* underline elegante al hover */}
                                    <span
                                        aria-hidden
                                        className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent
                     opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </span>

                                <span className="flex items-center gap-2 shrink-0">
                                    {/* Chip verde fuerte */}
                                    <span className="inline-flex items-center rounded-full text-[10px] font-bold tracking-widest uppercase
                         px-2.5 py-1 bg-[#2DD4BF] text-[#13221E]
                         shadow-sm shadow-[#2DD4BF]/30">
                                        {t.moreMassages}
                                    </span>

                                    {/* Flecha animada siempre */}
                                    <span className="motion-safe:animate-bounce">
                                        <ChevronDownIcon />
                                    </span>
                                </span>
                            </button>

                            {/* Hint + puntico (sin caja extra) */}
                            <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                {t.tapToChoose}
                                <span className="inline-flex h-2 w-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                            </p>
                        </div>

                        <div className="text-right hidden sm:block pl-4 shrink-0">
                            <p className="text-xs text-gray-400 uppercase">{t.investment}</p>
                            <p className="text-2xl font-bold text-[#25413A]">${service.fullPrice}</p>
                        </div>
                    </div>

                    {/* MODAL DE SERVICIOS */}
                    {isServiceMenuOpen && (
                        <div
                            className="fixed inset-0 z-[999] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                            onClick={() => setIsServiceMenuOpen(false)}
                        >
                            <div
                                className="w-full max-w-xl bg-white md:rounded-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="bg-[#25413A] p-5 flex items-center justify-between text-white">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-[#2DD4BF] uppercase tracking-widest mb-1">
                                            {t.selectService}
                                        </p>
                                        <h3 className="text-xl md:text-2xl font-serif truncate">
                                            {t.massageTypes}
                                        </h3>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsServiceMenuOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition shrink-0"
                                        aria-label={t.closeAria}
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                {/* Lista con scroll */}
                                <div className="max-h-[75vh] overflow-y-auto">
                                    <div className="p-4 space-y-3 ">
                                        {allServices.map((s) => {
                                            const active = service.id === s.id
                                            const sCopy = getServiceCopy(s, lang)

                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => selectService(s)}
                                                    className={`w-full text-left rounded-2xl border p-3 flex items-center gap-4 transition relative
                  ${active
                                                            ? 'border-[#2DD4BF] bg-[#2DD4BF]/10'
                                                            : 'border-gray-200 bg-white hover:border-[#25413A]/40'
                                                        }`}
                                                >
                                                    {/* Texto */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-serif text-lg leading-snug ${active ? 'text-[#25413A] font-bold' : 'text-gray-800'}`}>
                                                            {sCopy.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {s.durationMin} min • ${s.fullPrice}
                                                        </p>
                                                    </div>

                                                    {/* CTA / Estado */}
                                                    <div className="flex-shrink-0">
                                                        {active ? (
                                                            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#25413A]">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2DD4BF]/30">
                                                                    <CheckIcon />
                                                                </span>
                                                                {t.selected}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-bold text-[#25413A] border border-[#25413A] px-3 py-1.5 rounded-full">
                                                                {t.choose}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsServiceMenuOpen(false)}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
                                    >
                                        {t.close}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1. SELECCIÓN DE DÍA */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-[#25413A] flex items-center gap-2">
                                <span className="bg-[#25413A] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> {t.step1}
                            </label>
                            <button onClick={() => setIsCalendarModalOpen(true)} className="text-xs font-bold text-[#25413A] hover:text-white hover:bg-[#25413A] transition-all uppercase tracking-wide border border-[#25413A] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                                <CalendarIcon /> {t.viewCalendar}
                            </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-hide mask-fade-right">
                            {horizontalDays.map((day, i) => {
                                const isSelected = isSameDay(day, selectedDate)
                                const isPast = isBefore(day, startOfToday())

                                return (
                                    <button key={i} disabled={isPast} onClick={() => { setSelectedDate(day); setSelectedTime(null) }} className={`flex-shrink-0 w-[72px] h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 group ${isSelected ? 'bg-[#25413A] border-[#25413A] text-white shadow-xl shadow-[#25413A]/20 scale-105 z-10' : isPast ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-400 hover:border-[#2DD4BF] hover:text-[#25413A]'}`}>
                                        <span className="text-[10px] uppercase font-bold tracking-wider mb-1">{format(day, 'EEE', { locale })}</span>
                                        <span className={`text-2xl font-serif ${isSelected ? 'text-[#D4B886]' : ''}`}>{format(day, 'd')}</span>
                                        <span className="text-[10px] mt-1 capitalize opacity-70">{format(day, 'MMM', { locale })}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 2. SELECCIÓN DE HORA (COMPACTA) */}
                    <div className=" min-h-[120px]">
                        <label className="text-sm font-bold text-[#25413A] flex items-center gap-2 mb-4">
                            <span className="bg-[#25413A] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> {t.step2}
                        </label>

                        {isLoadingSlots ? (
                            <div className="grid grid-cols-4 gap-3 animate-pulse">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>)}
                            </div>
                        ) : availableSlots.length > 0 ? (
                            <>
                                {/* ✅ MOBILE */}
                                <div className="md:hidden">
                                    <button
                                        type="button"
                                        onClick={() => setIsTimePickerOpen(true)}
                                        disabled={isLoadingSlots || availableSlots.length === 0}
                                        className={`w-full flex items-center justify-between gap-3 bg-white border rounded-xl px-4 py-4 text-sm font-bold shadow-sm transition
      ${isLoadingSlots ? 'border-gray-200 text-gray-400' : 'border-gray-200 text-[#25413A]'}
      ${availableSlots.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:border-[#2DD4BF]'}
    `}
                                    >
                                        <span className="truncate">
                                            {isLoadingSlots
                                                ? t.loadingTimes
                                                : selectedTime
                                                    ? getSlotLabel(selectedTime)
                                                    : t.selectTimePlaceholder}
                                        </span>
                                        <ChevronDownIcon />
                                    </button>

                                    {selectedTime && (
                                        <p className="mt-3 text-xs text-gray-500">
                                            {t.selectedTime}{' '}
                                            <span className="font-bold text-[#25413A]">{getSlotLabel(selectedTime)}</span>
                                        </p>
                                    )}

                                    {/* MODAL / BOTTOM SHEET */}
                                    {isTimePickerOpen && (
                                        <div
                                            className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                                            onClick={() => setIsTimePickerOpen(false)}
                                        >
                                            <div
                                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="bg-[#25413A] p-5 flex justify-between items-center text-white">
                                                    <div>
                                                        <p className="text-xs font-bold text-[#2DD4BF] uppercase tracking-widest mb-1">
                                                            {t.timesModalTitle}
                                                        </p>
                                                        <h3 className="text-xl font-serif capitalize">
                                                            {format(selectedDate, 'EEEE d MMMM', { locale })}
                                                        </h3>
                                                    </div>
                                                    <button
                                                        onClick={() => setIsTimePickerOpen(false)}
                                                        className="p-2 hover:bg-white/10 rounded-full transition"
                                                        aria-label={t.closeAria}
                                                    >
                                                        <CloseIcon />
                                                    </button>
                                                </div>

                                                <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6">
                                                    {morningSlots.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                                <SunIcon /> {t.morning}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {morningSlots.map((time) => (
                                                                    <button
                                                                        key={time}
                                                                        onClick={() => {
                                                                            setSelectedTime(time)
                                                                            setIsTimePickerOpen(false)
                                                                        }}
                                                                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-200
                      ${selectedTime === time
                                                                                ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#13221E] shadow-md'
                                                                                : 'bg-white border-gray-200 text-gray-600 hover:border-[#25413A] hover:text-[#25413A]'
                                                                            }`}
                                                                    >
                                                                        {getSlotLabel(time)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {afternoonSlots.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                                <MoonIcon /> {t.afternoon}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {afternoonSlots.map((time) => (
                                                                    <button
                                                                        key={time}
                                                                        onClick={() => {
                                                                            setSelectedTime(time)
                                                                            setIsTimePickerOpen(false)
                                                                        }}
                                                                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-200
                      ${selectedTime === time
                                                                                ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#13221E] shadow-md'
                                                                                : 'bg-white border-gray-200 text-gray-600 hover:border-[#25413A] hover:text-[#25413A]'
                                                                            }`}
                                                                    >
                                                                        {getSlotLabel(time)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4 border-t border-gray-100 flex justify-end">
                                                    <button
                                                        onClick={() => setIsTimePickerOpen(false)}
                                                        className="px-6 py-2 text-gray-500 hover:text-gray-800 font-medium text-sm"
                                                    >
                                                        {t.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ✅ DESKTOP/TABLET: igual */}
                                <div className="hidden md:block">
                                    <div className="space-y-6">
                                        {morningSlots.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    <SunIcon /> {t.morning}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {morningSlots.map((time) => (
                                                        <button
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all duration-200 ${selectedTime === time
                                                                ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#13221E] shadow-md scale-105'
                                                                : 'bg-white border-gray-200 text-gray-600 hover:border-[#25413A] hover:text-[#25413A]'
                                                                }`}
                                                        >
                                                            {getSlotLabel(time)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {afternoonSlots.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    <MoonIcon /> {t.afternoon}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {afternoonSlots.map((time) => (
                                                        <button
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all duration-200 ${selectedTime === time
                                                                ? 'bg-[#2DD4BF] border-[#2DD4BF] text-[#13221E] shadow-md scale-105'
                                                                : 'bg-white border-gray-200 text-gray-600 hover:border-[#25413A] hover:text-[#25413A]'
                                                                }`}
                                                        >
                                                            {getSlotLabel(time)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400 text-sm italic p-4 bg-gray-100 rounded-lg text-center">
                                {t.noSlots}
                            </p>
                        )}

                    </div>

                    {/* RESUMEN */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#D4B886]"></div>
                        <h3 className="text-[#25413A] font-serif text-xl mb-6">{t.investmentDetail}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">{t.selectedService}</span>
                                <span className="font-bold text-[#25413A]">{serviceCopy.title}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <p className="text-[#25413A] font-bold text-lg">{t.depositTitle}</p>
                                    <p className="text-xs text-[#2DD4BF] font-medium mt-1">{t.depositNote}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-serif text-[#25413A] font-bold">${depositAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTÓN FLOTANTE */}
                    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:static md:bg-transparent md:border-0 md:p-0 z-50">
                        <button onClick={handleDirectBooking} disabled={!selectedTime || isLoadingSlots || isSubmitting} className={`w-full py-4 md:py-5 rounded-xl text-lg font-bold text-white transition-all transform duration-300 shadow-2xl flex items-center justify-center gap-3 ${selectedTime ? 'bg-[#25413A] hover:bg-[#1a2e29] hover:-translate-y-1 hover:shadow-[#25413A]/40' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}>
                            {isSubmitting
                                ? t.redirecting
                                : selectedTime
                                    ? <><span>{t.goPayDeposit}</span><span className="bg-white/20 px-2 py-0.5 rounded text-sm font-normal">${depositAmount.toFixed(2)}</span></>
                                    : t.pickTime}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-wider font-medium flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg> {t.ssl}
                    </p>
                </div>
            </div>

            {/* MODAL CALENDARIO */}
            {isCalendarModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#25413A] p-6 flex justify-between items-center text-white">
                            <div>
                                <p className="text-xs font-bold text-[#2DD4BF] uppercase tracking-widest mb-1">{t.calendarSelectDate}</p>
                                <h3 className="text-2xl font-serif capitalize">{format(currentMonth, 'MMMM yyyy', { locale })}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeftIcon /></button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronRightIcon /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-7 mb-4 text-center">
                                {t.weekdays.map(d => <div key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                                {daysInMonth.map((day, i) => {
                                    const isSelected = isSameDay(day, selectedDate); const isPast = isBefore(day, startOfToday()); const isTodayDate = isToday(day);
                                    return (
                                        <button key={i} disabled={isPast} onClick={() => { setSelectedDate(day); setSelectedTime(null); setIsCalendarModalOpen(false) }} className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-[#25413A] text-[#D4B886] font-bold shadow-lg scale-110' : ''} ${!isSelected && !isPast ? 'hover:bg-[#2DD4BF]/20 hover:text-[#25413A] text-gray-700' : ''} ${isPast ? 'text-gray-300 cursor-not-allowed' : ''} ${isTodayDate && !isSelected ? 'border border-[#2DD4BF] text-[#2DD4BF]' : ''}`}>{format(day, 'd')}</button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setIsCalendarModalOpen(false)} className="px-6 py-2 text-gray-500 hover:text-gray-800 font-medium text-sm">
                                {t.cancel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
    // (El código que tenías antes en tu export default function BookingPage va aquí)
}




// --- ICONOS ---
const CheckIcon = () => <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
const ClockIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const ShieldIcon = () => <svg className="w-5 h-5 text-[#D4B886]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const ChevronDownIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
const ChevronLeftIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
const ChevronRightIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
const SunIcon = () => <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
const MoonIcon = () => <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

export default function BookingPage() {
    return (
        // 👇 Envuelves el contenido en Suspense
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        }>
            <BookingContent />
        </Suspense>
    )
}
