// Pruebas sobre el formulario de contacto
describe('Module X Contact form', () => {
  beforeEach(() => {
    cy.openHomePage()
  })

    //CP FC-1.0 [+] Formulario de contacto - Envío de msj de consulta
    describe('EnvioMsjDeConsulta', () => {
        it('Carga y envio de consulta', () => {
    
        cy.fixture('guestContactDate').then((data) => {
        cy.get('#name').type(data.Name);
        cy.get('#email').type(data.Email);
        cy.get('#phone').type(data.Phone);   
        cy.get('#subject').type(data.Subject);
        cy.get('#description').type(data.Description);

        cy.get('button:contains("Submit")', {timeout: 10000})
            .should('be.visible')
            .click()

        //Verificar el mensaje de éxito
        cy.get('.col-lg-8 > .card > .card-body > .h4').should('contain', 'Thanks for getting in touch Carlos!');
        cy.get('.col-lg-8 > .card > .card-body > :nth-child(2)').should('contain', "We'll get back to you about");
        cy.get('.col-lg-8 > .card > .card-body > :nth-child(4)').should('contain', "as soon as possible.");
    })
    })

    // CP FC-9.0 - [*] Formulario de contacto - Validar longitud mínima del campo Subject
    describe('ValidarLongitudSubject', () => {
      it('Validar longitud del campo subject', () => {
    
        cy.fixture('guestContactDate').then((data) => {
        cy.get('#name').type(data.Name);
        cy.get('#email').type(data.Email);
        cy.get('#phone').type(data.Phone);   
        cy.get('#subject').type("AF");
        cy.get('#description').type(data.Description);

        cy.get('button:contains("Submit")', {timeout: 10000})
            .should('be.visible')
            .click()
        
        //Validar mensaje de error en longitud
        cy.get('.alert > p').should('contain', 'Subject must be between 5 and 100 characters.');

      })
    })
    })

    // CP [*] Formulario de contacto - Validar longitud del campo Message
    describe('ValidarLongitudMessage', () => {
        it('Validar longitud Minima del campo message', () => {
            cy.fixture('guestContactDate').then((data) => {
            cy.get('#name').type(data.Name);
            cy.get('#email').type(data.Email);
            cy.get('#phone').type(data.Phone);   
            cy.get('#subject').type(data.Subject);
            cy.get('#description').type("AF");
            
            
            cy.get('button:contains("Submit")', {timeout: 10000})
                .should('be.visible')
                .click()

            //Validar longitud del campo message
            cy.get('.alert > p').should('contain', 'Message must be between 20 and 2000 characters.');
            })
        })
    })

    // CP FC-11.0 [*] Formulario de contacto - Validar longitud máxima del campo Subject
    describe('ValidarLongitudMaximaSubject', () => {
        it('Validar longitud Maxima del campo subject', () => {
            cy.fixture('guestContactDate').then((data) => {
            cy.get('#name').type(data.Name);
            cy.get('#email').type(data.Email);
            cy.get('#phone').type(data.Phone);
            cy.get('#subject').type("Este es un ejemplo de texto que supera los cien caracteres y puede ser utilizado para validar campos en formularios, asegurando que se cumplen las restricciones mínimas de longitud requeridas por el sistema.");
            cy.get('#description').type(data.Description);

            cy.get('button:contains("Submit")', {timeout: 10000})
                .should('be.visible')
                .click()
            
            //Validar el msj obtenido
            cy.get('.alert > p').should('contain', 'Subject must be between 5 and 100 characters.');
            
            })
            })
        })
    })  
    
    // CP FC-12.0 [*] Formulario de contacto - Validar que el campo Subject no permita valor vacío
    describe('ValidarSubjectNotNull', () => {
        it('Validar Subject Not Null', () => {
            cy.fixture('guestContactDate').then((data) => {
            cy.get('#name').type(data.Name);
            cy.get('#email').type(data.Email);
            cy.get('#phone').type(data.Phone);
            cy.get('#description').type(data.Description);
            })

            cy.get('button:contains("Submit")', {timeout: 10000})
                .should('be.visible')
                .click()

            //Validar msj de campo subject no permite vacío
            cy.get('.alert > p').should('contain', 'Subject must be between 5 and 100 characters.');
            cy.get('.alert > p').should('contain', 'Subject may not be blank');
        })
    })

    // CP FC-13.0 [*] Formulario de contacto - Validar que el campo Message no permita valor vacío
    describe('ValidarMessageNotNull', () => {
        it('Validar Message Not Null', () => {
            cy.fixture('guestContactDate').then((data) => {
            cy.get('#name').type(data.Name);
            cy.get('#email').type(data.Email);
            cy.get('#phone').type(data.Phone);
            cy.get('#subject').type(data.Subject);
            })

            cy.get('button:contains("Submit")', {timeout: 10000})
                .should('be.visible')
                .click()

            //Validar msj de campo message no permite vacío
            cy.get('.alert > p').should('contain', 'Message must be between 20 and 2000 characters.');
            cy.get('.alert > p').should('contain', 'Message may not be blank');
       })
    })
})
