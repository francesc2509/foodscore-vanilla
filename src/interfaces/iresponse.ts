import { IUser } from './iuser';
import { IRestaurant } from './irestaurant';
import { IComment } from './icomment';

export interface IResponse {
    restaurant?: IRestaurant;
    restaurants?: IRestaurant[];
    user?: IUser;
    users?: IUser[];
    accessToken?: string;
    avatar?: string;
    id?: number;
    comments?: IComment[];
    comment?: IComment;
}

