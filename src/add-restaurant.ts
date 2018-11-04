import { Auth } from './classes/auth.class';
import { Restaurant } from './classes/restaurant.class';
import { IRestaurant } from './interfaces/irestaurant';
import { Geolocation } from './classes/geolocation.class';
import { GMap } from './classes/gmaps.class';

const inputs = [];
let form: HTMLFormElement;
let nameInput: HTMLInputElement;
let descriptionTextArea: HTMLTextAreaElement;
let cuisineInput: HTMLInputElement;
let imageInput: HTMLInputElement;
let phoneInput: HTMLInputElement;
let checkboxList: NodeListOf<HTMLInputElement>;
let imgPreview: HTMLImageElement;
let addressInput: HTMLInputElement;

document.addEventListener("DOMContentLoaded", e => {
    const logoutBtn = document.querySelector('#logout');
    logoutBtn.addEventListener('click', clickEvent => {
        Auth.logout();
    });

    form = document.querySelector('#newPlace');
    form.addEventListener('submit', onSubmitHandler);

    nameInput = form.querySelector('#name');
    nameInput.required = true;
    nameInput.pattern = "^[A-Za-z][A-Za-z\\s]*$";
    inputs.push({
        element: nameInput
    });


    descriptionTextArea = form.querySelector('#description');
    descriptionTextArea.required = true;
    inputs.push({
        element: descriptionTextArea,
        fn: () => {
            const err = /\S{1}.*/.test(descriptionTextArea.value) ? '': 'Error';
            descriptionTextArea.setCustomValidity(err);
            return setInputValidityClass(descriptionTextArea);
        }
    });

    cuisineInput = form.querySelector('#cuisine');
    cuisineInput.required = true;
    cuisineInput.pattern = '((\\S)|(\\s*\\S)).*';
    inputs.push({
        element: cuisineInput
    });

    const daysErrorDiv = form.querySelector('#daysError');
    checkboxList = form.querySelectorAll('.custom-checkbox input');
    inputs.push({
        element: checkboxList,
        fn: () => {
            const index = Array.from(checkboxList)
                .findIndex(checkbox => checkbox.checked);

            if (index === -1) {
                daysErrorDiv.classList.remove('d-none');
                return false;
            }

            if (!daysErrorDiv.classList.contains('d-none')) {
                daysErrorDiv.classList.add('d-none')
            }
            return true;
        }
    });

    phoneInput = form.querySelector('#phone');
    phoneInput.required = true;
    phoneInput.pattern = '^((0|\\+)?[0-9]{2})?[0-9]{9}$';
    inputs.push({
        element: phoneInput
    });

    imgPreview = form.querySelector("#imgPreview");

    imageInput = form.querySelector('#image');
    imageInput.required = true;
    imageInput.addEventListener('change', event => {
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        if (file) {
            reader.readAsDataURL(file)
        };
        
        reader.addEventListener('load', e => {
            imgPreview.src = reader.result.toString();
        });
    });

    inputs.push({
        element: imageInput
    });

    addressInput = form.querySelector('#address');
    addressInput.required = true;
    inputs.push({
        element: imageInput
    });

    const latInput = <HTMLInputElement> document.querySelector('#lat');
    const lngInput = <HTMLInputElement> document.querySelector('#lng');
    const mapDiv = <HTMLDivElement> document.querySelector('#map');

    Geolocation.getLocation().then(coord => {
        latInput.value = `${coord.latitude}`;
        lngInput.value = `${coord.longitude}`;
    }).catch().then(async() => {
        const lat: number = Number(latInput.value);
        const lng: number = Number(lngInput.value);

        const coords = {
            latitude: isNaN(lat) ? 0: lat,
            longitude: isNaN(lng) ? 0: lng,
        };
        const gmap = new GMap(mapDiv, coords);
        await gmap.loadMap();
        gmap.createMarker(coords, 'blue');
    
        const map = gmap.getMap();
        gmap.createAutocomplete(addressInput);
    });
});

const onSubmitHandler = (event) => {
    let isValid = true;
    event.preventDefault();
    inputs.forEach(input => {
        if (input.fn) {
            isValid = input.fn() && isValid;
        } else {
            isValid = setInputValidityClass(input.element) && isValid;
        }
    });

    if (isValid) {
        form.querySelectorAll('input, textarea').forEach(element => {
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid')
        });

        const userInfo: IRestaurant = {
            name: nameInput.value,
            description: descriptionTextArea.value,
            cuisine: cuisineInput.value.split(','),
            daysOpen: Array.from(checkboxList).filter(c => c.checked).map((c) => Number(c.value)),
            phone: phoneInput.value,
            image: imgPreview.src,
            address: '',
            lat: 0,
            lng: 0
        };
        const restaurant = new Restaurant(userInfo);
        restaurant.post().then(res => {
            location.assign('./index.html');
        }).catch(err => alert(err));
    }
};

const setInputValidityClass = (input) => {
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');

    let className = 'is-invalid';
    let result = false;

    if (input.validity.valid) {
        className = 'is-valid';
        result = true;
    }
    input.classList.add(className);
    return result;
};