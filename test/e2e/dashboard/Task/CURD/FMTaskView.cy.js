describe("Task Dashboard FundManager Test", () => {
  const createdTasks = [];

  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard/task");
  });

  function generateTaskName(type) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `Test ${randomStr} - ${type}`;
  }

  function searchAndVerifyTask(taskName) {
    cy.get("input[placeholder='Search tasks...']")
      .clear()
      .type(taskName, { force: true });
    cy.wait(500);
    cy.findElementByTextContent(taskName, "td", "/api/api/tasks/**").should(
      "exist",
    );
  }

  it("should successfully create a non-recurring task", () => {
    const taskName = generateTaskName("NON-RECURRING");

    cy.intercept("POST", "/api/api/tasks/").as("createTask");

    cy.contains("button", "Create Task").click();
    cy.fillCreateTaskForm({
      description: taskName,
      isRecurring: false,
      category: "SEBI",
    });

    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.contains("Task Created Successfully", { timeout: 3000 }).should(
      "be.visible",
    );

    cy.wait("@createTask").then(({ response }) => {
      const { compliance_task_id, description, deadline } = response.body;
      if (compliance_task_id) {
        createdTasks.push({
          id: compliance_task_id,
          name: description,
          deadline: deadline ? deadline.toString() : null,
          isRecurring: false,
        });
      } else {
        throw new Error("Task creation failed");
      }
    });

    searchAndVerifyTask(taskName);
  });

  it("should successfully create a recurring task (multiple tasks)", () => {
    const taskName = generateTaskName("RECURRING");

    cy.intercept("POST", "/api/api/tasks/").as("createRecurringTask");

    cy.contains("button", "Create Task").click();
    cy.fillCreateTaskForm({
      description: taskName,
      isRecurring: true,
      frequency: "Yearly",
    });

    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.contains("Task Created Successfully", { timeout: 10000 }).should(
      "be.visible",
    );

    function waitAndCaptureRecurringTask(timesLeft) {
      if (timesLeft === 0) return;

      cy.wait("@createRecurringTask").then(({ response }) => {
        const { compliance_task_id, description, deadline } = response.body;
        if (compliance_task_id) {
          createdTasks.push({
            id: compliance_task_id,
            name: description,
            deadline: deadline ? deadline.toString() : null,
            isRecurring: true,
          });
        }

        cy.wait(500).then(() => {
          waitAndCaptureRecurringTask(timesLeft - 1);
        });
      });
    }

    waitAndCaptureRecurringTask(3); // wait and collect 3 created tasks

    cy.intercept("GET", "/api/api/tasks/**").as("getTasksList");
    cy.visit("/dashboard/task");

    searchAndVerifyTask(taskName);
  });

  it("should edit the first created task (change name and category)", () => {
    if (!createdTasks.length) {
      cy.log("⚠️ No tasks found to edit, skipping test.");
      return;
    }

    const first_task = createdTasks[0] ?? null;
    const oldName = first_task?.name;
    const newName = generateTaskName("EDITED");

    if (!first_task) {
      throw new Error("No task found to edit");
    }

    cy.visit("/dashboard/task");

    cy.get("input[placeholder='Search tasks...']")
      .clear()
      .type(oldName, { force: true });
    cy.wait(1000); // Allow search results to populate

    cy.findElementByTextContent(oldName, "td", "/api/api/tasks/**").then(
      (taskCell) => {
        if (!taskCell) {
          throw new Error(
            `❌ Task with name "${oldName}" not found after search.`,
          );
        }

        cy.wrap(taskCell).scrollIntoView().click({ force: true });

        cy.get('[data-slot="sheet-footer"]').within(() => {
          cy.contains("button", "Edit Task").click({ force: true });
        });

        cy.get("form").within(() => {
          cy.get('input[name="description"]').clear().type(newName);
        });

        // Fix category dropdown selection
        cy.contains("button", "SEBI").scrollIntoView().click({ force: true });
        cy.get("[role=listbox]").should("be.visible");
        cy.get("[role=option]")
          .contains("RBI")
          .should("be.visible")
          .click({ force: true });

        cy.get("form").within(() => {
          cy.contains("button", "Save").click({ force: true });
        });

        cy.contains("Task Updated Successfully").should("be.visible");

        const updatedTask = {
          ...first_task,
          name: newName,
        };

        createdTasks[0] = updatedTask;

        searchAndVerifyTask(newName);
      },
    );
  });

  it("should change the first created task's status and verify", () => {
    if (!createdTasks.length) {
      cy.log("⚠️ No tasks found to edit, skipping test.");
      return;
    }

    const first_task = createdTasks[0] ?? null;
    const oldName = first_task?.name;

    if (!first_task) {
      throw new Error("No task found to edit");
    }

    cy.visit("/dashboard/task");

    cy.get("input[placeholder='Search tasks...']")
      .clear()
      .type(oldName, { force: true });
    cy.wait(1000);

    cy.findElementByTextContent(oldName, "td", "/api/api/tasks/**").then(
      (taskCell) => {
        if (!taskCell) {
          throw new Error(
            `❌ Task with name "${oldName}" not found after search.`,
          );
        }

        cy.wrap(taskCell).scrollIntoView().click({ force: true });
        cy.wait(500);

        // Inside sheet header, open status selector
        cy.get('[data-slot="sheet-header"]').within(() => {
          cy.get('button[data-type="status-selector"]').click({ force: true });
        });
        cy.wait(100);

        // Wait for status options to appear
        cy.get('[data-role="status-option"]').should("be.visible");

        // Grab the first status option text
        cy.get('[data-role="status-option"]')
          .first()
          .then(($option) => {
            cy.wait(1000);
            const newStatus = $option.text().trim();

            // Click the first status option
            cy.wrap($option).click({ force: true });

            // Re-search for the task
            cy.get("input[placeholder='Search tasks...']")
              .clear()
              .type(oldName, { force: true });
            cy.wait(500);

            // Find and click again
            cy.findElementByTextContent(
              oldName,
              "td",
              "/api/api/tasks/**",
            ).then((updatedTaskCell) => {
              if (!updatedTaskCell) {
                throw new Error(
                  `❌ Task with name "${oldName}" not found after status change.`,
                );
              }

              cy.wrap(updatedTaskCell).scrollIntoView().click({ force: true });

              // Inside sheet-header, check that new status is set
              cy.get('[data-slot="sheet-header"]').within(() => {
                cy.get('button[data-type="status-selector"]').should(
                  "contain.text",
                  newStatus,
                );
              });
            });
          });
      },
    );
  });

  it("should delete all created tasks using UI", () => {
    if (!createdTasks.length) {
      throw new Error("No tasks to delete");
    }

    cy.deleteTasksByNameUI(createdTasks);
  });
});
