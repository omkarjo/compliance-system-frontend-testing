import { format, isAfter, isBefore, parse } from "date-fns";
import "cypress-file-upload";

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
