/*
  Warnings:

  - A unique constraint covering the columns `[stripe_session_id]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "stripe_notified_at" TIMESTAMP(3),
ADD COLUMN     "stripe_payment_intent_id" TEXT,
ADD COLUMN     "stripe_session_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_stripe_session_id_key" ON "bookings"("stripe_session_id");
