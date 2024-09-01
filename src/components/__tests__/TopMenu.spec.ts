import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { screen } from '@testing-library/vue'
import TopMenu from '../TopMenu.vue'
import { createTestingPinia } from '@pinia/testing'

const topMenu = mount(TopMenu, {
  global: {
    plugins: [
      createTestingPinia({
        createSpy: vi.fn
      })
    ]
  }
})

describe('TopMenu component', () => {
  it('renders an app name', async () => {
    expect(topMenu.text()).toContain('Tire Change Booking App')
  })
  it('renders a tire image', () => {
    const icon = screen.findByAltText("tire-icon")
    expect(icon).not.toBe(null);
  })
  it('renders a data update button', () => {
    const button = screen.findByAltText('reload')
    expect(button).not.toBe(null);
  })
})
