import { Restaurant } from "./classes/restaurant.class";
import swal from "sweetalert2";
import { Auth } from './classes/auth.class';

let container: HTMLDivElement;
let orderName = false;
let showOpen = false;
let search = '';
const showRestaurants = (restaurants: Restaurant[] = []) => {
    if (container) {
        const dayOfWeek = new Date().getDay();
        restaurants = restaurants.filter(item => {
            return (!search || (item.name || '' ).toLowerCase().includes(search))
                && (!showOpen || item.daysOpen.includes(dayOfWeek));
        });

        if (orderName) {
            restaurants.sort((a, b) => {

                if (a > b) {
                    return 1;
                } else if (a === b) {
                    return 0;
                }
                return -1;
            });
        }

        let child = container.firstElementChild;
        let next = null;

        for (; child;) {
            next = child.nextElementSibling;
            container.removeChild(child)
            child = next;
        }

        container.innerHTML = restaurants.map(
            restaurant => restaurant.toHTML()
        ).join('');

        setDeleteListener(restaurants);
    }
};

const setDeleteListener = (restaurants: Restaurant[]) => {
    Array.from(container.children).forEach((child, i) => {
        const deleteBtn = child.querySelector('.btn-delete');
        
        if(deleteBtn) {
            deleteBtn.addEventListener('click', (event) => {
                const restaurant = restaurants[i];
                restaurant.delete().then(() => {
                    restaurants = restaurants.filter(item => item.id !== restaurant.id);
                    swal(
                        'Deletion successful',
                        `${restaurant.id}-${restaurant.name} was deleted`,
                        'success'
                    ).then()
                    showRestaurants(restaurants);
                }).catch(async(err) => {
                    swal(
                        'Deletion error',
                        err.message,
                        'error'
                    );
                });
            });
        }
    });
};


if (!localStorage.getItem('token')) {
    location.assign('./login.html');
}

document.addEventListener('DOMContentLoaded', (loadedEvent) => {
    const logoutBtn = document.querySelector('#logout');
    logoutBtn.addEventListener('click', clickEvent => {
        Auth.logout();
        clickEvent.preventDefault();
    });

    container = document.querySelector('#placesContainer');
    let restaurants: Restaurant[];

    const searchInput: HTMLInputElement = document.querySelector('#search');
    searchInput.addEventListener('keyup', event => {
        search = searchInput.value.trim().toLowerCase();
        showRestaurants(restaurants);
    });

    const orderNameLink = document.querySelector('#orderName');
    orderNameLink.addEventListener('click', event => {
        orderNameLink.classList.toggle('active');
        orderName = !orderName;
        
        showRestaurants(restaurants);
    });

    const showOpenLink = document.querySelector('#showOpen');
    showOpenLink.addEventListener('click', event => {
        showOpenLink.classList.toggle('active');
        showOpen = !showOpen;
        
        showRestaurants(restaurants);
    });

    Restaurant.getAll().then(
        res => {
            restaurants = res;
            showRestaurants(restaurants);
        }
    ).catch(err => console.error(err));
});

