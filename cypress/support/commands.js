/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
function checkIfElementExists(element, attempts, waitTimeout) {
    attempts = attempts || 3;
    waitTimeout = waitTimeout || 30000;
    cy.get('body').then((body) => {
        if (body.find(element).length) {
            return cy.get(element);
        }
        cy.wait(waitTimeout);
        if (!checkIfElementExists.attempts) {
            checkIfElementExists.attempts = 1;
        } else {
            checkIfElementExists.attempts += 1;
        }
        console.info('Check if element', element, 'exists failed, attempt', checkIfElementExists.attempts, 'from', attempts, '. Timeout in seconds:', waitTimeout / 1000);

        if (checkIfElementExists.attempts >= attempts) {
            checkIfElementExists.attempts = 1;
            throw error;
        } else {
            checkIfElementExists(element, attempts, waitTimeout);
        }
    });
}
Cypress.Commands.add('checkIfElementExists', checkIfElementExists);
