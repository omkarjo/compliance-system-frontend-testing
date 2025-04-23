describe("Dashboard Page", () => {
    beforeEach(() => {
      cy.login();
    });
  
    it("renders the Task Overview section", () => {
      cy.contains("Task Overview").should("be.visible");
      const statsTitles = ["Total", "Completed", "Overdue", "Open", "Pending", "Required Review"];
      statsTitles.forEach((title) => {
        cy.contains(title).should("be.visible");
      });
    });
  
    it("renders the Task Overview Chart", () => {
      cy.contains("Compliance").should("be.visible");
      cy.contains("Task completion status").should("be.visible");
    });
  
    it("renders the Upcoming Tasks section", () => {
      cy.contains("Upcoming Tasks").should("be.visible");
    });
  });