'use client'

import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState, useEffect, useCallback, useMemo } from 'react'
interface DateHeaderProps {
  date: Date
  label: string
}

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export type EventStatus = 'confirmed_stripe' | 'confirmed_trust' | 'pending' | 'paid_full'

export interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  resource?: {
    status: EventStatus
    clientName?: string
    clientPhone?: string
    amountPaid: number
    amountPending: number
    notes?: string
  }
}

interface AdminCalendarProps {
  events: CalendarEvent[]
  onAddEvent: (slotInfo: { start: Date; end: Date }) => void
  onEventClick: (event: CalendarEvent) => void
}

export default function AdminCalendar({ events, onAddEvent, onEventClick }: AdminCalendarProps) {
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<View>(Views.MONTH)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)   // 👈 NUEVO
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDate = window.localStorage.getItem('adminCalendarDate')
      const storedView = window.localStorage.getItem('adminCalendarView') as View | null

      if (storedDate) {
        const parsed = new Date(storedDate)
        if (!Number.isNaN(parsed.getTime())) {
          setDate(parsed)
        }
      }

      if (storedView && Object.values(Views).includes(storedView as View)) {
        setView(storedView as View)
      }
    }

    setMounted(true)
  }, [])


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView(Views.DAY)
        setIsMobile(true)           // 👈 aquí
      } else {
        setView(Views.MONTH)
        setIsMobile(false)          // 👈 aquí
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adminCalendarDate', newDate.toISOString())
    }
  }, [])

  const onView = useCallback((newView: View) => {
    setView(newView)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adminCalendarView', newView)
    }
  }, [])


  const CustomDateHeader = ({ date: headerDate, label }: DateHeaderProps) => {
    const dayEvents = events.filter(
      (e) =>
        e.start.getDate() === headerDate.getDate() &&
        e.start.getMonth() === headerDate.getMonth() &&
        e.start.getFullYear() === headerDate.getFullYear()
    )

    const total = dayEvents.length

    // --- 1) Colores por status ---
    const getColor = (status?: EventStatus): string => {
      switch (status) {
        case 'paid_full':
          return '#059669' // verde
        case 'confirmed_stripe':
          return '#F59E0B' // naranja
        case 'confirmed_trust':
          return '#0EA5E9' // celeste
        case 'pending':
          return '#F97373' // rojo
        default:
          return '#0EA5E9'
      }
    }

    const hasPending = dayEvents.some((e) => e.resource?.status === 'pending')
    const hasStripe = dayEvents.some((e) => e.resource?.status === 'confirmed_stripe')
    const hasTrust = dayEvents.some((e) => e.resource?.status === 'confirmed_trust')
    const hasPaidFull = dayEvents.some((e) => e.resource?.status === 'paid_full')

    // --- 2) Color del círculo de contador (debajo) ---
    let summaryColor = 'bg-sky-500'
    if (hasPending) summaryColor = 'bg-rose-500'
    else if (hasStripe) summaryColor = 'bg-amber-500'
    else if (hasPaidFull) summaryColor = 'bg-emerald-600'
    else if (hasTrust) summaryColor = 'bg-sky-500'

    // --- 3) Círculos apilados y comprimidos ---
    const MAX_STACKED = 8
    const visibleEvents = dayEvents.slice(0, MAX_STACKED)
    const visibleCount = visibleEvents.length

    const maxSpreadPx = 18
    const step = visibleCount > 1 ? maxSpreadPx / (visibleCount - 1) : 0

    // Día sin citas: solo el label
    if (total === 0) {
      return (
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="font-medium text-[11px] text-slate-600">{label}</span>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center gap-1 w-full">
        <span className="font-medium text-[11px] text-slate-600">{label}</span>

        <div className="flex flex-col items-center gap-1">
          {/* Círculos apilados (uno por cita) */}
          <div className="relative h-4 w-10 overflow-hidden">
            {visibleEvents.map((ev, idx) => (
              <span
                key={`${ev.id}-${idx}`}
                className="absolute inline-flex h-3 w-3 rounded-full border-2 border-white shadow-sm"
                style={{
                  left: `${idx * step}px`,
                  backgroundColor: getColor(ev.resource?.status),
                }}
              />
            ))}
          </div>

          {/* Círculo con total de citas del día */}
          <div
            className={[
              'inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-sm',
              summaryColor,
            ].join(' ')}
          >
            {total}
          </div>
        </div>
      </div>
    )
  }



  // 👇 useMemo SIEMPRE se llama, antes del return condicional
  const { components, eventPropGetter } = useMemo(
    () => ({
      components: {
        month: { dateHeader: CustomDateHeader },
      },
      eventPropGetter: (event: CalendarEvent) => {
        if (view === Views.MONTH) return { style: { display: 'none' } }

        let backgroundColor = '#E5F0FF'
        let borderLeft = '4px solid #1D4ED8'
        let borderColor = '#BFDBFE'
        let color = '#0F172A'

        switch (event.resource?.status) {
          case 'paid_full':
            backgroundColor = '#E6FFFA'
            borderLeft = '4px solid #2C7A7B'
            borderColor = '#2C7A7B'
            color = '#134E4A'
            break

          case 'confirmed_stripe':
            backgroundColor = '#FDFDEA'
            borderLeft = '4px solid #D69E2E'
            borderColor = '#D69E2E'
            color = '#92400E'
            break

          case 'confirmed_trust':
            backgroundColor = '#EBF8FF'
            borderLeft = '4px solid #63B3ED'
            borderColor = '#63B3ED'
            color = '#1A365D'
            break

          case 'pending':
            backgroundColor = '#FFF5F5'
            borderLeft = '4px solid #F56565'
            borderColor = '#F56565'
            color = '#C53030'
            break
        }

        return {
          style: {
            backgroundColor,
            borderLeft,
            borderRight: `1px solid ${borderColor}`,
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            color,
            borderRadius: '8px',
            opacity: 1,
            display: 'block',
            fontSize: '0.8rem',
            lineHeight: '1.25',
            padding: '4px 6px',
            overflow: 'hidden',
            zIndex: 10,
            fontWeight: 500,
            boxShadow: '0 4px 8px rgba(15,23,42,0.10)',
          },
        }
      },
    }),
    [view, events]
  )

  // 👇 el skeleton va DESPUÉS de todos los hooks
  if (!mounted) {
    return (
      <div className="h-[700px] bg-white/90 p-4 md:p-5 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.10)] border border-slate-100 animate-pulse" />
    )
  }

  return (
    <div className="h-[700px] bg-white/90 p-4 md:p-5 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.10)] border border-slate-100">
      <style jsx global>{`
        .rbc-calendar {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        }
        .rbc-current-time-indicator {
          display: none !important;
        }
        .rbc-toolbar {
          margin-bottom: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .rbc-toolbar-label {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .rbc-header {
          padding: 10px 0;
          font-weight: 600;
          color: #475569;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .rbc-today {
          background-color: #ecfdf3;
        }

        .rbc-time-view,
        .rbc-month-view {
          border: none;
        }

        .rbc-time-header,
        .rbc-row {
          border-color: #e5e7eb;
        }

        .rbc-time-content {
          border-top: 1px solid #e5e7eb;
        }

        .rbc-event {
          min-height: 22px !important;
          padding: 0 !important;
          box-sizing: border-box;
        }

        .rbc-event-label {
          display: none !important;
        }

        .rbc-event-content {
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid #f3f4f6;
          position: relative;
        }

        .rbc-time-gutter .rbc-time-slot {
          color: #9ca3af;
          font-size: 0.7rem;
        }

        .rbc-time-view .rbc-header {
          border-bottom: 2px solid #e5e7eb;
        }

        .rbc-day-slot .rbc-events-container {
          margin-right: 0px !important;
        }

        /* Hover para crear cita */
        .rbc-day-slot .rbc-time-slot:hover::after {
          content: '+ Cita';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #0f766e;
          font-size: 0.7rem;
          font-weight: 500;
          opacity: 0.55;
          padding: 2px 8px;
          border-radius: 9999px;
          background: rgba(240, 253, 250, 0.9);
          border: 1px dashed rgba(16, 185, 129, 0.6);
          pointer-events: none;
        }

        .rbc-day-slot .rbc-time-slot:hover {
          background-color: #f0fdfa;
          cursor: pointer;
          transition: background 0.15s ease-out;
        }

        .rbc-toolbar button {
          border: 1px solid #e5e7eb;
          padding: 6px 12px;
          font-size: 0.8rem;
          color: #4b5563;
          border-radius: 9999px;
          background-color: #ffffff;
          font-weight: 500;
          transition: all 0.15s ease-out;
        }

        .rbc-toolbar button:hover {
          background-color: #f9fafb;
          color: #111827;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .rbc-toolbar .rbc-btn-group button.rbc-active {
          background-color: #0f766e !important;
          color: #ffffff !important;
          border-color: #0f766e !important;
          box-shadow: 0 3px 10px rgba(16, 185, 129, 0.35);
        }
           .rbc-show-more {
    display: none !important;
  }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={onNavigate}
        view={view}
        onView={onView}
        startAccessor="start"
        endAccessor="end"
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 21, 0, 0)}
        components={components}
        eventPropGetter={eventPropGetter}
        selectable={view === Views.MONTH ? false : 'ignoreEvents'} // 👈 solo seleccionable en week/day
        onSelectSlot={(slotInfo) => {
          // En Month no hacemos nada aquí, solo se usa el header (onDrillDown)
          if (view !== Views.MONTH) {
            onAddEvent(slotInfo) // crea cita manual en week/day
          }
        }}
        onSelectEvent={(event) => onEventClick(event)}
        views={['month', 'week', 'day']}
        messages={{
          next: 'Sig >',
          previous: '< Ant',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          showMore: (total) => `+${total} más`,
        }}
      />

    </div>
  )
}
