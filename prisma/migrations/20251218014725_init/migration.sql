-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "service_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "amount_total" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "amount_pending" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "google_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);
