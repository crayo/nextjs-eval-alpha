import { parseISO, format } from 'date-fns';

export default function Date({ dateString, dateFormat = "LLLL d, yyyy", className="" }) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  return <time dateTime={dateString} className={className}>{format(date, dateFormat)}</time>;
}
