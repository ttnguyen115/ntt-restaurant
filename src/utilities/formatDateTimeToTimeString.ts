import { format } from 'date-fns';

const formatDateTimeToTimeString = (date: string | Date) => {
    return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss');
};

export default formatDateTimeToTimeString;
