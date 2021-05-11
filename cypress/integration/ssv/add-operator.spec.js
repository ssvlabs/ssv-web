/// <reference types="cypress" />
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomValueHex } from '~lib/utils/crypto';
import config, { translations } from '~app/common/config';

const operatorPublicKeyLength = 128;

const closeMessage = () => {
  cy.get('.MuiAlert-action > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
};

context('Add Validator', () => {
  before(() => {
    cy.visit(Cypress.config('baseUrl'));
  });

  it('should navigate to operator screen', () => {
    cy.get(`[data-testid="${config.routes.OPERATOR.HOME}"]`).click();

    cy.get('[data-testid=header-title]')
      .should('contain.text', translations.OPERATOR.HOME.TITLE);

    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(`${Cypress.config('baseUrl')}${config.routes.OPERATOR.HOME}`);
      expect(location.pathname).to.eq(config.routes.OPERATOR.HOME);
      expect(location.search).to.be.empty;
    });
  });

  it('should navigate to register new operator screen', () => {
    const registerOperatorSelector = `[data-testid="${config.routes.OPERATOR.GENERATE_KEYS}"]`;
    cy.waitFor(registerOperatorSelector);
    cy.get(registerOperatorSelector).click();

    cy.get('[data-testid=header-title]')
      .should('contain.text', translations.OPERATOR.REGISTER.TITLE);

    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(`${Cypress.config('baseUrl')}${config.routes.OPERATOR.GENERATE_KEYS}`);
      expect(location.pathname).to.eq(config.routes.OPERATOR.GENERATE_KEYS);
      expect(location.search).to.be.empty;
    });
  });

  it('should fill up operator data with errors', () => {
    const operatorName = 'TestOperator: 123';
    cy.get('[data-testid=new-operator-name]').type(`${operatorName}`);
    cy.get('[data-testid=new-operator-key]').type(`${randomValueHex(operatorPublicKeyLength + 1)}`);
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name should contain only alphanumeric characters.');
    cy.get('[data-testid=new-operator-name]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name must be between 3 to 20 characters.');
    cy.get('[data-testid=new-operator-key]').parent().should('contain.text', 'Invalid operator key - see our documentation to generate your key.');
  });

  it('should fill up operator data without errors', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-key]').clear().type(`${randomValueHex(operatorPublicKeyLength)}`);
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.enabled');
  });

  if (!Cypress.config('headless')) {
    it('should open Onboard.js provider dialog, select MetaMask and wait for user input', () => {
      cy.get('[data-testid="register-operator-button"]').click();

      cy.waitFor('.bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom');
      cy.get('.bn-onboard-modal-content-header-heading').should('contain.text', 'Select a Wallet');
      cy.get('.bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom').click();

      cy.waitFor('.MuiAlert-message');
      cy.get('.MuiAlert-message').should('contain.text', 'Wallet is connected!');
      closeMessage();

      cy.get('[data-testid="terms-and-conditions-checkbox"]').click();
      cy.waitFor('[data-testid="final-register-button"]');
      cy.get('[data-testid="final-register-button"]').click();

      cy.wait(60000).then(() => {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        cy.exists('.MuiAlert-message').then(e => {
          cy.waitFor('.MuiAlert-message');
          cy.get('.MuiAlert-message').should('contain.text', 'You successfully added operator!');
          closeMessage();
        });
      });
    });
  }
});
