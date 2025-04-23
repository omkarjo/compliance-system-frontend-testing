describe("Task Dashboard FundManager Test", () => {
  beforeEach(() => {
    cy.login(); // Perform login first
    cy.visit("/dashboard/task");
  });

  it("should open the Create Task dialog", () => {
    cy.contains("button", "Create Task").click();
    cy.contains("Create Task").should("be.visible");
    cy.contains("Create a new task by filling out the form below.").should(
      "be.visible",
    );
  });

  it("should close the dialog when clicking the 'X' button", () => {
    cy.contains("button", "Create Task").click();
    cy.contains("Create a new task by filling out the form below.").should(
      "be.visible",
    );
    cy.contains("button", "Close").click();
    cy.contains("Create a new task by filling out the form below.").should(
      "not.exist",
    );
  });

  it("should show error messages for required fields", () => {
    cy.contains("button", "Create Task").click();
    cy.contains("Create a new task by filling out the form below.").should(
      "be.visible",
    );

    // Fill the form but do not submit
    cy.get("form").within(() => {
      cy.contains("button", "Create").click(); // Only check errors without filling
    });

    cy.contains("Description is required")
      .scrollIntoView()
      .should("be.visible");
    cy.contains("Category is required").scrollIntoView().should("be.visible");
    cy.contains("Assignee ID is required")
      .scrollIntoView()
      .should("be.visible");
  });

  it("should successfully create a task (Non-Recurring)", () => {
    let compliance_tasks = Cypress.env("compliance_tasks") || [];

    // Intercepts
    cy.intercept("POST", "/api/api/tasks/").as("createTask");
    cy.intercept("GET", "/api/api/tasks/**").as("getTaskDetails");

    // Open modal and fill form
    cy.contains("button", "Create Task").click();
    cy.contains("Create Task").should("be.visible");

    cy.fillCreateTaskForm({
      description: "Test Task Description - Non-Recurring",
      isRecurring: false,
    });
    // Submit the form after filling
    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.contains("Task Created Successfully").should("be.visible");

    cy.wait("@createTask", { timeout: 10000 }).then((interception) => {
      const response = interception.response.body;
      if (!response || !response.compliance_task_id) {
        throw new Error(
          "Task creation failed or response did not contain compliance_task_id",
        );
      }

      const taskId = response.compliance_task_id;
      cy.log(`Created Task ID: ${taskId}`);

      cy.request({
        method: "GET",
        url: `/api/api/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${Cypress.env("accessToken")}`,
        },
        failOnStatusCode: false,
      }).then((taskRes) => {
        if (taskRes.status !== 200) {
          throw new Error(
            `GET /tasks/${taskId} failed with status ${taskRes.status}`,
          );
        }

        const taskData = taskRes.body;
        const taskDescription = taskData.description;
        const deadline = taskData.deadline || null;

        compliance_tasks.push({
          id: taskId,
          name: taskDescription,
          deadline: deadline ? deadline.toString() : null,
        });

        Cypress.env("compliance_tasks", compliance_tasks);
        cy.log(`Task verified and saved: ${taskDescription} (${taskId})`);
      });
    });

    cy.intercept("GET", "/api/api/tasks/**").as("getTasksList");
    cy.visit("/dashboard/task");
    cy.wait("@getTasksList", { timeout: 10000 });
  });

  it("should delete the last created task using UI", () => {
    const tasks = Cypress.env("compliance_tasks") || [];

    if (!tasks.length) {
      throw new Error("No tasks available to delete");
    }

    const lastTask = tasks[tasks.length - 1];
    cy.deleteTaskByNameUI(lastTask.name);
  });

  it("should successfully create a recurring task", () => {
    let compliance_tasks = Cypress.env("compliance_tasks") || [];

    cy.intercept("POST", "/api/api/tasks/").as("createTask");
    cy.intercept("GET", "/api/api/tasks/**").as("getTaskDetail");
    cy.intercept("POST", "**/api/**").as("anyApiPost");

    cy.contains("button", "Create Task").click();
    cy.contains("Create Task").should("be.visible");

    // Fill out the form for a recurring task
    cy.fillCreateTaskForm({
      description: "Test Recurring Task Description",
      isRecurring: true,
      frequency: "Yearly",
    });

    // Submit form for creating the recurring task
    cy.get("form").within(() => {
      cy.contains("button", "Create").click();
    });

    cy.wait("@anyApiPost", { timeout: 10000 }).then((interception) => {
      const response = interception.response.body;

      if (response && response.compliance_task_id) {
        const taskId = response.compliance_task_id;
        const deadline = response.deadline || null;

        compliance_tasks.push({
          id: taskId,
          name: response.description,
          deadline: deadline ? deadline.toString() : null,
        });

        cy.log(`Task ID captured: ${taskId}`);
        Cypress.env("compliance_tasks", compliance_tasks);
      } else {
        cy.log("Response structure:", response);
      }
    });

    cy.contains("Task Created Successfully").should("be.visible");

    // Ensure intercept happens BEFORE visiting
    cy.intercept("GET", "/api/api/tasks/**").as("getTasksList");

    cy.visit("/dashboard/task");

    cy.wait("@getTasksList", { timeout: 10000 }).then((interception) => {
      const response = interception.response.body;

      if (response && response.data && Array.isArray(response.data)) {
        const newTasks = response.data.filter(
          (task) => task.description === "Test Recurring Task Description",
        );

        if (newTasks.length > 0) {
          cy.log(`Found ${newTasks.length} matching tasks in task list`);

          newTasks.forEach((task) => {
            const existingTaskIndex = compliance_tasks.findIndex(
              (t) => t.id === task.id,
            );

            if (existingTaskIndex === -1) {
              compliance_tasks.push({
                id: task.id,
                deadline: task.deadline ? task.deadline.toString() : null,
                name: task.description,
              });
            }
          });

          cy.log(`Total tasks in compliance_tasks: ${compliance_tasks.length}`);

          Cypress.env("compliance_tasks", compliance_tasks);
          cy.log(`Updated task list now has ${compliance_tasks.length} tasks`);
        }
      }
    });
  });


  it("should delete the all created tasks using UI", () => {
    const tasks = Cypress.env("compliance_tasks") || [];

    if (!tasks.length) {
      throw new Error("No tasks available to delete");
    }

    tasks.forEach((task) => {
      cy.deleteTaskByNameUI(task.name);
    });
  });
});
