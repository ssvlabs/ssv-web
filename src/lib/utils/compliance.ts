import config from '~app/common/config';
import axios from 'axios';

let restrictedCountries: any = null;
/**
 * Get the list of restricted countries from blox.
 */
const getRestrictedCountriesList = async () => {
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
const getCurrentUserCountry = async (): Promise<string | null> => {
  const fetchCountry = async (requestUri: string, getCountryCallback: any) => {
    return axios.get(requestUri, { timeout: 2000 }).then(getCountryCallback);
  };

  const countryGetters = [
    {
      url: 'https://geolocation-db.com/json/',
      callback: (response: any) => {
        return response.data.country_name;
      },
    },
  ];

  let detectedCountry = null;
  for (let i = 0; i < countryGetters.length; i += 1) {
    const countryGetter = countryGetters[i];
    try {
      // eslint-disable-next-line no-await-in-loop
      const currentCountry = await fetchCountry(
        countryGetter.url,
        countryGetter.callback,
      );
      if (currentCountry) {
        detectedCountry = currentCountry;
        break;
      }
    } catch (error) {
      //
    }
  }
  // @ts-ignore
  return detectedCountry;
};

/**
 * Returns true if country is restricted or false otherwise
 */
export const checkUserCountryRestriction = async (): Promise<any> => {
  const userCountry = await getCurrentUserCountry();
  const countries = await getRestrictedCountriesList();
  const restricted = countries.indexOf(userCountry) !== -1 && process.env.NODE_ENV !== 'development';
  return { restricted, userGeo: userCountry };
};
