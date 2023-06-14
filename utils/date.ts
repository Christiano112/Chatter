import { parseISO, formatDistanceToNow } from "date-fns";

const locale = Intl.DateTimeFormat().resolvedOptions().locale;

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale);
};

export const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString(locale);
};

export const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString(locale);
};

export const formatDateTimeShort = (dateTime: string) => {
    return new Date(dateTime).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
};

export const TimeAgo = ({ timestamp }: { timestamp: string }) => {
    if (!timestamp) return;

    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    const timeAgo = `${timePeriod} ago`;

    return timeAgo;
};
