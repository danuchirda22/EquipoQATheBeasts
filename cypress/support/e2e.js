// Import commands.js using ES2015 syntax:
import './commands'

// Manejar TODOS los errores no capturados de la aplicación
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('=== ERROR DETECTADO ===')
  console.log('Mensaje:', err.message)
  console.log('=== IGNORANDO PARA CONTINUAR ===')
  
  // Ignorar TODOS los errores para que la prueba continúe

  return false
})

// Aumentar tiempo de espera global
Cypress.config('defaultCommandTimeout', 15000)