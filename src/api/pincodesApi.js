import axios from 'axios';

export const getNearbyPincodesApi = (pin, range) => {
  return axios.get(`https://ezcmd.com/apps/api_geo_postal_codes/nearby_locations_by_zip_code/GUEST_USER/-1?zip_code=${pin}&country_code=IN&unit=Kilometres&within=${range}&start=0`);
};
