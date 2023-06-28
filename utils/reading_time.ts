const calculateReadingTime = (content: string): number => {
    // Average reading speed in words per minute
    const wordsPerMinute = 200;

    const cleanedContent = content?.replace(/<[^>]+>/g, "");

    const wordCount = cleanedContent?.trim().split(/\s+/g).length;

    const readingTimeInMinutes = Math?.ceil(wordCount / wordsPerMinute);

    return readingTimeInMinutes;
};

export default calculateReadingTime;
