describe('basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('intro', () => {
    cy.get('h1').should('have.text', 'Hello world!')
  })
})
