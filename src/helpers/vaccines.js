import moment from 'moment';
import { getAppointmentsApi } from '../api/vaccineApi';

export const getAppointmentsHelper = async (pins, days) => {
  let results = [];
  const dates = [];
  for (let i = 1; i <= days; i++) {
    dates.push(moment().add(i, 'days').format('DD-MM-YYYY'));
  }
  const pinCodes = pins.split(',').map(pin => pin.trim());
   for (const code of pinCodes) {
    for (const date of dates) {
      const res = await getAppointmentsApi(code, date);
      results = [...results, ...res.data.sessions];
    };
  };
  return results;
};
