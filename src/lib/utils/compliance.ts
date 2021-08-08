import config from '~app/common/config';

/**
 * Get the list of restricted countries from blox.
 */
const getRestrictedCountriesList = async () => {
  return fetch(String(config.links.COMPLIANCE_URL)).then(res => res.json());
};

/**
 * Fetches current user country using third party services until this country is fetched.
 */
const getCurrentUserCountry = async (): Promise<string | null> => {
  const fetchCountry = async (requestUri: string, getCountryCallback: any) => {
    return fetch(requestUri)
      .then(res => res.json())
      .then(getCountryCallback);
  };
  const countryGetters = [
    {
      url: 'https://extreme-ip-lookup.com/json/',
      callback: (response: any) => {
        return response.country;
      },
    },
    {
      url: 'http://ip-api.com/json',
      callback: (response: any) => {
        return response.country;
      },
    },
    {
      url: 'http://geolocation-db.com/json/',
      callback: (response: any) => {
        return response.country_name;
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
  return detectedCountry;
};

/**
 * Returns true if country is restricted or false otherwise
 */
export const checkUserCountryRestriction = async (): Promise<boolean> => {
  const userCountry = await getCurrentUserCountry();
  const restrictedCountries = await getRestrictedCountriesList();
  const params = new URLSearchParams(window.location.search);
  if (params.get('restrictCountry')) {
    return true;
  }
  return restrictedCountries.indexOf(userCountry) !== -1;
};
