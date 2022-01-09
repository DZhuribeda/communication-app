import * as faker from 'faker';

describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/registration');
    cy.intercept({
      method: 'POST',
      url: '/api/.ory/self-service/registration**',
    }).as('registration');
  });

  it('form shown', () => {
    cy.findByRole('heading').should('have.text', 'Create account')
    cy.findByLabelText(/E-Mail/i).should('exist');
    cy.findByLabelText(/Password/i).should('exist');
    // cy.findByLabelText(/First Name/i).should('exist');
    // cy.findByLabelText(/Last Name/i).should('exist');
    cy.findByRole('button', { name: /Sign Up/i }).should('exist');
    cy.findByText(/Log in/i).should('exist');
  });

  it('error shown', () => {
    // Next-route announcer
    cy.findByRole('alert').should('exist').should('have.length', 1);
    cy.findByText(/Sign Up/i).click();
    // Next-route announcer + 2 required
    cy.findAllByRole('alert').should('exist').should('have.length', 3);
  });

  it('successfull registration', () => {
    // Next-route announcer
    cy.findByRole('alert').should('exist').should('have.length', 1);
    cy.findByLabelText(/E-Mail/i).type(faker.internet.email());
    cy.findByLabelText(/Password/i).type(faker.internet.password());
    cy.findByText(/Sign Up/i).click();
    cy.wait('@registration').its('response.statusCode').should('equal', 200);
    // FIXME
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq('/');
    // });
  });
})
