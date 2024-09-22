/* eslint-disable @typescript-eslint/no-explicit-any */

import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import axios from "axios";

export const getRestrictedCountries = () => {
  return api.get<string[]>(endpoint("/compliance/countries/restricted"));
};

export const getCurrentLocation = async (): Promise<string[]> => {
  const fetchLocation = async (requestUri: string, getCountryCallback: any) => {
    return axios
      .get(requestUri, { timeout: 2000 })
      .then((resp) => getCountryCallback(resp))
      .catch((e) =>
        console.error(
          `Failed to detect location from ${requestUri}. Error ${e}`,
        ),
      );
  };

  const filterEmpty = (name: undefined | null | string) => {
    return !!name;
  };

  const shuffleArray = (
    arr: { url: string; callback: (data: any) => string[] }[],
  ) => {
    const shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // Swap elements at randomIndex and i
      [shuffledArray[i], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const countryGetters = shuffleArray([
    {
      url: "https://api.ipgeolocation.io/ipgeo?apiKey=ac26520f1aaa44408bbeb25f9071a91d",
      callback: ({ data }: { data: any }): string[] => {
        return [data.country_name, data.city].filter(filterEmpty);
      },
    },
    {
      url: "https://api.ipregistry.co/?key=tshvuvexipx89ca8",
      callback: ({ data }: { data: any }): string[] => {
        return [
          data.location?.country?.name,
          data.location?.region?.name,
          data.location?.city,
        ].filter(filterEmpty);
      },
    },
    {
      url: "https://api.bigdatacloud.net/data/country-by-ip?key=bdc_daa2e4e3f8fb49eaad6f68f0f6732d38",
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
      url: "https://ipapi.co/json/",
      callback: ({ data }: { data: any }): string[] => {
        return [data?.country_name, data?.region, data?.city].filter(
          filterEmpty,
        );
      },
    },
    {
      url: "https://geolocation-db.com/json/",
      callback: ({ data }: { data: any }): string[] => {
        return [data?.country_name, data?.city].filter(filterEmpty);
      },
    },
  ]);

  for (let i = 0; i < countryGetters.length; i += 1) {
    const countryGetter = countryGetters[i];
    const currentLocation = await fetchLocation(
      countryGetter.url,
      countryGetter.callback,
    );
    if (currentLocation) {
      return currentLocation;
    }
  }

  return [];
};
