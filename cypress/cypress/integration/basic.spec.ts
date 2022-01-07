describe('basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('intro', () => {
    cy.findByText('Hello world!').should('exist')
  })
})
