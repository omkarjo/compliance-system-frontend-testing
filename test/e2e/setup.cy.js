Cypress.Commands.add("login", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("greatnerve@gmail.com");
    cy.get("input[name=password]").type("000000");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
  });