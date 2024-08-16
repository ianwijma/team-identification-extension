import { useEffect, useState } from "react";
import { ExtensionSettings, Team, TeamAlias } from "../lib/extension-settings";
import { useExtensionSettings } from "./use-extension-settings"

export const getTeam = (teamAlias: TeamAlias, extensionSettings: ExtensionSettings): Team | null => {
    const { teamMap = {} } = extensionSettings;

    if (teamAlias in teamMap) {
        return teamMap[teamAlias];
    }

    return null;
}

export const useTeam = (teamAlias: TeamAlias) => {
    const { extensionSettings } = useExtensionSettings();
    const [team, setTeam] = useState<null | Team>(null);


    useEffect(() => {
        const team = getTeam(teamAlias, extensionSettings);
        
        setTeam(team);
    }, [extensionSettings])


    return { team };
}