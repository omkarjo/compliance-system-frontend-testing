describe("TaskDashboardFundManager", () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/tasks/**').as('getTasks');
    });

    it("should display List view by default when no localStorage value exists", () => {
        cy.clearLocalStorage('taskTabs');
        cy.login();
        cy.visit("/dashboard/task");
        cy.wait('@getTasks', { timeout: 10000 });
        cy.contains('button', 'List').should('have.attr', 'data-state', 'active');
        cy.contains("Category").should("be.visible");
        cy.contains("Title").should("be.visible");
        cy.contains("Due Date").should("be.visible");
    });

    it("should respect existing localStorage taskTabs value", () => {
        cy.window().then((win) => {
            win.localStorage.setItem('taskTabs', 'calendar');
        });
        cy.login();
        cy.visit("/dashboard/task");
        cy.wait('@getTasks', { timeout: 10000 });
        cy.contains('button', 'Calendar').should('have.attr', 'data-state', 'active');
        cy.contains("Sun").should("be.visible");
        cy.contains("Mon").should("be.visible");
    });

    it("should update localStorage when switching tabs", () => {
        cy.clearLocalStorage('taskTabs');
        cy.login();
        cy.visit("/dashboard/task");
        cy.wait('@getTasks', { timeout: 10000 });
        cy.contains('button', 'Calendar').click();
        cy.window().then((win) => {
            expect(win.localStorage.getItem('taskTabs')).to.eq('calendar');
        });
        cy.contains('button', 'List').click();
        cy.window().then((win) => {
            expect(win.localStorage.getItem('taskTabs')).to.eq('list');
        });
    });

    it("should respect existing localStorage viewMode-calendar value", () => {
        cy.window().then((win) => {
            win.localStorage.setItem('viewMode-calendar', 'week');
        });
        cy.login();
        cy.visit("/dashboard/task");
        cy.wait('@getTasks', { timeout: 10000 });

        // Switch to Calendar tab
        cy.contains('button', 'Calendar').click();

        cy.contains('Week of').should("be.visible");
        cy.contains("Sun").should("be.visible");
        cy.contains("Mon").should("be.visible");
    });
    
});