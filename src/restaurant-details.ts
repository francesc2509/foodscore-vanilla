import { Restaurant } from './classes/restaurant.class';
import { load, urlSettings } from 'google-maps-promise';
import swal from 'sweetalert2';
import { IComment } from './interfaces/icomment';
import { SERVER } from './constants';

declare function require(module: string): any;
const commTemplate = require('../templates/comment.handlebars');

urlSettings.key = 'AIzaSyBOsD1guCZbuq-owCb6iCzjqLJSi6rLNiM';
urlSettings.language = 'es';
urlSettings.region = 'ES';
urlSettings.libraries = ['geometry', 'places'];

const queryString: string = location.search;
const params: Map<string, string> = new Map();
let comments: IComment[] = [];
let rating: number;


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

    
    document.addEventListener('DOMContentLoaded', async(loadEvent) => {        
        const cardContainerDiv = <HTMLDivElement> document.querySelector('#cardContainer');
        const addressDiv = <HTMLDivElement> document.querySelector('#address');
        const mapDiv = <HTMLDivElement> document.querySelector('#map');
        const commentsUl = <HTMLUListElement> document.querySelector('#comments');
        const commentForm = <HTMLFormElement> document.querySelector('#commentForm'); 

        if (!params.has('id')) {
            await swal(
                'Invalid Request',
                `None Id was provided`,
                'error'
            );
            location.assign('./index.html');
        }       

        Restaurant.get(Number(params.get('id'))).then(
            restaurant => {
                if (restaurant.commented) {
                    commentForm.classList.add('d-none');
                } else {
                    const commentTextArea = <HTMLTextAreaElement> commentForm.comment;
                    const starsDiv = <HTMLDivElement> commentForm.querySelector('#stars');
                    const starIcons = <HTMLElement[]> Array.from(starsDiv.querySelectorAll('i'));

                    starIcons.forEach((icon, position) => {
                        icon.addEventListener('click', (clickEvent) => {
                            rateRestaurant(starIcons, position);
                        })
                    });

                    commentForm.addEventListener('submit', (submitEvent) => {
                        const newComment = {
                            stars: rating,
                            text: commentTextArea.value
                        };
                        restaurant.addComment(newComment).then(
                            comment => {
                                commentTextArea.value = '';
                                rateRestaurant(starIcons, -1);

                                comments.push(comment);
                                showComments(commentsUl);
                            }
                        ).catch();
                        submitEvent.preventDefault()
                    });
                }
                
                cardContainerDiv.innerHTML = restaurant.toHTML();
                addressDiv.textContent = restaurant.address;
                setUpMap(restaurant, mapDiv);

                restaurant.getComments().then(commentsRes => {
                    comments = commentsRes;
                    showComments(commentsUl);
                }).catch();
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

const rateRestaurant = (stars: HTMLElement[], position) => {
    let classList: DOMTokenList;

    // It will be used to check if the user wants to give 0 stars
    const tmpRating = rating - 1;

    stars.forEach((star, index) => {
        classList = star.classList;
        classList.remove('fas');
        classList.remove('far');

        if (index > position || tmpRating === position) {
            classList.add('far');
        } else {
            classList.add('fas');
        }
    });

    rating = tmpRating !== position ? position + 1: 0;
};

const showComments = (container: HTMLElement) => {
    let innerHTML = '';

    comments.forEach(comment => {
        innerHTML += commTemplate({
            userId: comment.user.id,
            userName: comment.user.name,
            userImage: `${SERVER}/${comment.user.avatar}`,
            comment: comment.text,
            date: comment.date,
            fullStars: new Array(!isNaN(comment.stars) ? Number(Math.round(comment.stars)): 0).fill(1),
            emptyStars: new Array(!isNaN(comment.stars) ? 5 - Number(Math.round(comment.stars)): 0).fill(1),
        });
    });

    const firstChild = <HTMLLIElement>container.firstElementChild;
    container.innerHTML = firstChild.outerHTML + innerHTML;
}