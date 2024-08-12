export const getTeamFromHeaders = (headers: any[]): string | null => {
    const filterHeader = ({ name }: any) => name === 'x-team-identification-extension';

    const [wantedHeader = {}] = headers.filter(filterHeader);

    const { value = null } = wantedHeader;

    return value;
}