import moment from 'moment';

export const getDiff = (start: Date, end: Date) => {
  const timeDifference = moment(end).diff(moment(start));
  return moment.utc(timeDifference).format("HH:mm:ss");
};
