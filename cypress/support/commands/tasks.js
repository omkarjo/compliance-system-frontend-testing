import { format, isAfter, isBefore, parse } from "date-fns";
import "cypress-file-upload";

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

Cypress.Commands.add("deleteTasksByNameUI", (tasksToDelete) => {
  if (!tasksToDelete.length) {
    cy.log("⚠️ No tasks to delete");
    return;
  }

  cy.visit("/dashboard/task");
  cy.intercept("GET", "/api/api/tasks/**").as("getTasks");
  cy.wait("@getTasks", { timeout: 10000 });

  tasksToDelete.forEach((task) => {
    const { name: taskName, isRecurring } = task;

    cy.log(`Deleting task: ${taskName}`);

    cy.get("input[placeholder='Search tasks...']")
      .clear()
      .type(taskName, { force: true });
    cy.wait(500);

    if (isRecurring) {
      cy.setTableSortingOrder("Due Date", "desc");

      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.contains("td", taskName).scrollIntoView().click({ force: true });
        });
    } else {
      cy.findElementByTextContent(taskName).then((taskCell) => {
        if (taskCell) {
          cy.wrap(taskCell).scrollIntoView().click({ force: true });
        } else {
          cy.log(`⚠️ Task not found: ${taskName}`);
          return;
        }
      });
    }

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

    if (!isRecurring) {
      cy.contains("td", taskName).should("not.exist");
    }

    cy.wait(500);
  });
});
