import { array, object, string } from "yup";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_MESSAGE = '${path} is is not slug-like, allowed characters are: a-z (lowe case), 0-9 and -';

export const localSettingsSchema = object({
    elementAttributeName: string().label('Element attribute name').min(5).max(255).matches(SLUG_REGEX, { message: SLUG_MESSAGE }).required(),
    requestHeaderName: string().label('Request header name').min(5).max(255).matches(SLUG_REGEX, { message: SLUG_MESSAGE }).required(),
    responseHeaderName: string().label('Response header name').min(5).max(255).matches(SLUG_REGEX, { message: SLUG_MESSAGE }).required(),
    teams: array().of(
        object({
            alias: string().label('Team Alias').min(5).max(255).required(),
            name: string().label('Team Name').min(5).max(255).required(),
            description: string().label('Team Description').ensure()
        })
    )
});