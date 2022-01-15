import * as faker from 'faker';

const email = faker.internet.email();
const password = faker.internet.password();
const ROOM_NAME = 'Test room'

describe('Login', () => {
  before(() => {
    cy.createUser(email, password);
  });

  beforeEach(() => {
    cy.loginUser(email, password);
  });

  it('empty state', () => {
    cy.visit('/rooms');
    cy.findByRole('heading').should('have.text', 'Rooms');
    cy.findByRole('heading', {
      name: /there are no rooms here\./i
    }).should('exist');
    cy.findByRole('main').within(() => {
      cy.findByRole('link', {
        name: /create a room/i
      }).should('exist').click();
    });
  });

  it('create room', () => {
    cy.visit('/rooms/new');
    cy.findByRole('textbox', {
      name: /room name/i
    }).type(ROOM_NAME);
    cy.findByRole('button', {
      name: /create/i
    }).click();
  });

  it('room displayed', () => {
    cy.visit('/rooms');
    cy.findByText(ROOM_NAME).should('exist');
    cy.findByText('1 members').should('exist');
    cy.findByRole('button', {
      name: /join/i
    });
  });
})
