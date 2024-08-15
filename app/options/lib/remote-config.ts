import { boolean, object, string } from "yup";

export const remoteConfigSchema = object({
    useRemote: boolean().label('Use Remote Configuration').required(),
    remoteUrl: string().label('Remote Configuration Url').url(),
})