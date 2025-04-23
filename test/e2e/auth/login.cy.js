describe("Login Page", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
  

    const { email, password } = Cypress.env("FundManager");

    it("renders the login form", () => {
      cy.get("input[name=email]").should("be.visible");
      cy.get("input[name=password]").should("be.visible");
      cy.get("button[type=submit]").should("be.visible").and("contain", "Login");
    });
  
    it("shows validation errors for empty fields", () => {
      cy.get("button[type=submit]").click();
  
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });
  
    it("logs in successfully with valid credentials (real API for dummy credentials)", () => {
      // Use the dummy credentials
      cy.get("input[name=email]").type(email);
      cy.get("input[name=password]").type(password);
  
      // Click the login button
      cy.get("button[type=submit]").click();
  
      // Assert that the user is redirected to the dashboard
      cy.url().should("include", "/dashboard");
      cy.contains("Login successful").should("be.visible");
    });
  
    // it("logs in successfully with other valid credentials", () => {
    //   // Use another set of valid credentials
    //   cy.get("input[name=email]").type("test@example.com");
    //   cy.get("input[name=password]").type("password123");
  
    //   // Click the login button
    //   cy.get("button[type=submit]").click();
  
    //   // Assert that the user is redirected to the dashboard
    //   cy.url().should("include", "/dashboard");
    //   cy.contains("Login successful").should("be.visible");
    // });
  
    it("shows an error message for invalid credentials", () => {
      // Use invalid credentials
      cy.get("input[name=email]").type("wrong@example.com");
      cy.get("input[name=password]").type("wrongpassword");
  
      // Click the login button
      cy.get("button[type=submit]").click();
  
      // Assert that the error message is displayed
      cy.contains("Login failed").should("be.visible");
      cy.contains("Incorrect email or password").should("be.visible");
    });
  });