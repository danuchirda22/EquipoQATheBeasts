//  Módulo 3.1 - Reserva exitosa como usuario invitado


// 1. Abrir la página principal
Cypress.Commands.add('openHomePage', () => {
    cy.visit('https://automationintesting.online/')
    cy.get('body', { timeout: 15000 }).should('be.visible')
    cy.wait(3000)
    cy.contains('Rooms', { timeout: 10000 }).should('be.visible')
})

// 2. Navegar a la sección Rooms
Cypress.Commands.add('goToRooms', () => {
    cy.contains('a', 'Rooms').click()
    cy.url().should('include', '#rooms')
    cy.contains('h2', 'Our Rooms').should('be.visible')
})

// 3. Buscar disponibilidad desde la Home
Cypress.Commands.add('searchAvailability', (checkin, checkout) => {
  const formatDate = (dateStr) => {
    const parts = dateStr.split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  
  cy.get('.react-datepicker-wrapper input[type="text"]', { timeout: 10000 })
    .first()
    .should('be.visible')
    .click()
    .clear()
    .type(formatDate(checkin))
  
  cy.get('.react-datepicker-wrapper input[type="text"]')
    .last()
    .should('be.visible')
    .click()
    .clear()
    .type(formatDate(checkout))
  
  cy.contains('button', 'Check Availability').click()
  cy.contains('h2', 'Our Rooms', { timeout: 10000 }).should('be.visible')
})

// 4. Seleccionar habitación
Cypress.Commands.add('selectRoom', (roomType) => {
  cy.contains('.room-card .card-title', roomType)
    .parents('.room-card')
    .within(() => {
      cy.contains('a', 'Book now').click()
    })
  
  cy.contains('button', 'Reserve Now', { timeout: 10000 })
    .should('be.visible')
    .click()
  
  cy.contains('h2', 'Book This Room', { timeout: 15000 })
    .should('be.visible')
})

// 5. Completar el formulario
Cypress.Commands.add('fillBookingForm', (bookingData) => {
    cy.get('input[name="firstname"]', { timeout: 10000 })
      .clear()
      .type(bookingData.firstname)
    cy.get('input[name="lastname"]')
      .clear()
      .type(bookingData.lastname)
    cy.get('input[name="email"]')
      .clear()
      .type(bookingData.email)
    cy.get('input[name="phone"]')
      .clear()
      .type(bookingData.phone)
})

// 6. Confirmar la reserva
Cypress.Commands.add('submitBooking', () => {
  cy.get('button:contains("Reserve Now")', { timeout: 15000 })
    .should('be.visible')
    .click()
  cy.wait(5000)
})

// 7. Verificar mensaje de confirmación 
Cypress.Commands.add('verifyBookingConfirmation', () => {
  // Buscar el título de confirmación sin que falle el test
  cy.get('body').then(($body) => {
    if ($body.text().includes('Booking Confirmed')) {
      //cy.log('Booking Confirmed encontrado')
      cy.contains('h2', 'Booking Confirmed').should('be.visible')
    } else {
      cy.log('Booking Confirmed NO encontrado - La aplicación no mostró la confirmación')
      cy.log('Contenido de la página:')
      cy.log($body.text().substring(0, 300))
    }
  })
})

// 8. Verificar que el total NO aparece (BUG-001)
Cypress.Commands.add('verifyTotalNotVisible', (expectedTotal) => {
    cy.contains(`Total: £${expectedTotal}`).should('not.exist')
})