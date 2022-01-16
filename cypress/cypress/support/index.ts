import '@testing-library/cypress/add-commands';

Cypress.Commands.add('createUser', (email, password) => {
    cy.visit('/registration');
    cy.findByLabelText(/E-Mail/i).type(email);
    cy.findByLabelText(/Password/i).type(password);
    cy.findByText(/Sign Up/i).click();
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.intercept({
    method: 'POST',
    url: '/api/.ory/self-service/login**',
  }).as('login');
    cy.visit('/login');
    cy.findByLabelText(/ID/i).type(email);
    cy.findByLabelText(/Password/i).type(password);
    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.wait('@login').its('response.statusCode').should('equal', 200);
    cy.log('Email', email);
    cy.log('Password', password);
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
        loginUser(email: string, password: string): Chainable<Element>
      }
    }
  }