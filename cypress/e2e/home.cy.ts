describe("home page", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("contains the correct content", () => {
        cy.get("h1").contains("Welcome to Chatter: A Haven for Text-Based Content");
        cy.get(".px-4 > .btn").contains("Get Started");
        cy.get(".p-8 > .text-primary").contains("Chatter");
    });

    it("route to login page", () => {
        cy.get(".bg-white").contains("Login").click();
        cy.location("pathname").should("eq", "/login");
    });

    it("route to signup page", () => {
        cy.get(".items-center.space-x-4 > .bg-primary").contains("Sign up").click();
        cy.location("pathname").should("eq", "/signup");
    });
});
