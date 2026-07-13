const BOT_REGEX =
    /(facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|Slackbot|Discordbot|LinkedInBot|Googlebot)/i;

export function isBot(userAgent = "") {

    return BOT_REGEX.test(userAgent);

}