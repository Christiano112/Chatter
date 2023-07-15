// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// import "../../app/globals.css";
import { EnhancedStore } from "@reduxjs/toolkit";
import { MountOptions, MountReturn } from "cypress/react18";
import React from "react";
import { Provider } from "react-redux";
import store, { RootState } from "@/redux/store";

// Import commands.js using ES2015 syntax:
import "./commands";

import { mount } from "cypress/react18";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;

            /**
             * Mounts a React node
             * @param component React Node to mount
             * @param options Additional options to pass into mount
             */
            mountRedux(
                component: React.ReactNode,
                options?: MountOptions & { reduxStore?: EnhancedStore<RootState> },
            ): Cypress.Chainable<MountReturn>;
        }
    }
}

Cypress.Commands.add("mount", mount);

// Example use:
// cy.mount(<MyComponent />)

// Cypress.Commands.add('mountRedux', (component, options = {}) => {
//     // Use the default store if one is not provided
//     const { reduxStore: store , ...mountOptions } = options

//     const wrapped = <Provider store={newReduxStore}>{component}</Provider>

//     return mount(wrapped, mountOptions)
// })
