import axios from 'axios';
import config from '~app/common/config';
import { getCurrentNetwork, NETWORKS } from '~lib/utils/envHelper';

const DEV_MODE_ON = 1;
const DEV_IGNORE_COUNTRY_RESTRICTION = 'DEV_IGNORE_COUNTRY_RESTRICTION';
let restrictedCountries: any = null;
/**
 * Get the list of restricted countries from blox.
 */
const getRestrictedLocations = async () => {
  try {
    if (restrictedCountries) {
      return restrictedCountries;
    }
    const response = (await axios.get(String(config.links.COMPLIANCE_URL), { timeout: 2000 })).data;
    if (restrictedCountries === null) {
      // @ts-ignore
      restrictedCountries = response.countries;
    }
    return response;
  } catch (e) {
    return [];
  }
};

/**
 * Fetches current user country using third party services until this country is fetched.
 */
const getCurrentLocation = async (): Promise<string[]> => {
  const fetchLocation = async (requestUri: string, getCountryCallback: any) => {
    return getCountryCallback(await axios.get(requestUri, { timeout: 2000 }));
  };

  const filterEmpty = (name: undefined | null | string) => {
    return !!name;
  };

  const countryGetters = [
    {
      url: 'https://api.ipregistry.co/?key=szh9vdbsf64ez2bk',
      callback: ({ data }: { data: any }): string[] => {
        return [
          data.location?.country?.name,
          data.location?.region?.name,
          data.location?.city,
        ].filter(filterEmpty);
      },
    },
    {
      url: 'https://api.bigdatacloud.net/data/country-by-ip?key=bdc_daa2e4e3f8fb49eaad6f68f0f6732d38',
      callback: ({ data }: { data: any }): string[] => {
        return [
          data.country?.name,
          data.country?.isoName,
          data.location?.city,
          data.location?.localityName,
        ].filter(filterEmpty);
      },
    },
    {
      url: 'https://ipapi.co/json/',
      callback: ({ data }: { data: any }): string[] => {
        return [data?.country_name, data?.region, data?.city].filter(filterEmpty);
      },
    },
    {
      url: 'https://geolocation-db.com/json/',
      callback: ({ data }: { data: any }): string[] => {
        return [data?.country_name, data?.city].filter(filterEmpty);
      },
    },
  ];
  for (let i = 0; i < countryGetters.length; i += 1) {
    const countryGetter = countryGetters[i];
    try {
      // eslint-disable-next-line no-await-in-loop
      const currentLocation = await fetchLocation(
        countryGetter.url,
        countryGetter.callback,
      );
      if (currentLocation) {
        return currentLocation;
      }
    } catch (error) {
      console.error('Detecting location failed using:', countryGetter.url);
    }
  }
  return [];

};
export const getLocalStorageFlagValue = () => {
  if (!window?.localStorage) {
    return null;
  }
  const value = Number(window.localStorage.getItem(DEV_IGNORE_COUNTRY_RESTRICTION));
  return value === DEV_MODE_ON;
};

/**
 * Returns true if country is restricted or false otherwise
 */
export const checkUserCountryRestriction = async (): Promise<any> => {
  const { networkId } = getCurrentNetwork();
  const userLocation = await getCurrentLocation();
  const restrictedLocations = await getRestrictedLocations();
  const restrictIgnoreFlag = getLocalStorageFlagValue();
  console.debug('🚫 Restricted locations:', restrictedLocations);
  console.debug('🌐 User location:', userLocation);
  if (networkId === NETWORKS.MAINNET) {
    for (const location of userLocation) {
      for (const restrictedLocation of restrictedLocations) {
        if (String(restrictedLocation).toLowerCase() === 'israel'){
          return { restricted: false, userGeo: userLocation[0] || '' };
        }
        if (String(restrictedLocation).toLowerCase().indexOf(String(location).toLowerCase()) !== -1 && !restrictIgnoreFlag) {
          return { restricted: true, userGeo: userLocation[0] || '' };
        }
      }
    }
  }
  return { restricted: false, userGeo: userLocation[0] || '' };
};