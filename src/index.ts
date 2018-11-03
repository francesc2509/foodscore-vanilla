import { Restaurant } from "./classes/restaurant.class";

let container: HTMLDivElement;
let orderName = false;
let showOpen = false;
let search = '';
const showRestaurants = (data: Restaurant[] = []) => {
    if (container) {
        const dayOfWeek = new Date().getDay();
        data = data.filter(item => {
            return (!search || (item.name || '' ).toLowerCase().includes(search))
                && (!showOpen || item.daysOpen.includes(dayOfWeek));
        });

        if (orderName) {
            data.sort((a, b) => {

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
        let innerHTML = '';
        data.forEach(restaurant => {
            innerHTML += restaurant.toHTML();
        });
        container.innerHTML = innerHTML;
    }
};


if (!localStorage.getItem('token')) {
    location.assign('./login.html');
}

document.addEventListener('DOMContentLoaded', (loadedEvent) => {
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

