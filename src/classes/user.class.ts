import { IUser } from '../interfaces/iuser'
import { SERVER } from '../constants';
import { Http } from './http.class';

export class User implements IUser {
    id?: number;
    name?: string;
    avatar?: string;
    email: string;
    password?: string;
    lat?: number;
    lng?: number;
    me?: boolean; // If the user is the current logged user

    constructor(userJSON: IUser) {
        this.id = userJSON.id;
        this.name = userJSON.name;
        this.avatar = userJSON.avatar;
        this.email = userJSON.email;
        this.password = userJSON.password;
        this.lat = userJSON.lat;
        this.lng = userJSON.lng;
        this.me = userJSON.me;
    }

    static async getProfile(id?: number): Promise<User> {
        let url = `${SERVER}/users/me`;
        if (!isNaN(id)) {
            url = `${SERVER}/users/${id}`;
        }

        const userInfo = await Http.ajax('GET', url, true).then(res => res.user);
        return new User(userInfo);
    }
    
    static async saveProfile(name: string, email: string): Promise<void> {
        await Http.ajax(
            'PUT',
            `${SERVER}/users/me`,
            true,
            undefined,
            { name, email }
        );
    }
    
    static async saveAvatar(avatar: string): Promise<string> {
        const path = await Http.ajax(
            'PUT',
            `${SERVER}/users/me/avatar`,
            true,
            undefined,
            { avatar }
        ).then(res => res.avatar);

        return path;
    }
    
    static async savePassword(password: string): Promise<void> {
        await Http.ajax(
            'PUT',
            `${SERVER}/users/me/password`,
            true,
            undefined,
            { password }
        );
    }
}