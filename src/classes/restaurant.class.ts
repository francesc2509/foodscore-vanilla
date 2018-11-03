import { IRestaurant } from '../interfaces/irestaurant';
import { IUser } from '../interfaces/iuser';
import { IComment } from '../interfaces/icomment';

import { Http } from './http.class';

import { SERVER, WEEKDAYS } from '../constants';

declare function require(module: string): any;
const restTemplate = require('../../templates/restaurant.handlebars');


export class Restaurant implements IRestaurant {
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

    constructor(restJSON: IRestaurant) {
        this.id = restJSON.id;
        this.name = restJSON.name;
        this.description = restJSON.description;
        this.cuisine = restJSON.cuisine;
        this.daysOpen = restJSON.daysOpen.map(day => Number(day));
        this.image = restJSON.image;
        this.phone = restJSON.phone;
        this.creator = restJSON.creator;
        this.mine = restJSON.mine;
        this.distance = restJSON.distance;
        this.commented = restJSON.commented;
        this.stars = restJSON.stars;
        this.address = restJSON.address;
        this.lat = restJSON.lat;
        this.lng = restJSON.lng;
    }

    static async getAll(): Promise<Restaurant[]> {
        const data = await Http.ajax(
            'GET',
            `${SERVER}/restaurants`,
            true
        );

        return data.restaurants.map(irestaurant => new Restaurant(irestaurant));
    }

    static async get(id: number): Promise<Restaurant> {
        return null;
    }
    
    async post(): Promise<Restaurant> {
        return null;
    }

    async delete(): Promise<void> {
        return null;
    }

    async getComments(): Promise<IComment[]> {
        return null;
    }
    
    async addComment(comment: IComment): Promise<IComment> {
        return null;
    }

    toHTML(): string {
        const restHTML = restTemplate({
            name: this.name,
            description: this.description,
            daysOpen: this.daysOpen.map(day => WEEKDAYS[day]).join(', '), // Pass days to string like "Mo, Tu, Wed, Th"
            cuisine: this.cuisine.join(', '), // Cuisine is an array, pass it like a string
            phone: this.phone,
            image: `${SERVER}/${this.image}`, // Complete image url
            open: this.daysOpen.includes(new Date().getDay()), // true or false
            stars: this.stars,
            fullStars: new Array(!isNaN(this.stars) ? Number(this.stars): 0),
            emptyStars: new Array(!isNaN(this.stars) ? 5-Number(this.stars): 0),
            mine: this.mine,
            distance: this.distance.toFixed(2)
        });

        return restHTML;
        //return null;
    }
}