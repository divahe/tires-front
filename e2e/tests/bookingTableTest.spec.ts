import { test, expect } from '@playwright/test'
import dayjs, { type Dayjs } from 'dayjs'

test('top menu is present and 10 bookings are loaded', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  await expect(page.getByText('Tire Change Booking App')).toBeVisible()
  await expect(page.locator("//i[@role='button']")).toHaveCount(10)
})

test('list items can be filtered by start date', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const weekDay = getClosestWeekday(dayjs())
  const futureDate = getClosestWeekday(dayjs(weekDay).add(3, 'day'))
  const inputDate = dayjs(futureDate).format('YYYY-MM-DD')
  const outputFormat = dayjs(futureDate).format('YYYY-MM-DD')
  await page.getByPlaceholder('Start').fill(inputDate)
  await page.waitForLoadState()
  expect((await page.getByRole('cell', { name: outputFormat }).count()) >= 10).toBeTruthy()
})

test('list items can be filtered by car type', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const nameInput = page.getByPlaceholder('Car Types')
  await nameInput.fill('truck')
  expect((await page.getByRole('cell', { name: 'truck' }).count()) >= 10).toBeTruthy()
  await nameInput.clear()
  await expect(page.locator("//i[@role='button']")).toHaveCount(10)
})

test('list items can be filtered by end date', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const weekDay = getClosestWeekday(dayjs())
  const pastDate = getClosestWeekday(dayjs(weekDay).subtract(3, 'day'))
  const inputDate = dayjs(pastDate).format('YYYY-MM-DD')
  await page.getByPlaceholder('End').fill(inputDate)
  await page.waitForLoadState()
  await expect(page.getByText('No data available')).toBeVisible()
})

test('start date search filter can be removed', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const weekDay = getClosestWeekday(dayjs())
  const futureDate = getClosestWeekday(dayjs(weekDay).add(5, 'day'))
  const inputDate = dayjs(futureDate).format('YYYY-MM-DD')
  const outputFormat = dayjs(futureDate).format('YYYY-MM-DD')
  await page.getByPlaceholder('Start').fill(inputDate)
  await page.waitForLoadState()
  expect((await page.getByRole('cell', { name: outputFormat }).count()) >= 10).toBeTruthy()
  await page.getByPlaceholder('Start').clear()
  expect((await page.getByRole('cell', { name: outputFormat }).count()) >= 10).toBeFalsy()
})

test('end date search filter can be removed', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const today = new Date()
  const futureDate = dayjs(today).subtract(3, 'day')
  const inputDate = dayjs(futureDate).format('YYYY-MM-DD')
  await page.getByPlaceholder('End').fill(inputDate)
  await page.waitForLoadState()
  await expect(page.getByText('No data available')).toBeVisible()
  await page.getByPlaceholder('End').clear()
  expect((await page.locator("//i[@role='button']").count()) >= 10).toBeTruthy()
})

test('booking can be confirmed', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const calendar = page.locator('//td/i[contains(@class, mdi-calendar-multiselect)]').nth(0)
  await calendar.click()
  await expect(page.getByText('Submit booking')).toBeVisible()
  const userInput = page.getByLabel('Enter your contact details')
  await userInput.fill('Diana')
  const submitButton = page.getByRole('button', { name: 'Submit' })
  await submitButton.click()
  const popup = page.locator('div').filter({ hasText: 'Info: Booking confirmed' }).nth(2)
  await popup.waitFor()
  await expect(popup).toBeVisible()
  await popup.click()
  await expect(popup).toBeHidden()
})

test('booking is rejected if no user input', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const calendar = page.locator('//td/i[contains(@class, mdi-calendar-multiselect)]').nth(0)
  await calendar.click()
  await expect(page.getByText('Submit booking')).toBeVisible()
  const submitButton = page.getByRole('button', { name: 'Submit' })
  await submitButton.click()
  const popup = page
    .locator('div')
    .filter({ hasText: "Info: Field validation for 'ContactInformation' failed" })
    .nth(2)
  await popup.waitFor()
  await expect(popup).toBeVisible()
  await popup.click()
  await expect(popup).toBeHidden()
})

test('booking form can be closed without confirming', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.locator('//table').waitFor()
  const calendar = page.locator('//td/i[contains(@class, mdi-calendar-multiselect)]').nth(0)
  await calendar.click()
  await expect(page.getByText('Submit booking')).toBeVisible()
  const discardButton = page.getByRole('button', { name: 'Discard' })
  await discardButton.click()
  await expect(discardButton).toBeHidden()
})

const getClosestWeekday = (date: Dayjs) => {
  const dayOfWeek = date.day()
  if (dayOfWeek >= 1 && dayOfWeek <= 5) return date
  if (dayOfWeek === 6) return date.add(2, 'day')
  if (dayOfWeek === 0) return date.add(1, 'day')
}
