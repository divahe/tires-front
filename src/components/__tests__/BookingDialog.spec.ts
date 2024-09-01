import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { fireEvent } from '@testing-library/vue'
import BookingDialog from '@/components/BookingDialog.vue'
import { createTestingPinia } from '@pinia/testing'
import { createApp } from 'vue'
import { setActivePinia } from 'pinia'
import { useBookingStore } from '@/stores/bookingStore'
import dayjs from 'dayjs'

const item = {
  uuid: crypto.randomUUID(),
  identifier: '',
  id: 47,
  available: true,
  time: dayjs(),
  timeString: '2024-09-03 11:00',
  name: 'London',
  address: '1A Gunton Rd, London',
  carTypes: 'car'
}

const app = createApp({})

const pinia = createTestingPinia({
  createSpy: vi.fn,
  initialState: {
    dialog: { selectedItem: item }
  }
})
app.use(pinia)
setActivePinia(pinia)

const bookingDialog = mount(BookingDialog, {
  global: {
    plugins: [pinia]
  }
})

describe('BookingDialog component', () => {
  it('renders booking details in the form', async () => {
    const bookingStore = useBookingStore()
    bookingStore.$state.selectedItem = item
    expect(bookingDialog.text()).toContain(bookingStore.selectedItem?.timeString)
    expect(bookingDialog.text()).toContain(bookingStore.selectedItem?.address)
    expect(bookingDialog.text()).toContain(bookingStore.selectedItem?.carTypes)
  })

  it('submits form to the bookingStore', async () => {
    const bookingStore = useBookingStore()
    bookingStore.$state.selectedItem = item
    const submitButton = bookingDialog.get('[data-test="submit"]')
    expect(submitButton.text()).toBe('SUBMIT')
    await fireEvent.click(submitButton.element)
    expect(bookingStore.bookingRequestFromSelected).toHaveBeenCalledTimes(1)
    expect(bookingStore.closeDialog).toHaveBeenCalledTimes(1)
  })
})
