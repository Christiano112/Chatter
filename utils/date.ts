import { formatDistanceToNow, parseISO } from "date-fns";

const locale = Intl.DateTimeFormat().resolvedOptions().locale;

export const formatDateTimeShort = (dateTime: string) => {
    return new Date(dateTime).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
};

export const timeAgo = (timestamp: string) => {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date, { addSuffix: true });
    return timePeriod;
};
