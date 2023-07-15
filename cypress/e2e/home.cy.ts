describe("home page", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("passes", () => {
        cy.get("h1").contains("Welcome to Chatter: A Haven for Text-Based Content");
    });
});
