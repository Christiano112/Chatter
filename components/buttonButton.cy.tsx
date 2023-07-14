import React from "react";
import Button from "./button";

describe("<Button />", () => {
    it("renders", () => {
        // see: https://on.cypress.io/mounting-react
        cy.mount(<Button text={"I Love Testing"} type={"button"} />);
        cy.get("button").should("have.text", "I Love Testing");
    });
});
