describe('New task test', function() {
  it('Checks that modal title is Create when opening from New', function() {
    cy.visit('/')
    cy.contains('New task').click()
    cy.contains('Create')
  })

  it('Adds new task', function() {
    cy.get('.form-control-lg')
      .type('buy milk')
    cy.get('.modal-form').submit()
    cy.contains('buy milk')

  })
})
