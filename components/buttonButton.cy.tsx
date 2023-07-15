import React from "react";
import Button from "./button";

describe("button component", () => {
    context("render", () => {
        it("renders the correct text", () => {
            cy.mount(<Button text={"I Love Testing"} type={"button"} />);
            cy.get("button").should("have.text", "I Love Testing");
        });
        it("renders with a different variant", () => {
            cy.mount(<Button text={"I Love Testing"} type={"button"} variant={"secondary"} />);
            cy.get("button").should("have.text", "I Love Testing");
            cy.get("button").should("have.class", "bg-secondary");
        });
        it("renders with a different size", () => {
            cy.mount(<Button text={"I Love Testing"} type={"button"} size={"medium"} />);
            cy.get("button").should("have.text", "I Love Testing");
            cy.get("button").should("have.class", "w-[12rem]");
        });
        it("renders with a different type", () => {
            cy.mount(<Button text={"I Love Testing"} type={"submit"} />);
            cy.get("button").should("have.text", "I Love Testing");
            cy.get("button").should("have.attr", "type", "submit");
        });
        it("renders with a different style", () => {
            cy.mount(
                <Button
                    text={"I Love Testing"}
                    type={"button"}
                    style={{ backgroundColor: "red" }}
                />,
            );
            cy.get("button").should("have.text", "I Love Testing");
            cy.get("button").should("have.css", "background-color", "rgb(255, 0, 0)");
        });
        it("renders with a different disabled state", () => {
            cy.mount(<Button text={"I Love Testing"} type={"button"} disabled={true} />);
            cy.get("button").should("have.text", "I Love Testing");
            cy.get("button").should("be.disabled");
        });
    });

    context("functions", () => {
        it("onClick should call a function", () => {
            const handleClick = cy.stub();
            cy.mount(<Button text={"I Love Testing"} type={"button"} handleClick={handleClick} />);
            cy.get("button").should("have.text", "I Love Testing");
            cy.get("button").click();
            cy.wrap(handleClick).should("have.been.calledOnce");
        });
    });
});
