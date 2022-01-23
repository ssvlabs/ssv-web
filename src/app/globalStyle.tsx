import { createGlobalStyle } from 'styled-components';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Application.store';

export const globalStyle = () => {
    const stores = useStores();
    const applicationStore: ApplicationStore = stores.Application;

    return createGlobalStyle`
      body {
        background-color: ${applicationStore.isDarkMode ? '#011627' : '#f4f7fa'};
      * {
        font-family: 'Manrope', sans-serif;
      },
      . bn-onboard-custom {
        z-index: 999;

        .bn-onboard-modal-content-header-icon.svelte-8i8o6j {
          display: none;
        }

        .bn-onboard-modal-content-header-heading.svelte-8i8o6j {
          margin-left: 0;
        }

        .bn-onboard-custom.bn-onboard-modal-select-wallets.svelte-q1527 {
          display: block;

          li {
            margin-bottom: 8px;
            border-radius: 8px;
            border: solid 1px ${applicationStore.muiTheme.colors.gray20};
            background-color: ${applicationStore.muiTheme.colors.gray0};
          }

          button {
            :hover {
              outline: none;
              box-shadow: none;
              border: none;
              background-color: transparent;
            }
          }
        }

        .bn-onboard-custom.bn-onboard-select-info-container.svelte-w9ftfy {
          justify-content: center;
          text-decoration: underline;
          text-decoration-color: #4a90e2;
        }
      }
      }`;
};