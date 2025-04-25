import { addDays } from "date-fns";

describe("Limited Partner Onboarding Test", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard/limited-partners");
  });

  it("should open and close the Onboard LP dialog", () => {
    cy.contains("button", "Onboard Limited Partner").click();
    cy.contains("Onboard new Limited Partner").should("be.visible");

    cy.contains("button", "Close").click({ force: true });
    cy.contains("Onboard new Limited Partner").should("not.exist");
  });

  it("should show validation errors when form is incomplete", () => {
    cy.contains("button", "Onboard Limited Partner").click();

    // Try to submit without filling required fields
    cy.get("form").within(() => {
      cy.contains("button", "Onboard").click();
    });
    // Check if validation errors appear
    cy.contains("Name is required").should("be.visible");
  });

  it("should successfully create a new Limited Partner", () => {
    // Intercept API requests with correct paths
    cy.intercept("POST", "/api/api/lps/", (req) => {
      // Delay the response by 500ms to ensure toast is visible
      req.on("response", (res) => {
        // Using setTimeout to delay the response
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(res);
          }, 500);
        });
      });
    }).as("createLP");

    cy.intercept("POST", "/api/api/tasks/", (req) => {
      req.on("response", (res) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(res);
          }, 500);
        });
      });
    }).as("createTask");

    cy.intercept("PUT", "/api/api/lps/*", (req) => {
      req.on("response", (res) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(res);
          }, 500);
        });
      });
    }).as("updateLP");

    cy.intercept("PATCH", "/api/api/tasks/*", (req) => {
      req.on("response", (res) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(res);
          }, 500);
        });
      });
    }).as("completeTask");

    // Open onboarding dialog
    cy.contains("button", "Onboard Limited Partner").click();
    cy.contains("Onboard new Limited Partner").should("be.visible");

    // Fill the form
    cy.fillLPForm({
      lp_name: "Test LP",
      gender: "Male",
      dob: "2025-01-01",
      mobile_no: "+919898989898",
      email: "testlp@example.com",
      pan: "ABCDE1234F",
      address: "123 Finance Street, Mumbai",
      nominee: "John Doe",
      commitment_amount: "15000000",
      acknowledgement_of_ppm: "Yes",
      doi: "2023-01-01",
      date_of_agreement: "2025-03-01",
      dpid: "DP123456",
      client_id: "CL987654",
      class_of_shares: { label: "Class A", value: "INF1C8N22014" },
      type: "Individual",
      citizenship: "Resident",
      geography: "India",
      emaildrawdowns: ["draw@example.com", "notify@example.com"],
    });

    // Submit the form
    cy.get("form").within(() => {
      cy.contains("button", "Onboard").click();
    });

    const checkToast = (message) => {
      return cy.contains(message, { timeout: 10000 }).should("be.visible");
    };

    // Check only the key toast messages in sequence
    checkToast("Creating LP entry...");
    cy.wait("@createLP", { timeout: 15000 });

    checkToast("Creating compliance task...");
    cy.wait("@createTask", { timeout: 15000 });

    checkToast("Uploading documents");

    checkToast("Linking uploaded document to LP entry...");
    cy.wait("@updateLP", { timeout: 15000 });

    checkToast("Marking compliance task as completed...");
    cy.wait("@completeTask", { timeout: 15000 });

    // Final success toast
    checkToast("LP Onboarded Successfully");
    // cy.findElementByTextContent("Test LP", "td").should("exist");
  });
});
