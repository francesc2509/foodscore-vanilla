import { IUser } from '../interfaces/iuser'

export class User implements IUser {
    id?: number;
    name?: string;
    avatar?: string;
    email: string;
    password?: string;
    lat?: number;
    lng?: number;
    me?: boolean; // If the user is the current logged user
}