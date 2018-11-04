import swal from 'sweetalert2';

import { IComment } from './interfaces/icomment';
import { Restaurant } from './classes/restaurant.class';
import { Auth } from './classes/auth.class';
import { SERVER, URLParams } from './constants';
import { GMap } from './classes/gmaps.class';


declare function require(module: string): any;
const commTemplate = require('../templates/comment.handlebars');

const queryString: string = location.search;
let cardContainerDiv: HTMLDivElement;
let addressDiv: HTMLDivElement;
let mapDiv: HTMLDivElement;
let commentsUl: HTMLUListElement;
let commentForm: HTMLFormElement; 
let comments: IComment[] = [];
let rating: number;


if (queryString) {
    
    const params = URLParams(queryString);
    
    document.addEventListener('DOMContentLoaded', async(loadEvent) => {        
        cardContainerDiv = document.querySelector('#cardContainer');
        addressDiv = document.querySelector('#address');
        mapDiv = document.querySelector('#map');
        commentsUl = document.querySelector('#comments');
        commentForm = document.querySelector('#commentForm'); 
        const logoutBtn = document.querySelector('#logout');
        logoutBtn.addEventListener('click', clickEvent => {
            Auth.logout();
            clickEvent.preventDefault();
        });

        if (!params.has('id')) {
            await swal(
                'Invalid Request',
                `None Id was provided`,
                'error'
            );
            location.assign('./index.html');
            return;
        }       

        Restaurant.get(Number(params.get('id'))).then(getRestaurantsHandler).catch(err => {
            swal(
                'Restaurant Not Found',
                `Provided restaurant doesn't exist`,
                'error'
            ).then(() => location.assign('./index.html'));
        });
    });
}

const getRestaurantsHandler = async (restaurant: Restaurant) => {
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
    
    const coords = {
        latitude: restaurant.lat,
        longitude: restaurant.lng
    };
    const gmap = new GMap(mapDiv, coords);
    await gmap.loadMap();
    gmap.createMarker(coords, 'blue');

    restaurant.getComments().then(commentsRes => {
        comments = commentsRes;
        showComments(commentsUl);
    }).catch();
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