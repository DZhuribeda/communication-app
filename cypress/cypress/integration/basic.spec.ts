describe('basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('intro', () => {
    cy.findByRole('heading', {name: 'Rooms'}).should('exist')
  })
})
