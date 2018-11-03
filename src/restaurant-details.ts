import { Restaurant } from './classes/restaurant.class';
import { load, urlSettings } from 'google-maps-promise';
import swal from 'sweetalert2';

urlSettings.key = 'AIzaSyBOsD1guCZbuq-owCb6iCzjqLJSi6rLNiM';
urlSettings.language = 'es';
urlSettings.region = 'ES';
urlSettings.libraries = ['geometry', 'places'];

const queryString: string = location.search;
let params: Map<string, string> = new Map();

if (queryString) {
    let key: string = ''; 
    queryString.substr(1).split("=").map((item, i) => {
        if (i % 2 === 0) {
            key = item;
        } else {
            params.set(key, item);
            key = '';
        }
    });

    
    document.addEventListener('DOMContentLoaded', (event) => {        
        const cardContainerDiv = <HTMLDivElement> document.querySelector('#cardContainer');
        const addressDiv = <HTMLDivElement>document.querySelector('#address');
        const mapDiv = <HTMLDivElement>document.querySelector('#map');

        if (!params.has('id')) {
            swal(
                'Invalid Request',
                `None Id was provided`,
                'error'
            ).then(() => location.assign('./index.html'));
        }       

        Restaurant.get(Number(params.get('id'))).then(
            res => {
                cardContainerDiv.innerHTML = res.toHTML();
                addressDiv.textContent = res.address;
                setUpMap(res, mapDiv);
            }
        ).catch(err => {
            swal(
                'Restaurant Not Found',
                `Provided restaurant doesn't exist`,
                'error'
            ).then(() => location.assign('./index.html'));
        });
    });
}


const setUpMap = (restaurant: Restaurant, mapDiv: HTMLDivElement) => {
    load().then((GMaps) => { // GMaps here is an alias to google.maps (you can use it also)
        let gLatLng = new GMaps.LatLng(restaurant.lat, restaurant.lng);
        let options = {
            zoom: 17, // Map zoom (min: 0, max: 20)
            center: gLatLng, // Center the map in our position
            mapTypeId: GMaps.MapTypeId.ROADMAP // Map type (also SATELLITE, HYBRID, TERRAIN)
        };
        // Or you can use `new google.maps.Map` instead
        
        let map = new GMaps.Map(mapDiv, options);
        const latLng = new google.maps.LatLng(restaurant.lat, restaurant.lng)
        const opts = {
            position: latLng,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        };
        const marker = new google.maps.Marker(opts);
        
        const infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(restaurant.name);
        infoWindow.open(map, marker);
    });
};