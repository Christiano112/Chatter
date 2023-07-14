describe("home page", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
    });

    it("passes", () => {
        cy.get("h1").contains("Welcome to Chatter: A Haven for Text-Based Content");
    });
});
