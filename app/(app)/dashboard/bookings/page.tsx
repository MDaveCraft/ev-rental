import { listAvailableVehicles, listMyBookings } from "@/lib/actions/bookings"
import { requireUser } from "@/lib/auth-helpers"
import { BookingsWizard } from "./bookings-wizard"

export default async function BookingsPage() {
  const session = await requireUser()
  const [vehicles, myBookings] = await Promise.all([listAvailableVehicles(), listMyBookings()])

  return <BookingsWizard vehicles={vehicles} myBookings={myBookings} userName={session.user.name} />
}
