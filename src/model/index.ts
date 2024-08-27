import type { UUID } from "crypto"
import type { Dayjs } from "dayjs"

export interface Mastery {
  name: string
  carTypes: string[]
  address: string
}

export interface Booking {
  uuid: UUID
  identifier: string
  id: number
  available: boolean
  mastery: Mastery
  time: Date
}
export interface FlatBooking {
  uuid: UUID
  identifier: string
  id: number
  available: boolean
  time: Dayjs
  timeString: string
  name: string
  address: string
  carTypes: string
}

export interface BookingListResponse {
  bookings: Booking[]
  errors: { [key: string]: string };
}

export interface BookingResponse {
  info: string
  mastery: Mastery
  id: string
  time: Dayjs
}

export interface SlotProps {
  value: any;
}

export interface BookingRequest {
  name: string | null
  identifier: string | null
  id: string | null
  inputs: Record<string, string>;
}

export interface SnackbarInfo {
  time: string,
  name: string,
  address: string
  id: string
  info: string
  type: string
}

export interface SnackbarState {
  show: boolean,
  time: string,
  name: string,
  address: string
  id: string
  info: string
  type: string
}

export interface Errors {
  [key: string]: string;
}
