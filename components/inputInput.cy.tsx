import React from "react";
import Input from "./input";

describe("input component", () => {
    const errors = {
        test: {
            message: "This field is required.",
        },
    };
    context("render", () => {
        it("renders the correct label", () => {
            cy.mount(
                <Input
                    label={"I Love Testing"}
                    name={"test"}
                    type={"text"}
                    register={cy.stub()}
                    errors={errors}
                />,
            );
            cy.get("label").should("have.text", "I Love Testing");
        });
        it("renders with a different placeholder", () => {
            cy.mount(
                <Input
                    placeholder={"I Love Testing"}
                    name={"test"}
                    type={"text"}
                    register={cy.stub()}
                    errors={errors}
                />,
            );
            cy.get("input").should("have.attr", "placeholder", "I Love Testing");
        });
        it("renders with a different type", () => {
            cy.mount(
                <Input name={"test"} type={"password"} register={cy.stub()} errors={errors} />,
            );
            cy.get("input").should("have.attr", "type", "password");
        });
        it("renders with a different autoComplete", () => {
            cy.mount(
                <Input
                    name={"test"}
                    type={"text"}
                    autoComplete={"name"}
                    register={cy.stub()}
                    errors={errors}
                />,
            );
            cy.get("input").should("have.attr", "autoComplete", "name");
        });
    });

    context("functions", () => {
        it("onChange should call a function", () => {
            const handleChange = cy.stub();
            cy.mount(
                <Input
                    name={"test"}
                    type={"text"}
                    register={cy.stub()}
                    errors={errors}
                    onChange={handleChange}
                />,
            );
            cy.get("input").type("I Love Testing");
            cy.wrap(handleChange).should("be.called");
        });
    });
});
