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
        cy.get('[data-testid="connect-to-wallet"]').click();
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
        const keystoreData = await cy.task('getKeyStoreData');
        await cy.get('input[type="file"]').attachFile({
            fileContent: JSON.parse(String(keystoreData)),
            fileName: 'keystore.json',
            mimeType: 'html',
        });
        cy.get('[data-testid="header-title"]').should('contain.text', translations.VALIDATOR.IMPORT.TITLE);
        cy.get('[data-testid="sub-header-title"]').should('contain.text', translations.VALIDATOR.IMPORT.DESCRIPTION);
        cy.get('[data-testid="file-input"]').should('contain.text', translations.VALIDATOR.IMPORT.DESCRIPTION);
    });

    it('should show file error and button disable', () => {
        // Enter password and click next
        cy.get('[data-testid="wrong-file-type"]').should('be.visible');
        cy.get('[data-testid="decrypt-keystore-button"]').should('be.disabled');
        cy.get('[data-testid="error-message"]').should('contain.text', translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE_FORMAT);
    });
});
