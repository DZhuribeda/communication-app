import * as faker from 'faker';

const email = faker.internet.email();
const password = faker.internet.password();

describe('Login', () => {
  before(() => {
      cy.createUser(email, password);
  });
  beforeEach(() => {
    cy.visit('/login');
  });

  it('form shown', () => {
    cy.findByRole('heading').should('have.text', 'Sign in to your account')
    cy.findByLabelText(/ID/i).should('exist');
    cy.findByLabelText(/Password/i).should('exist');
    cy.findByRole('button', { name: /Sign In/i }).should('exist');
    cy.findByText(/Sign up/i).should('exist');
    cy.findByText(/Forgot password/i).should('exist');
  });

  it('error shown', () => {
    // Next-route announcer
    cy.findByRole('alert').should('exist').should('have.length', 1);
    cy.findByRole('button', { name: /Sign In/i }).click();
    // Next-route announcer + 2 required
    cy.findAllByRole('alert').should('exist').should('have.length', 3);
  });

  it('successfull login', () => {
    // Next-route announcer
    cy.findByRole('alert').should('exist').should('have.length', 1);
    cy.findByLabelText(/ID/i).type(email);
    cy.findByLabelText(/Password/i).type(password);
    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
    });
  });
})
