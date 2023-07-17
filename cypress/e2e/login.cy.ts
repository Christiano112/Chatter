describe("login page", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    context("renders correctly", () => {
        it("contains the correct content", () => {
            cy.get("h1").contains("Welcome Back to Chatter");
            cy.get(":nth-child(1) > .text-sm").contains("Email");
            cy.get(":nth-child(2) > .text-sm").contains("Password");
            cy.get("#email").should("have.attr", "type", "email");
            cy.get("#password").should("have.attr", "type", "password");
            cy.get(".btn").contains("Login");
            cy.get(".mt-10 > .underline").contains("Sign Up");
        });
    });

    context("login functionality", () => {
        it("login with invalid email", () => {
            cy.get("#email").type("test.com");
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
        it("login with invalid password", () => {
            cy.get("#password").type("test");
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
        it("login with incorrect credentials", () => {
            cy.get("#email").type("test@test.com");
            cy.get("#password").type("test123");
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
    });
});
