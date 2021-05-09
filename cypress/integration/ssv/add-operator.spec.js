/// <reference types="cypress" />
/* eslint-disable no-undef */
import crypto from 'crypto';
import config, { translations } from '~app/common/config';

const randomValueHex = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);
};

const baseUrl = 'http://localhost:3000';

context('Actions', () => {
  before(() => {
    cy.visit(baseUrl);
  });

  it('should navigate to operator screen', () => {
    cy.get(`[data-testid="${config.routes.OPERATOR.START}"]`).click();

    cy.get('[data-testid=header-title]')
      .should('contain.text', translations.OPERATOR.HOME.TITLE);

    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(`${baseUrl}${config.routes.OPERATOR.START}`);
      expect(location.pathname).to.eq(config.routes.OPERATOR.START);
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
      expect(location.href).to.eq(`${baseUrl}${config.routes.OPERATOR.GENERATE_KEYS}`);
      expect(location.pathname).to.eq(config.routes.OPERATOR.GENERATE_KEYS);
      expect(location.search).to.be.empty;
    });
  });

  it('should fill up operator data with errors', () => {
    const operatorName = 'TestOperator';
    cy.get('[data-testid=new-operator-name]').type(operatorName);
    cy.get('[data-testid=new-operator-key]').type(`${randomValueHex(42)}`);
    cy.get('[data-testid="terms-checkbox"]').click();
  });
});
