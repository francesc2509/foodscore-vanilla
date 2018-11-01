import { IUser } from "./iuser";

export interface IComment {
    stars: number;
    text: string;
    date?: string;
    user?: IUser;
}