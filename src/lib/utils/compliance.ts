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
    const response = (await axios.get(String(config.links.SSV_COMPLIANCE_URL), { timeout: 2000 })).data;
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
    return axios
      .get(requestUri, { timeout: 2000 })
      .then((resp) => getCountryCallback(resp))
      .catch((e) => console.error(`Failed to detect location from ${requestUri}. Error ${e}`));
  };

  const filterEmpty = (name: undefined | null | string) => {
    return !!name;
  };

  const shuffleArray = (arr: any[]) => {
    const shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // Swap elements at randomIndex and i
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const countryGetters = shuffleArray([
    {
      url: 'https://api.ipgeolocation.io/ipgeo?apiKey=ac26520f1aaa44408bbeb25f9071a91d',
      callback: ({ data }: { data: any }): string[] => {
        return [data.country_name, data.city].filter(filterEmpty);
      }
    },
    {
      url: 'https://api.ipregistry.co/?key=tshvuvexipx89ca8',
      callback: ({ data }: { data: any }): string[] => {
        return [data.location?.country?.name, data.location?.region?.name, data.location?.city].filter(filterEmpty);
      }
    },
    {
      url: 'https://api.bigdatacloud.net/data/country-by-ip?key=bdc_daa2e4e3f8fb49eaad6f68f0f6732d38',
      callback: ({ data }: { data: any }): string[] => {
        return [data.country?.name, data.country?.isoName, data.location?.city, data.location?.localityName].filter(filterEmpty);
      }
    },
    {
      url: 'https://ipapi.co/json/',
      callback: ({ data }: { data: any }): string[] => {
        return [data?.country_name, data?.region, data?.city].filter(filterEmpty);
      }
    },
    {
      url: 'https://geolocation-db.com/json/',
      callback: ({ data }: { data: any }): string[] => {
        return [data?.country_name, data?.city].filter(filterEmpty);
      }
    }
  ]);
  for (let i = 0; i < countryGetters.length; i += 1) {
    const countryGetter = countryGetters[i];
    const currentLocation = await fetchLocation(countryGetter.url, countryGetter.callback);
    if (currentLocation) {
      return currentLocation;
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
  console.debug('🚫 Restricted locations:', restrictedLocations);
  console.debug('🌐 User location:', userLocation);
  if (!userLocation.length) {
    return 'Unknown';
  }
  for (const location of userLocation) {
    for (const restrictedLocation of restrictedLocations) {
      if (String(restrictedLocation).toLowerCase().indexOf(String(location).toLowerCase()) !== -1) {
        return userLocation[0] || 'Unknown';
      }
    }
  }
  return '';
};
