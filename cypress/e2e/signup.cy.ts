describe("Sign Up Page", () => {
    beforeEach(() => {
        cy.visit("/signup");
    });

    context("renders correctly", () => {
        it("contains the correct content", () => {
            cy.get("h1").contains("Register to enjoy Chatter");
            cy.get("#email").should("have.attr", "type", "email");
            cy.get("#password").should("have.attr", "type", "password");
            cy.get("#confirmPassword").should("have.attr", "type", "password");
            cy.get(".btn").contains("Create account");
            cy.get("p.pb-8 > .underline").contains("Login");
        });
    });

    context("signup functionality", () => {
        it("signup with invalid email", () => {
            cy.get("#email").type("test.com");
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
        it("signup with invalid password", () => {
            cy.get("#password").type("test");
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
        it("signup with passwords not matching", () => {
            cy.get("#password").type("test123");
            cy.get("#confirmPassword").type("test1234");
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
        it("ensure all fields are not empty", () => {
            cy.get(".btn").click();
            cy.get(".text-red-700").should("exist");
        });
    });
});
