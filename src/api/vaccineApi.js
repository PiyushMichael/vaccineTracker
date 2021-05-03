import axios from 'axios';

export const getAppointmentsApi = (pin, date) => {
  return axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`);
};
