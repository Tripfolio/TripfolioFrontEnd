import { unref } from "vue";

export const SearchType = {
  TEXT: "TEXT",
  NEARBY_KEYWORD: "NEARBY_KEYWORD",
  NEARBY_TYPE: "NEARBY_TYPE",
  CITY_DEFAULT: "CITY_DEFAULT",
};

export function useMapSearch({ map, service, clearMap, handleResults }) {
  function performSearch({
    type = SearchType.CITY_DEFAULT,
    query = "",
    cityName = "",    
    location = null,  
    radius = 3000,
  } = {}) {
    const resolvedMap = unref(map);
    const resolvedService = unref(service);

    if (!resolvedMap || !resolvedService || !location) {
      return;
    }

    clearMap();

    const request = {};

    function handleSearchCallback(results, status, pagination) {
      if (results?.[0]?.geometry?.location) {
        resolvedMap.setCenter(results[0].geometry.location);
      }
      handleResults(results, status, pagination);
    }

    if (type === SearchType.TEXT) {
      request.query = `${query} ${cityName}`;
      request.location = location;
      resolvedService.textSearch(request, handleSearchCallback);
    } else if (type === SearchType.NEARBY_KEYWORD) {
      if (!query) {
        return;
      }
      request.query = query;
      request.location = location;
      request.radius = radius;
      resolvedService.textSearch(request, handleSearchCallback);
    } else if (type === SearchType.NEARBY_TYPE) {
      request.location = location;
      request.radius = radius;
      request.type = query;
      resolvedService.nearbySearch(request, handleSearchCallback);
    } else if (type === SearchType.CITY_DEFAULT) {
      request.query = `tourist attractions ${cityName}`;
      request.location = location;
      resolvedService.textSearch(request, handleSearchCallback);
    }
  }

  return {
    performSearch,
  };
}
