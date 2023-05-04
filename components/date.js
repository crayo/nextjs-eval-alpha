import { parseISO, format } from 'date-fns';

export default function Date({ dateString, dateFormat = "LLLL d, yyyy" }) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, dateFormat)}</time>;
}
