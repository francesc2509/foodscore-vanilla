import { Http } from './http.class';
import { IUser } from '../interfaces/iuser';


import { SERVER } from '../constants';


export class Auth {
    static async login(userInfo: IUser): Promise<void>{
        await Http
            .ajax('POST', `${SERVER}/auth/login`, undefined, userInfo)
            .then(res => localStorage.setItem('token', res.accessToken));
    }

    static async register(userInfo: IUser): Promise<void> {
        await Http.ajax('POST', `${SERVER}/auth/register`, undefined, userInfo)
    }
    static async checkToken(): Promise<void> {
        await Http.ajax(
            'GET',
            `${SERVER}/auth/validate`, 
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        );
    }
    static logout() {

    }
}
