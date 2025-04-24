describe("Task Dashboard FundManager Test", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard/task");
  });

  function generateTaskName(type) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `Test ${randomStr} - ${type}`;
  }

  it("should open and close the Create Task dialog", () => {
    cy.contains("button", "Create Task").click();
    cy.contains("Create Task").should("be.visible");
    cy.contains("Create a new task by filling out the form below.").should(
      "be.visible"
    );

    cy.contains("button", "Close").click();
    cy.contains("Create a new task by filling out the form below.").should(
      "not.exist"
    );
  });

  it("should show error messages for required fields", () => {
    cy.contains("button", "Create Task").click();
    cy.contains("Create a new task by filling out the form below.").should(
      "be.visible"
    );

    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.contains("Description is required").scrollIntoView().should("be.visible");
    cy.contains("Category is required").scrollIntoView().should("be.visible");
    cy.contains("Assignee ID is required").scrollIntoView().should("be.visible");
  });

  it("should successfully create a task (NON-RECURRING)", () => {
    const taskName = generateTaskName("NON-RECURRING");
    let compliance_tasks = Cypress.env("compliance_tasks") || [];

    cy.intercept("POST", "/api/api/tasks/").as("createTask");
    cy.intercept("GET", "/api/api/tasks/**").as("getTaskDetails");

    cy.contains("button", "Create Task").click();
    cy.contains("Create Task").should("be.visible");

    cy.fillCreateTaskForm({
      description: taskName,
      isRecurring: false,
    });

    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.contains("Task Created Successfully").should("be.visible");

    cy.wait("@createTask", { timeout: 10000 }).then((interception) => {
      const response = interception.response.body;
      if (!response || !response.compliance_task_id) {
        throw new Error("Task creation failed or no task ID returned");
      }

      const taskId = response.compliance_task_id;

      cy.request({
        method: "GET",
        url: `/api/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${Cypress.env("accessToken")}`,
        },
      }).then((taskRes) => {
        const taskData = taskRes.body;

        compliance_tasks.push({
          id: taskId,
          name: taskData.description,
          deadline: taskData.deadline ? taskData.deadline.toString() : null,
        });

        Cypress.env("compliance_tasks", compliance_tasks);
      });
    });
  });

  it("should edit the last created task (change name and category)", () => {
    let tasks = Cypress.env("compliance_tasks") || [];
    if (!tasks.length) {
      cy.log("⚠️ No tasks found to edit, skipping test.");
      return;
    }

    const lastTask = tasks[tasks.length - 1];
    const oldName = lastTask.name;
    const newName = generateTaskName("EDITED");

    cy.visit("/dashboard/task");
    cy.intercept("GET", "/api/api/tasks/**").as("getTasksList");
    cy.wait("@getTasksList", { timeout: 10000 });

    function findAndEditTaskOnPage() {
      cy.document().then((doc) => {
        const taskCell = [...doc.querySelectorAll("td")].find((td) =>
          td.textContent.includes(oldName)
        );

        if (taskCell) {
          cy.wrap(taskCell).scrollIntoView().click({ force: true });

          cy.get('[data-slot="sheet-footer"]').within(() => {
            cy.contains("button", "Edit Task").click({ force: true });
          });

          cy.contains(
            "You can edit the task by changing the details below."
          ).should("be.visible");

          cy.get("form").within(() => {
            cy.get('input[name="description"]').clear().type(newName);
          });

          cy.contains("button", "SEBI").scrollIntoView().click({ force: true });
          cy.get("[role=option]").contains("RBI").click({ force: true });

          cy.get("form").within(() => {
            cy.contains("button", "Save").click({ force: true });
          });

          cy.contains("Task Updated Successfully").should("be.visible");

          cy.then(() => {
            const updated = tasks.map((t) =>
              t.id === lastTask.id ? { ...t, name: newName } : t
            );
            Cypress.env("compliance_tasks", updated);
          });
        } else {
          cy.get('[data-role="page-index"]').invoke("text").then((indexText) => {
            cy.get('[data-role="page-count"]').invoke("text").then((countText) => {
              const currentPage = parseInt(indexText.trim(), 10);
              const totalPages = parseInt(countText.trim(), 10);

              if (currentPage < totalPages) {
                cy.get('[data-role="page-navigation"]')
                  .contains("button", "Next")
                  .click({ force: true });

                cy.wait("@getTasksList", { timeout: 10000 });
                findAndEditTaskOnPage();
              } else {
                cy.log(`⚠️ Task "${oldName}" not found.`);
              }
            });
          });
        }
      });
    }

    findAndEditTaskOnPage();
  });

  it("should successfully create a recurring task", () => {
    const taskName = generateTaskName("RECURRING");
    let compliance_tasks = Cypress.env("compliance_tasks") || [];

    cy.intercept("POST", "/api/api/tasks/").as("createTask");
    cy.intercept("POST", "**/api/**").as("anyApiPost");
    cy.intercept("GET", "/api/api/tasks/**").as("getTasksList");

    cy.contains("button", "Create Task").click();
    cy.contains("Create Task").should("be.visible");

    cy.fillCreateTaskForm({
      description: taskName,
      isRecurring: true,
      frequency: "Yearly",
    });

    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.wait("@anyApiPost", { timeout: 10000 }).then((interception) => {
      const response = interception.response.body;

      if (response && response.compliance_task_id) {
        compliance_tasks.push({
          id: response.compliance_task_id,
          name: response.description,
          deadline: response.deadline ? response.deadline.toString() : null,
        });

        Cypress.env("compliance_tasks", compliance_tasks);
      } else {
        cy.log("Unexpected response format:", response);
      }
    });

    cy.contains("Task Created Successfully").should("be.visible");

    cy.visit("/dashboard/task");

    cy.wait("@getTasksList", { timeout: 10000 }).then((interception) => {
      const response = interception.response.body;

      if (response?.data?.length) {
        const matchingTasks = response.data.filter(
          (task) => task.description === taskName
        );

        matchingTasks.forEach((task) => {
          if (!compliance_tasks.some((t) => t.id === task.id)) {
            compliance_tasks.push({
              id: task.id,
              name: task.description,
              deadline: task.deadline ? task.deadline.toString() : null,
            });
          }
        });

        Cypress.env("compliance_tasks", compliance_tasks);
      }
    });
  });

  it("should delete all created tasks using UI", () => {
    const tasks = Cypress.env("compliance_tasks") || [];

    if (!tasks.length) {
      throw new Error("No tasks available to delete");
    }

    tasks.forEach((task) => {
      cy.deleteTaskByNameUI(task.name);
    });
  });
});
