/// <reference types="cypress" />
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config, { translations } from '~app/common/config';
import testConfig from './config';

config.CONTRACT.ADDRESS = testConfig.CONTRACT_ADDRESS;

context('Add Validator', () => {
  before(() => {
    cy.visit(Cypress.config('baseUrl'));
  });

  it('should navigate to validator screen', () => {
    cy.get(`[data-testid="${config.routes.VALIDATOR.HOME}"]`).click();

    cy.get('[data-testid=header-title]')
      .should('contain.text', translations.VALIDATOR.HOME.TITLE);

    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(`${Cypress.config('baseUrl')}${config.routes.VALIDATOR.HOME}`);
      expect(location.pathname).to.eq(config.routes.VALIDATOR.HOME);
      expect(location.search).to.be.empty;
    });
  });

  it('should go to import validator screen', () => {
    cy.get('[data-testid="/validator/import"]').click();
  });

  it('should generate keystore using "deposit" CLI and upload its data in file upload form', async () => {
    cy.task('getKeyStoreData').then((keystoreData) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: JSON.parse(String(keystoreData)),
        fileName: 'keystore.json',
        mimeType: 'text/json',
      });
    });
  });
});
