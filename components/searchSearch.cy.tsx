import React from "react";
import SearchInput from "./search";

describe("search component", () => {
    context("render", () => {
        it("should mount", () => {
            cy.mount(<SearchInput onSearch={() => {}} />);
            cy.get("input").should("exist");
        });
        it("renders with a different placeholder", () => {
            cy.mount(<SearchInput placeholder={"I Love Testing"} onSearch={() => {}} />);
            cy.get("input").should("have.attr", "placeholder", "I Love Testing");
        });
    });

    context("functions", () => {
        it("onChange should call a function", () => {
            const handleSearch = cy.stub();
            cy.mount(<SearchInput onSearch={handleSearch} />);
            cy.get("input").type("I Love Testing");
            cy.get(".absolute").click();
            cy.wrap(handleSearch).should("have.been.calledOnce");
            cy.wrap(handleSearch).should("have.been.calledWith", "I Love Testing");
        });
    });
});
