'use strict';

export const SERVER = 'http://localhost:3000';
export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const URLParams = (queryString: string): Map<string, string> => {
    const params: Map<string, string> = new Map();
    
    if(queryString) {
        let key: string = ''; 
        queryString.substr(1).split("=").map((item, i) => {
            if (i % 2 === 0) {
                key = item;
            } else {
                params.set(key, item);
                key = '';
            }
        });
    }
    return params;
};