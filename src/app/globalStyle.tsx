import { createGlobalStyle } from 'styled-components';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

export const globalStyle = () => {
    const stores = useStores();
    const applicationStore: ApplicationStore = stores.Application;

    return createGlobalStyle`
      body {
        height: 100%;
        background-color: ${applicationStore.isDarkMode ? '#011627' : '#f4f7fa'} !important;
      * {
        font-family: 'Manrope', sans-serif !important;
      },
      .bn-onboard-custom {
        z-index: 999;

        .bn-onboard-modal-content-header-icon.svelte-8i8o6j {
          display: none;
        }
        .bn-onboard-custom.bn-onboard-modal-content-header.svelte-8i8o6j {
          margin-bottom: 12px;
        }
        .bn-onboard-modal-content-header-heading.svelte-8i8o6j {
          margin-left: 0;
        }
        .bn-onboard-custom.bn-onboard-modal-content-close.svelte-rntogh {
          svg {
            height: 11.6px;
            width: 11.6px;
            g {
              fill: ${applicationStore.theme.colors.black};
            }
          }
        }
        .bn-onboard-custom.bn-onboard-select-description.svelte-w9ftfy {
          margin-top: 0;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.62;
          color: ${applicationStore.theme.colors.gray80};
        }

        .bn-onboard-custom.bn-onboard-modal-select-wallets.svelte-q1527 {
          display: block;
             .bn-onboard-selected-wallet {
               border: solid 1px ${applicationStore.theme.colors.primaryBlue};
               background-color: ${applicationStore.theme.colors.tint90};
               :hover {
                 border: solid 1px ${applicationStore.theme.colors.primaryBlue};
               }
               .svelte-1799bj2 {
                 i {
                   font-size: 14px;
                   font-weight: 500;
                   line-height: 1.62;
                   font-style: normal;
                   text-decoration: none;
                   text-transform: capitalize;
                   color: ${applicationStore.theme.colors.gray40};
                 }
               }
             }

          button {
            width: 100%;
            height: 60px;
            min-width: 360px;
            margin-bottom: 8px;
            border-radius: 8px;
            border: solid 1px ${applicationStore.theme.colors.gray20};
            background-color: ${applicationStore.theme.colors.gray0};

            :hover {
              border: none;
              outline: none;
              box-shadow: none;
            }
          }
        }
      },
      . bn-onboard-custom . bn-onboard-select-info-container . svelte-w9ftfy {
        justify-content: center;
        text-decoration: underline;
        text-decoration-color: #4a90e2;
      }
      }

      }`;
};