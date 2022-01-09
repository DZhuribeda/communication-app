describe('index', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('allowed only for authorized', () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login');
    });
  })
})
