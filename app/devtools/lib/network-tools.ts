export const getTeamFromHeaders = (headers: any[], headerName: string): string | null => {
    const filterHeader = ({ name }: any) => name === headerName;

    const [wantedHeader = {}] = headers.filter(filterHeader);

    const { value = null } = wantedHeader;

    return value;
}