import { IUser } from './iuser';

export interface IRestaurant {
    id?: number;
    name: string;
    description: string;
    cuisine: string[];
    daysOpen: number[];
    image: string;
    phone: string;
    creator?: IUser;
    mine?: boolean;
    distance?: number;
    commented?: boolean;
    stars?: number;
    address: string;
    lat: number;
    lng: number;
}