import config from '~app/common/config';

let restrictedCountries: any = null;
/**
 * Get the list of restricted countries from blox.
 */
const getRestrictedCountriesList = async () => {
  try {
    if (restrictedCountries) {
      return restrictedCountries;
    }
    const response = await fetch(String(config.links.COMPLIANCE_URL)).then(res => res.json());
    if (restrictedCountries === null) {
      restrictedCountries = response.countries;
    }
    return response;
  } catch (e) {
    return ['Israel'];
  }
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
      url: 'https://geolocation-db.com/json/',
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
export const checkUserCountryRestriction = async (): Promise<any> => {
  const userCountry = await getCurrentUserCountry();
  const countries = await getRestrictedCountriesList();
  const restricted = countries.indexOf(userCountry) !== -1 && process.env.NODE_ENV !== 'development';
  return { restricted, userGeo: userCountry };
};
