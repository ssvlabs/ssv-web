import axios from 'axios';
import config from '~app/common/config';

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

  const countryGetters = [
    {
      url: 'http://ip-api.com/json',
      callback: ({ data }: { data: any }): string[] => {
        return [data.country, data.regionName];
      },
    },
    {
      url: 'http://geolocation-db.com/json/',
      callback: ({ data }: { data: any }): string[] => {
        return [data.country_name, data.city];
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

/**
 * Returns true if country is restricted or false otherwise
 */
export const checkUserCountryRestriction = async (): Promise<any> => {
  const userLocation = await getCurrentLocation();
  const restrictedLocations = await getRestrictedLocations();
  // eslint-disable-next-line no-restricted-syntax
  for (const location of userLocation) {
    // eslint-disable-next-line no-restricted-syntax
    for (const restrictedLocation of restrictedLocations) {
      if (restrictedLocation.indexOf(location) !== -1) {
        return { restricted: true, userGeo: userLocation[0] || '' };
      }
    }
  }
  return { restricted: false, userGeo: userLocation[0] || '' };
};
