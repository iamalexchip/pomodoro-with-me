import moment from 'moment';
import { NO_DURATION } from '../constants/time';

export const getDiff = (start: Date, end: Date) => {
  const timeDifference = moment(end).diff(moment(start));
  const differenceString = moment.utc(timeDifference).format("HH:mm:ss");
  return timeDifference > 0 ? differenceString : NO_DURATION; 
};
