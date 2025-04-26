import { format, isAfter, isBefore, parse } from "date-fns";


Cypress.Commands.add("setTableSortingOrder", (text, order) => {
  cy.log(`Setting sorting for "${text}" to "${order}"`);

  let attempts = 0;

  function trySetSorting() {
    attempts++;

    cy.get('button[data-type="sort-button"]').then(($buttons) => {
      const button = [...$buttons].find((btn) => btn.innerText.trim() === text);

      if (!button) {
        throw new Error(`Button with text "${text}" not found`);
      }

      cy.wrap(button)
        .invoke("attr", "data-state")
        .then((state) => {
          if (state === order) {
            cy.log(`✅ Sorting set to "${order}" after ${attempts} attempt(s)`);
            return;
          }

          if (attempts >= 4) {
            throw new Error(
              `❌ Failed to set sorting to "${order}" after 4 attempts`,
            );
          }

          cy.wrap(button)
            .click({ force: true })
            .then(() => {
              cy.wait(300); // Allow UI to update
              trySetSorting();
            });
        });
    });
  }

  trySetSorting();
});

Cypress.Commands.add("selectDate", (fieldName, isoDate) => {
  const targetDate = parse(isoDate, "yyyy-MM-dd", new Date());
  const targetDay = format(targetDate, "d");

  cy.get(`[data-testid="${fieldName}"]`).click();

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
        cy.get('button[name="day"]')
          .contains(new RegExp(`^${targetDay}$`))
          .click()
          .then(() => {
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
