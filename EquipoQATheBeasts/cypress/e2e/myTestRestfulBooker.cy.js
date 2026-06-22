import bookingData from '../fixtures/guestReservation.json'

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

describe('Módulo 3.1 - Reserva exitosa como usuario invitado', () => {
  beforeEach(() => {
    cy.openHomePage()
  })

   // REQUERIMIENTO 3.1 - Reserva exitosa
  
  describe('Requerimiento 3.1 - Reserva exitosa', () => {

    it('R-1.0: Reserva exitosa habitación 1 noche', () => {
      // Generar fechas únicas para evitar conflictos con reservas anteriores
      const dates = generateUniqueDates(1)
      const dynamicData = {
        ...bookingData,
        checkin: dates.checkin,
        checkout: dates.checkout,
        expectedTotal: 190
      }
      //  verificar las fechas generadas
      cy.searchAvailability(dynamicData.checkin, dynamicData.checkout)
      // Seleccionar habitación, completar formulario, enviar y verificar confirmación
      cy.selectRoom('Double')
      cy.fillBookingForm(dynamicData)
      cy.submitBooking()
      cy.verifyBookingConfirmation()
      cy.verifyTotalNotVisible(dynamicData.expectedTotal)
    })

    it('R-2.0: Reserva exitosa habitación 3 noches', () => {
      // Generar fechas únicas para evitar conflictos con reservas anteriores
      const dates = generateUniqueDates(3)
      const dynamicData = {
        ...bookingData,
        checkin: dates.checkin,
        checkout: dates.checkout,
        expectedTotal: 490
      }

      cy.log(`Fechas: ${dynamicData.checkin} - ${dynamicData.checkout}`)
      // Buscar disponibilidad, seleccionar habitación, completar formulario, enviar y verificar confirmación
      cy.searchAvailability(dynamicData.checkin, dynamicData.checkout)
      cy.selectRoom('Double')
      cy.fillBookingForm(dynamicData)
      cy.submitBooking()
      cy.verifyBookingConfirmation()
      cy.verifyTotalNotVisible(dynamicData.expectedTotal)
    })
  })

  
  // VALIDACIONES DEL FORMULARIO (Casos Negativos)
 
  describe('Validaciones del formulario - Casos Negativos', () => {
    
    // R-3.0: Email inválido (sin @)
    
    it('R-3.0: Email inválido (sin @) - debe mostrar error', () => {
      const dates = generateUniqueDates(1)
      const testData = {
        ...bookingData,
        checkin: dates.checkin,
        checkout: dates.checkout
      }

      // Buscar disponibilidad y seleccionar habitación
      cy.searchAvailability(testData.checkin, testData.checkout)
      cy.selectRoom('Double')

      // Completar formulario CON EMAIL INVÁLIDO
      cy.get('input[name="firstname"]', { timeout: 10000 })
        .clear()
        .type(testData.firstname)
      cy.get('input[name="lastname"]')
        .clear()
        .type(testData.lastname)
      cy.get('input[name="email"]')
        .clear()
        .type('maria.gmail.com') // Email sin @
      cy.get('input[name="phone"]')
        .clear()
        .type(testData.phone)

      // Intentar enviar
      cy.get('button:contains("Reserve Now")', { timeout: 10000 })
        .should('be.visible')
        .click()

      // Verificar mensaje de error
      cy.contains('must be a well-formed email address', { timeout: 5000 })
        .should('be.visible')

      // Verificar que NO hay confirmación
      cy.contains('Booking Confirmed').should('not.exist')
    })

    // R-4.0: Campos obligatorios vacíos
   
    it('R-4.0: Campos obligatorios vacíos - debe mostrar errores', () => {
      const dates = generateUniqueDates(1)
      const testData = {
        ...bookingData,
        checkin: dates.checkin,
        checkout: dates.checkout
      }

      // Buscar disponibilidad y seleccionar habitación
      cy.searchAvailability(testData.checkin, testData.checkout)
      cy.selectRoom('Double')

      // PRUEBA 1: Firstname vacío
      
      cy.log('🔍 Probando Firstname vacío')

      cy.get('input[name="firstname"]', { timeout: 10000 })
        .clear() // Dejar vacío
      cy.get('input[name="lastname"]')
        .clear()
        .type(testData.lastname)
      cy.get('input[name="email"]')
        .clear()
        .type(testData.email)
      cy.get('input[name="phone"]')
        .clear()
        .type(testData.phone)

      cy.get('button:contains("Reserve Now")')
        .should('be.visible')
        .click()

      cy.contains('Firstname should not be blank', { timeout: 5000 })
        .should('be.visible')

   
      // PRUEBA 2: Lastname vacío
     
      cy.log('🔍 Probando Lastname vacío')

      cy.get('input[name="firstname"]')
        .clear()
        .type(testData.firstname)
      cy.get('input[name="lastname"]')
        .clear() // Dejar vacío
      cy.get('input[name="email"]')
        .clear()
        .type(testData.email)
      cy.get('input[name="phone"]')
        .clear()
        .type(testData.phone)

      cy.get('button:contains("Reserve Now")')
        .should('be.visible')
        .click()

      cy.contains('Lastname should not be blank', { timeout: 5000 })
        .should('be.visible')

     
      // PRUEBA 3: Phone vacío
   
      cy.log('🔍 Probando Phone vacío')

      cy.get('input[name="firstname"]')
        .clear()
        .type(testData.firstname)
      cy.get('input[name="lastname"]')
        .clear()
        .type(testData.lastname)
      cy.get('input[name="email"]')
        .clear()
        .type(testData.email)
      cy.get('input[name="phone"]')
        .clear() // Dejar vacío

      cy.get('button:contains("Reserve Now")')
        .should('be.visible')
        .click()

      cy.contains('must not be empty', { timeout: 5000 })
        .should('be.visible')

      // Verificar que NO hay confirmación en ningún caso
      cy.contains('Booking Confirmed').should('not.exist')
    })
  })
})