Cypress.Commands.add("login", () => {
  cy.intercept("POST", "/api/api/auth/login").as("loginRequest");

  cy.visit("/login");

  const { email, password } = Cypress.env("FundManager");

  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get("button[type=submit]").click();

  cy.wait("@loginRequest").then((interception) => {
    const accessToken = interception.response.body.access_token;

    Cypress.env("accessToken", accessToken);

    cy.log(`Access token saved: ${accessToken}`);
  });

  cy.url().should("include", "/dashboard");
});
