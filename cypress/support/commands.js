import { format, isAfter, isBefore, parse } from "date-fns";
import "cypress-file-upload";

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

Cypress.Commands.add("fillLPForm", (lp) => {
  cy.get('input[name="lp_name"]').clear().type(lp.lp_name);
  cy.get('input[name="mobile_no"]').clear().type(lp.mobile_no);
  cy.get('input[name="email"]').clear().type(lp.email);
  cy.get('input[name="pan"]').clear().type(lp.pan);
  cy.get('textarea[name="address"]').clear().type(lp.address);
  cy.get('input[name="nominee"]').clear().type(lp.nominee);
  cy.get('input[name="commitment_amount"]').clear().type(lp.commitment_amount);
  cy.get('input[name="dpid"]').clear().type(lp.dpid);
  cy.get('input[name="client_id"]').clear().type(lp.client_id);

  // Gender
  cy.contains("button", "Select Gender").click({ force: true });
  cy.get("[role=option]").contains(lp.gender).click({ force: true });

  // Acknowledgement of PPM
  cy.contains("button", "Acknowledgement of PPM").click({ force: true });
  cy.get("[role=option]")
    .contains(lp.acknowledgement_of_ppm)
    .click({ force: true });

  // Class of Share
  cy.contains("button", "Please select class of share").click({ force: true });
  cy.get("[role=option]")
    .contains(lp.class_of_shares.label)
    .click({ force: true });

  // Entity Type
  cy.contains("button", "Please select entity type").click({ force: true });
  cy.get("[role=option]").contains(lp.type).click({ force: true });

  // Tax Jurisdiction
  cy.contains("button", "Please select tax jurisdiction").click({
    force: true,
  });
  cy.get("[role=option]").contains(lp.citizenship).click({ force: true });

  // Geography (Country Select)
  cy.contains("button", "Country").click({ force: true });
  cy.get("input[placeholder='Search country...']")
    .should("be.visible")
    .type(lp.geography, { delay: 100 });
  cy.contains("[role=option]", lp.geography).click({ force: true });

  // Email drawdowns
  cy.get('[data-tags-name="tags"]').within(() => {
    lp.emaildrawdowns.forEach((email) => {
      cy.get('input[placeholder="Please enter email"]').type(email);
      cy.contains("button", "Add").click();
    });
  });

  cy.selectDate("dob", lp.dob);
  cy.selectDate("doi", lp.doi);
  cy.selectDate("date_of_agreement", lp.date_of_agreement);

  cy.get('[data-testid="cml"] input[type="file"]').attachFile("sample.pdf", {
    force: true,
  });
});

Cypress.Commands.add("selectDate", (fieldName, isoDate) => {
  const targetDate = parse(isoDate, "yyyy-MM-dd", new Date());
  const targetDay = format(targetDate, "d"); // day without leading zero

  // Step 1: Open the calendar popover
  cy.get(`[data-testid="${fieldName}"]`).click();

  // Step 2: Navigate to correct month/year
  function navigateToTarget() {
    cy.get('[class*="calendar-caption-label"]').then(($caption) => {
      const currentCaption = $caption.text().trim();
      const currentDate = parse(currentCaption, "MMMM yyyy", new Date());

      if (isBefore(currentDate, targetDate)) {
        cy.get('button[name="next-month"]').click();
        cy.wait(100);
        navigateToTarget();
      } else if (isAfter(currentDate, targetDate)) {
        cy.get('button[name="previous-month"]').click();
        cy.wait(100);
        navigateToTarget();
      } else {
        // Correct month — select the day
        cy.get('button[name="day"]')
          .contains(new RegExp(`^${targetDay}$`))
          .click()
          .then(() => {
            // Re-focus and then blur the input
            const inputSelector = `[data-testid="${fieldName}"]`;
            cy.get(inputSelector).focus().blur();
          });
      }
    });
  }

  navigateToTarget();
});

Cypress.Commands.add(
  "findElementByTextContent",
  (textContent, selector = "td", apiPath = null) => {
    function waitForPageReady(retries = 50) {
      if (retries === 0) {
        throw new Error("❌ Page did not become ready in time.");
      }

      return cy.wait(100).then(() => {
        return cy.document().then((doc) => {
          const hasTable = doc.querySelector('[data-role="table"]');
          const isLoading = doc.querySelector('[data-state="loading"]');

          if (hasTable && !isLoading) {
            cy.log("✅ Page is ready.");
            return;
          } else {
            return waitForPageReady(retries - 1);
          }
        });
      });
    }

    function searchElementOnAllPages(textContent, searchForward = true) {
      return cy.wrap(null, { log: false }).then(() => {
        return waitForPageReady().then(() => {
          return cy.document({ log: false }).then((doc) => {
            const foundElement = [...doc.querySelectorAll(selector)].find(
              (el) => el.textContent.includes(textContent),
            );

            if (foundElement) {
              cy.log(`✅ Found element with text "${textContent}"`);
              return cy.wrap(foundElement);
            } else {
              return cy
                .get('[data-role="page-index"]', { log: false })
                .invoke("text")
                .then((indexText) => {
                  return cy
                    .get('[data-role="page-count"]', { log: false })
                    .invoke("text")
                    .then((countText) => {
                      const currentPage = parseInt(indexText.trim(), 10);
                      const totalPages = parseInt(countText.trim(), 10);

                      if (searchForward && currentPage < totalPages) {
                        cy.get('[data-role="page-navigation"]')
                          .contains("button", "Next")
                          .click({ force: true });

                        if (apiPath) {
                          cy.intercept("GET", apiPath).as("getTasksNext");
                          return cy
                            .wait("@getTasksNext", { timeout: 10000 })
                            .then(() => {
                              return searchElementOnAllPages(textContent, true);
                            });
                        } else {
                          return waitForPageReady().then(() => {
                            return searchElementOnAllPages(textContent, true);
                          });
                        }
                      } else if (!searchForward && currentPage > 1) {
                        cy.get('[data-role="page-navigation"]')
                          .contains("button", "Previous")
                          .click({ force: true });

                        if (apiPath) {
                          cy.intercept("GET", apiPath).as("getTasksPrev");
                          return cy
                            .wait("@getTasksPrev", { timeout: 10000 })
                            .then(() => {
                              return searchElementOnAllPages(
                                textContent,
                                false,
                              );
                            });
                        } else {
                          return waitForPageReady().then(() => {
                            return searchElementOnAllPages(textContent, false);
                          });
                        }
                      } else if (
                        searchForward &&
                        currentPage === totalPages &&
                        totalPages > 1
                      ) {
                        return searchElementOnAllPages(textContent, false);
                      }

                      cy.log(
                        `⚠️ Element with text "${textContent}" not found on any page.`,
                      );
                      return cy.wrap(null);
                    });
                });
            }
          });
        });
      });
    }

    return searchElementOnAllPages(textContent, true);
  },
);

Cypress.Commands.add("deleteTaskByNameUI", (taskName) => {
  const tasks = Cypress.env("compliance_tasks") || [];

  cy.visit("/dashboard/task");
  cy.intercept("GET", "/api/api/tasks/**").as("getTasks");
  cy.wait("@getTasks", { timeout: 10000 });

  cy.findElementByTextContent(taskName).then((taskCell) => {
    if (taskCell) {
      cy.wrap(taskCell).scrollIntoView().click({ force: true });

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
        cy.log(`✅ Task deleted: ${taskName}`);
      });
    } else {
      cy.log(`⚠️ Task not found: ${taskName}`);
    }
  });
});
