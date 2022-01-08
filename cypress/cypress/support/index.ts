import '@testing-library/cypress/add-commands';

Cypress.Commands.add('createUser', (email, password) => {
    cy.visit('/registration');
    cy.findByLabelText(/E-Mail/i).type(email);
    cy.findByLabelText(/Password/i).type(password);
    cy.findByText(/Sign Up/i).click();
});

// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Custom command to create user
         * @example cy.createUser('testing@gmail.com', 'password')
         */
        createUser(email: string, password: string): Chainable<Element>
      }
    }
  }