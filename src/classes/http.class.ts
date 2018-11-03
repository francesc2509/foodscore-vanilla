import { IResponse } from '../interfaces/iresponse';

export class Http {
    static ajax(
        method: string = 'GET',
        url: string,
        authorize: boolean = true,
        headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: any|string = undefined,

    ): Promise<IResponse> {
        if (data && typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        if (authorize) {
            headers = { 
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
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