import bookingData from '../fixtures/guestReservation.json'

describe('Módulo 3.1 - Reserva exitosa como usuario invitado', () => {
  beforeEach(() => {
    cy.openHomePage()
  })

  describe('Requerimiento 3.1 - Reserva exitosa', () => {

   // Función para generar fechas futuras con timestamp para garantizar unicidad
const generateUniqueDates = (nights = 1) => {
  const today = new Date()
  
  // Usar timestamp como offset para garantizar fechas únicas
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

    it('R-1.0: Reserva exitosa habitación 1 noche', () => {
      // Generar fechas dinámicas para la reserva
      const dates = generateUniqueDates(1)
      const dynamicData = {
        ...bookingData,
        checkin: dates.checkin,
        checkout: dates.checkout,
        expectedTotal: 190
      }

    
      // 1. Buscar disponibilidad desde la Home
      cy.searchAvailability(dynamicData.checkin, dynamicData.checkout)

      // 2. Seleccionar habitación (las fechas ya están precargadas)
      cy.selectRoom('Double')

      // 3. Completar formulario
      cy.fillBookingForm(dynamicData)

      // 4. Confirmar reserva
      cy.submitBooking()

      // 5. Verificar confirmación
      cy.verifyBookingConfirmation()
      cy.verifyTotalNotVisible(dynamicData.expectedTotal)
    })

    it('R-2.0: Reserva exitosa habitación 3 noches', () => {
      const dates = generateUniqueDates(3)
      const dynamicData = {
        ...bookingData,
        checkin: dates.checkin,
        checkout: dates.checkout,
        expectedTotal: 490
      }

      cy.log(`Fechas: ${dynamicData.checkin} - ${dynamicData.checkout}`)

      cy.searchAvailability(dynamicData.checkin, dynamicData.checkout)
      cy.selectRoom('Double')
      cy.fillBookingForm(dynamicData)
      cy.submitBooking()
      cy.verifyBookingConfirmation()
      cy.verifyTotalNotVisible(dynamicData.expectedTotal)
    })
  })
})