import bookingForm from '../fixtures/bookingForm.json'

// Función para generar fechas futuras con timestamp para garantizar unicidad
const generateUniqueDates = (nights = 1) => {
  const today = new Date()
  const timestamp = Date.now()
  const daysOffset = Math.floor((timestamp % 100) + 10) // 10-110 días después

  const checkin = new Date(today)
  checkin.setDate(today.getDate() + daysOffset)

  const checkout = new Date(checkin)
  checkout.setDate(checkin.getDate() + nights)

  return {
    checkin: checkin.toISOString().split('T')[0],
    checkout: checkout.toISOString().split('T')[0]
  }
}

describe('Módulo 3.2 - Validación de Formulario de Reserva (Casos Negativos)', () => {
  beforeEach(() => {
    cy.openHomePage()
  })

  // FR-1.0: Campos obligatorios vacíos
  describe('FR-1.0 - [Negativo] Campos obligatorios vacíos', () => {
    it('Debe mostrar mensajes de error indicando que los campos son obligatorios o requeridos', () => {
      const dates = generateUniqueDates(1)

      cy.searchAvailability(dates.checkin, dates.checkout)
      cy.selectRoom('Double')

      // Rellenar formulario con datos completamente vacíos usando selectores directos
      cy.get('input[name="firstname"]', { timeout: 10000 }).clear()
      cy.get('input[name="lastname"]').clear()
      cy.get('input[name="email"]').clear()
      cy.get('input[name="phone"]').clear()

      cy.submitBooking()

      cy.contains('Firstname should not be blank', { timeout: 5000 }).should('be.visible')
      cy.contains('size must be between 3 and 18').should('be.visible')
      cy.contains('Lastname should not be blank').should('be.visible')
      cy.contains('size must be between 3 and 30').should('be.visible')
      cy.contains('must not be empty').should('be.visible')
      cy.contains('size must be between 11 and 21').should('be.visible')

      cy.contains('Booking Confirmed').should('not.exist')
    })
  })

  // FR-2.0: Formulario de reserva sin completar Firstname
  describe('FR-2.0 - [Negativo] Formulario de reserva sin completar Firstname', () => {
    it('Debe mostrar error de Firstname vacío y validación de tamaño', () => {
      const dates = generateUniqueDates(1)

      cy.searchAvailability(dates.checkin, dates.checkout)
      cy.selectRoom('Double')

      // Firstname vacío — se maneja con selector directo; el resto con fillBookingForm parcial
      cy.get('input[name="firstname"]', { timeout: 10000 }).clear()
      cy.get('input[name="lastname"]').clear().type(bookingForm.validBooking.lastname)
      cy.get('input[name="email"]').clear().type(bookingForm.validBooking.email)
      cy.get('input[name="phone"]').clear().type(bookingForm.validBooking.phone)

      cy.submitBooking()

      cy.contains('Firstname should not be blank', { timeout: 5000 }).should('be.visible')
      cy.contains('size must be between 3 and 18').should('be.visible')

      cy.contains('Booking Confirmed').should('not.exist')
    })
  })

  // FR-3.0: Formulario de reserva sin completar Lastname
  describe('FR-3.0 - [Negativo] Formulario de reserva sin completar Lastname', () => {
    it('Debe mostrar error de Lastname vacío y validación de tamaño', () => {
      const dates = generateUniqueDates(1)

      cy.searchAvailability(dates.checkin, dates.checkout)
      cy.selectRoom('Double')

      cy.get('input[name="firstname"]', { timeout: 10000 }).clear().type(bookingForm.validBooking.firstname)
      cy.get('input[name="lastname"]').clear()
      cy.get('input[name="email"]').clear().type(bookingForm.validBooking.email)
      cy.get('input[name="phone"]').clear().type(bookingForm.validBooking.phone)

      cy.submitBooking()

      cy.contains('Lastname should not be blank', { timeout: 5000 }).should('be.visible')
      cy.contains('size must be between 3 and 30').should('be.visible')

      cy.contains('Booking Confirmed').should('not.exist')
    })
  })

  // FR-4.0 & FR-5.0: Formulario de reserva sin completar Phone
  describe('FR-4.0 & FR-5.0 - [Negativo] Formulario de reserva sin completar Phone', () => {
    it('Debe mostrar error de Phone vacío y validación de longitud', () => {
      const dates = generateUniqueDates(1)

      cy.searchAvailability(dates.checkin, dates.checkout)
      cy.selectRoom('Double')

      cy.get('input[name="firstname"]', { timeout: 10000 }).clear().type(bookingForm.validBooking.firstname)
      cy.get('input[name="lastname"]').clear().type(bookingForm.validBooking.lastname)
      cy.get('input[name="email"]').clear().type(bookingForm.validBooking.email)
      cy.get('input[name="phone"]').clear()

      cy.submitBooking()

      cy.contains('must not be empty', { timeout: 5000 }).should('be.visible')
      cy.contains('size must be between 11 and 21').should('be.visible')

      cy.contains('Booking Confirmed').should('not.exist')
    })
  })

  // FR-6.0: Formulario de reserva sin completar Email
  describe('FR-6.0 - [Negativo] Formulario de reserva sin completar Email', () => {
    it('Debe mostrar error de Email vacío', () => {
      const dates = generateUniqueDates(1)

      cy.searchAvailability(dates.checkin, dates.checkout)
      cy.selectRoom('Double')

      cy.get('input[name="firstname"]', { timeout: 10000 }).clear().type(bookingForm.validBooking.firstname)
      cy.get('input[name="lastname"]').clear().type(bookingForm.validBooking.lastname)
      cy.get('input[name="email"]').clear()
      cy.get('input[name="phone"]').clear().type(bookingForm.validBooking.phone)

      cy.submitBooking()

      cy.contains('must not be empty', { timeout: 5000 }).should('be.visible')

      cy.contains('Booking Confirmed').should('not.exist')
    })
  })
})