import { Auth } from './classes/auth.class';
import { URLParams, SERVER } from './constants';
import { User } from './classes/user.class';
import { Gmap } from './classes/gmaps.class';

import { profileTemplate }  from '../templates';

let profileDiv: HTMLDivElement;
let mapDiv: HTMLDivElement;

Auth.checkToken().catch(err => {
    location.assign('./login.html');
});

document.addEventListener('DOMContentLoaded', (loadEvent) => {
    const queryString = <string>location.search;
    const params = <Map<string, string>>URLParams(queryString);

    profileDiv = document.querySelector('#profile');
    const logoutBtn = document.querySelector('#logout');
    logoutBtn.addEventListener('click', clickEvent => {
        Auth.logout();
    });
    mapDiv = document.querySelector('#map');
    

    User.getProfile(Number(params.get('id'))).then(
        async(user) => {
            profileDiv.innerHTML = profileTemplate({
                avatar: `${SERVER}/${user.avatar}`,
                name: user.name,
                email: user.email,
                me: user.me
            });

            const coords = {
                latitude: user.lat,
                longitude: user.lng
            };
            const gmap = new Gmap(coords, mapDiv);
            await gmap.loadMap();
            gmap.createMarker(coords.latitude, coords.longitude, 'blue');
        }
    );
});