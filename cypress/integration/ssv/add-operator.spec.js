/// <reference types="cypress" />
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config, { translations } from '~app/common/config';
import { getRandomOperatorKey } from '~lib/utils/contract/operator';
import testConfig from './config';

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

  it('should display wrong operator key error', () => {
    // Wrong display name
    const operatorName = 'TestOperator: 123';
    cy.get('[data-testid=new-operator-name]').clear().type(`${operatorName}`);
    cy.get('[data-testid=new-operator-name]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Display name should contain only alphanumeric characters.');
  });

  it('should display empty operator name error', () => {
    cy.get('[data-testid=new-operator-name]').clear();
    cy.get('[data-testid=new-operator-name]').focus();
    cy.get('[data-testid=new-operator-name]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-name]').parent().should('contain.text', 'Please enter a display name.');
  });

  it('should display empty operator key error', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-name]').blur();
    cy.get('[data-testid=new-operator-key]').clear();
    cy.get('[data-testid=new-operator-key]').focus();
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-key]').parent().should('contain.text', 'Please enter an operator key.');
  });

  it('should show error about existing operator public key', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-name]').blur();
    cy.get('[data-testid=new-operator-key]').clear().type(getRandomOperatorKey(true, false));
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.enabled');
    cy.get('[data-testid="register-operator-button"]').click();
    cy.get('.MuiAlert-message').should('contain.text', 'Operator already exists');
  });

  it('should show error about wrong operator public key format', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-name]').blur();
    cy.get('[data-testid=new-operator-key]').clear().type(getRandomOperatorKey(false, true));
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.disabled');
    cy.get('[data-testid=new-operator-key]').parent().should('contain.text', 'Invalid operator key - see our documentation to generate your key.');
  });

  it('should fill up operator data without errors', () => {
    cy.get('[data-testid=new-operator-name]').clear().type('TestOperator');
    cy.get('[data-testid=new-operator-name]').blur();
    cy.get('[data-testid=new-operator-key]').clear().type(getRandomOperatorKey(false, false));
    cy.get('[data-testid=new-operator-key]').blur();
    cy.get('[data-testid="register-operator-button"]').should('be.enabled');
    cy.get('[data-testid="register-operator-button"]').click();
  });
});
