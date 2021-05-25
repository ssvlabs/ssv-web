/// <reference types="cypress" />
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomValueHex } from '~lib/utils/crypto';
import config, { translations } from '~app/common/config';
import testConfig from './config';
import { operatorKey } from './operator_keys/operatorKey';

config.CONTRACT.ADDRESS = testConfig.CONTRACT_ADDRESS;
const operatorPublicKeyLength = config.FEATURE.OPERATORS.VALID_KEY_LENGTH;

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
    cy.get('[data-testid=new-operator-name]').clear().type(`${operatorName}`);
    cy.get('[data-testid=new-operator-key]').clear().type(`0x${randomValueHex(operatorPublicKeyLength + 1)}`);
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name should contain only alphanumeric characters.');
    cy.get('[data-testid=new-operator-name]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').clear().type('A');
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name must be between 3 to 20 characters.');
    cy.get('[data-testid=new-operator-key]').parent().should('contain.text', 'Invalid operator key - see our documentation to generate your key.');
  });

  if (!Cypress.config('headless')) {

    it('should fill up operator data without errors', () => {
      cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
      cy.get('[data-testid=new-operator-key]').clear().type(operatorKey);
      cy.get('[data-testid=new-operator-key]').blur();
      cy.get('[data-testid="register-operator-button"]').should('be.enabled');
    });

    it('should create operator', () => {
      cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
      cy.get('[data-testid=new-operator-key]').clear().type(operatorKey);
      cy.get('[data-testid=new-operator-key]').blur();
      cy.get('[data-testid="register-operator-button"]').should('be.enabled');
      cy.get('[data-testid="register-operator-button"]').click();
      cy.wait(600);
      cy.get('[data-testid="terms-and-conditions-checkbox"]').click();
      cy.get('[data-testid="submit-operator"]').click();
      cy.wait(600);
      cy.location().should((location) => {
        expect(location.hash).to.be.empty;
        expect(location.href).to.eq(`${Cypress.config('baseUrl')}${config.routes.OPERATOR.SUCCESS_PAGE}`);
        expect(location.pathname).to.eq(config.routes.OPERATOR.SUCCESS_PAGE);
        expect(location.search).to.be.empty;
      });
      cy.get('[data-testid="success-image"]').should('be.visible');
    });
    it('should show error about existing operator public key', () => {
      // Enter existing operator key
      cy.visit(Cypress.config('baseUrl'));
      cy.get(`[data-testid="${config.routes.OPERATOR.HOME}"]`).click();
      const registerOperatorSelector = `[data-testid="${config.routes.OPERATOR.GENERATE_KEYS}"]`;
      cy.waitFor(registerOperatorSelector);
      cy.get(registerOperatorSelector).click();
      const operatorName = 'myOperator';
      cy.get('[data-testid=new-operator-name]').clear().type(`${operatorName}`);
      cy.get('[data-testid=new-operator-key]').clear().type(operatorKey);
      cy.get('[data-testid=new-operator-key]').blur();
      cy.get('[data-testid="register-operator-button"]').should('be.enabled');
      cy.get('[data-testid="register-operator-button"]').click();
      cy.get('.MuiGrid-root > .MuiPaper-root > .MuiAlert-message').should('contain.text', 'Operator already exists');
    });
  }
});
