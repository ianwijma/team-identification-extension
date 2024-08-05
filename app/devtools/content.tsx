'use client';

import { useEffect, useState } from "react";

export const DevtoolsContent = () => {
    const [count, setCount] = useState(0);
    const [items, setItems] = useState<any[]>([]);
    const addItem = (newItem: any) => setItems([ ...items, newItem ]);

    // idk why... But we need to stop listening every new items... 
    // Without it setItems does not actually work...
    // So this useEffect triggers every updated...
    useEffect(() => {
        const handlePage = (redirect: string) => {
            console.log('page', { redirect });
            setItems([]); // clear items
        };

        const handleNetwork = (event: any) => {
            const { request = {} } = event;
            const { url = '', method = '', headers = [] } = request;
    
            const filterHeader = ({ name }: any) => name === 'x-team-identification-extension';
            const [wantedHeader = {}] = headers.filter(filterHeader);
            const { value: team = '' } = wantedHeader;
    
            console.log('network', { url, method, team });
            addItem({ url, method, team });
        };

        chrome.devtools.network.onRequestFinished.addListener(handleNetwork);
        chrome.devtools.network.onNavigated.addListener(handlePage);

        return () => {
            chrome.devtools.network.onRequestFinished.removeListener(handleNetwork);
            chrome.devtools.network.onNavigated.removeListener(handlePage);
        }
    }, [items])

    return (
        <div>
            Devtools <span className='text-red-500'>(This text should be red)</span> 
            {' '}
            <button onClick={() => setCount(count+1)}>Count: {count}</button>

            <table>
                <thead>
                    <tr>
                        <td>Path</td>
                        <td>Method</td>
                        <td>Team</td>
                    </tr>
                </thead>
                <tbody id="network-table">
                    {items.map(({ url, method, team }, index) => (
                        <tr key={index}>
                            <td>{url}</td>
                            <td>{method}</td>
                            <td>{team}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
