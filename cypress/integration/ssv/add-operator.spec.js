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

context('Add Operator', () => {
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
    cy.get('[data-testid=new-operator-key]').type(`0x${randomValueHex(operatorPublicKeyLength + 1)}`);
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name should contain only alphanumeric characters.');
    cy.get('[data-testid=new-operator-name]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name must be between 3 to 20 characters.');
    cy.get('[data-testid=new-operator-key]').parent().should('contain.text', 'Invalid operator key - see our documentation to generate your key.');
  });

  if (!Cypress.config('headless')) {
    it('should show error about existing operator public key', () => {
      // Enter existing operator key
      const operatorName = 'TestOperator';
      cy.get('[data-testid=new-operator-name]').clear().type(`${operatorName}`);
      cy.get('[data-testid=new-operator-key]').clear().type('0x8d23b764021b4f3c86beb6d62cc820114f1da47b8521f6d29870e3889deb91055354c22e1da094cd4ca05b71398f056f8231a01bb4515a2a5997c890d910769f');
      cy.get('[data-testid=new-operator-key]').blur();
      cy.get('[data-testid="register-operator-button"]').should('be.enabled');
      cy.get('[data-testid="register-operator-button"]').click();

      // Wait for onboard widget
      cy.waitFor('.bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom');
      cy.get('.bn-onboard-modal-content-header-heading').should('contain.text', 'Select a Wallet');
      cy.get('.bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom').click();

      // Find error message
      cy.waitFor('.MuiGrid-root > .MuiPaper-root > .MuiAlert-message');
      cy.get('.MuiGrid-root > .MuiPaper-root > .MuiAlert-message').should('contain.text', 'Operator already exists');
    });
  }

  it('should fill up operator data without errors', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-key]').clear().type(`0x${randomValueHex(operatorPublicKeyLength)}`);
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.enabled');
  });

  if (!Cypress.config('headless')) {
    it('should open Onboard.js provider dialog, select MetaMask and wait for user input', () => {
      cy.get('[data-testid="register-operator-button"]').click();

      cy.waitFor('.MuiAlert-message');
      cy.get('.MuiAlert-message').should('contain.text', 'Wallet is connected!');
      closeMessage();

      cy.get('[data-testid="terms-and-conditions-checkbox"]').click();
      cy.waitFor('[data-testid="final-register-button"]');
      cy.get('[data-testid="final-register-button"]').click();

      // eslint-disable-next-line @typescript-eslint/no-loop-func
      cy.checkIfElementExists('.MuiAlert-message', 30, 10000).then(e => {
        cy.waitFor('.MuiAlert-message');
        cy.get('.MuiAlert-message').should('contain.text', 'You successfully added operator!');
        closeMessage();
      });
    });
  }
});
