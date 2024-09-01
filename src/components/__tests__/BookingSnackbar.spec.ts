import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BookingSnackbar from '@/components/BookingSnackbar.vue'
import { createTestingPinia } from '@pinia/testing'
import { createApp } from 'vue'
import { setActivePinia } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbarStore'
import type { SnackbarState } from '@/model/index'

const successState: SnackbarState = {
  show: false,
  time: '2024-09-03 11:00',
  name: 'London',
  address: '1A Gunton Rd, London',
  id: 'd076dc14-c4a9-489c-b813-8bafbfc24a51',
  info: 'Booking confirmed',
  type: 'success'
}

const app = createApp({})

const pinia = createTestingPinia({
  createSpy: vi.fn,
  initialState: {
    snackbar: { bookingSnackbar: successState }
  }
})
app.use(pinia)
setActivePinia(pinia)

const snackbar = mount(BookingSnackbar, {
  global: {
    plugins: [pinia]
  }
})

describe('BookingSnackbar component', () => {
  it('renders confirmed booking details', async () => {
    const snackbarStore = useSnackbarStore()
    snackbarStore.$state.bookingSnackbar = successState
    expect(snackbar.text()).toContain(snackbarStore.bookingSnackbar?.info)
    expect(snackbar.text()).toContain(snackbarStore.bookingSnackbar?.address)
    expect(snackbar.text()).toContain(snackbarStore.bookingSnackbar?.id)
    expect(snackbar.text()).toContain(snackbarStore.bookingSnackbar?.time)
  })
})
