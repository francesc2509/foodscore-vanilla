import { IResponse } from '../interfaces/iresponse';

export class Http {
    static ajax(
        method: string = 'GET',
        url: string,
        headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: any|string = undefined,
    ): Promise<IResponse> {
        console.log(url);

        if (data && typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        return fetch(url, {
            body: data,
            headers,
            method
        }).then(async res => {
                if(!res.ok) {
                    throw await res.json();
                }
                return <IResponse>(await res.json()); // promise
            }
        );
    }
}