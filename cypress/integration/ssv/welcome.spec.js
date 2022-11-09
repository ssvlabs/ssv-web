/// <reference types="cypress" />
/* eslint-disable no-undef */
import config, { translations } from '~app/common/config';

context('Welcome screen', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
  });

  it('should show main menu', () => {
    cy.get('[data-testid=header-title]').should('contain.text', translations.HOME.TITLE);
    cy.get(`[data-testid="${config.routes.OPERATOR.HOME}"] > .MuiPaper-root`)
      .should('contain.text', translations.HOME.MENUS.NEW_OPERATOR.TITLE);
    cy.get(`[data-testid="${config.routes.SSV.VALIDATOR.HOME}"] > .MuiPaper-root`)
      .should('contain.text', translations.HOME.MENUS.SHARE_VALIDATOR_KEY.TITLE);
  });
});
