// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Command to handle login and intercept the token
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

Cypress.Commands.add("deleteTaskByNameUI", (taskName) => {
  const tasks = Cypress.env("compliance_tasks") || [];

  cy.visit("/dashboard/task");

  cy.intercept("GET", "/api/api/tasks/**").as("getTasks");
  cy.wait("@getTasks", { timeout: 10000 });

  cy.contains("td", taskName).should("be.visible").click({ force: true });

  cy.get('[data-slot="sheet-footer"]').within(() => {
    cy.contains("button", "Delete Task")
      .should("be.visible")
      .click({ force: true });
  });

  cy.contains(
    `Are you absolutely sure you want to delete the “${taskName}” task?`,
  ).should("be.visible");

  cy.get('[data-slot="alert-dialog-footer"]').within(() => {
    cy.contains("button", "Delete").click({ force: true });
  });

  cy.contains("Task deleted successfully").should("be.visible");
  cy.contains("td", taskName).should("not.exist");

  cy.then(() => {
    const updatedTasks = tasks.filter((t) => t.name !== taskName);
    Cypress.env("compliance_tasks", updatedTasks);
    cy.log(`Task "${taskName}" removed from Cypress.env`);
  });
});

Cypress.Commands.add(
  "fillCreateTaskForm",
  ({
    description,
    category = "SEBI",
    assignee = null,
    isRecurring = false,
    frequency = "Yearly",
  }) => {
    const fundManagerName = Cypress.env("FundManager")?.name;

    if (!fundManagerName) {
      throw new Error("FundManager name not set in environment variables");
    }

    cy.get("form").within(() => {
      cy.get('input[name="description"]').type(description);
    });

    cy.contains("button", "Please select a category")
      .scrollIntoView()
      .click({ force: true });
    cy.get("[role=option]").contains(category).click({ force: true });

    cy.contains("button", "Please select a Assignee")
      .scrollIntoView()
      .click({ force: true });
    cy.get("input[placeholder='Search by name']")
      .should("be.visible")
      .type(assignee || fundManagerName, { delay: 100 });
    cy.contains("[role=option]", fundManagerName).click({ force: true });

    if (isRecurring) {
      cy.contains("label", "Repeat Task")
        .scrollIntoView()
        .click({ force: true });
      cy.contains("Frequency").scrollIntoView().should("be.visible");
      cy.contains("button", "Please select a frequency")
        .scrollIntoView()
        .click({ force: true });
      cy.get("[role=option]").contains(frequency).click({ force: true });
    }
  },
);

Cypress.Commands.add("deleteRecurringTask", (taskId) => {
  const accessToken = Cypress.env("accessToken");

  if (!taskId) {
    throw new Error("Task ID is required to delete a recurring task");
  }

  cy.request({
    method: "DELETE",
    url: `/api/api/tasks/${taskId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      cy.log(`Successfully deleted recurring task: ${taskId}`);
    } else {
      cy.log(
        `Failed to delete recurring task: ${taskId} - Status: ${response.status}`,
      );
    }
  });
});
