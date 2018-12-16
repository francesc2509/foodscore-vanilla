import Cropper from 'cropperjs';

import { Auth } from './classes/auth.class';
import { Restaurant } from './classes/restaurant.class';
import { IRestaurant } from './interfaces/irestaurant';
import { Geolocation } from './classes/geolocation.class';
import { Gmap } from './classes/gmaps.class';

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
let latInput: HTMLInputElement;
let lngInput: HTMLInputElement;

Auth.checkToken().catch(err => {
    location.assign('./login.html');
});

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
            const cropper = new Cropper(imgPreview, {
                autoCrop: true,
                autoCropArea: 1,
                aspectRatio: 16/9,
                minCropBoxWidth: 1024,
                minCropBoxHeight: 576,
                viewMode: 2,
                crop: function(event: any) {
                    const options = {
                        fillColor: 'white',
                        width: 1024,
                        maxWidth: 1024,
                    };
                    imgPreview.src = cropper.getCroppedCanvas(options).toDataURL('image/jpeg');
                    cropper.destroy();
                }
            });
            
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

    const mapDiv = <HTMLDivElement> document.querySelector('#map');
    latInput = <HTMLInputElement> document.querySelector('#lat');
    lngInput = <HTMLInputElement> document.querySelector('#lng');
    
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
        const gmap = new Gmap(coords, mapDiv);
        await gmap.loadMap();
        const marker = gmap.createMarker(coords.latitude, coords.longitude, 'blue');

        gmap.getAutocomplete().on('result', e => {
            marker.setLngLat(e.result.geometry.coordinates);
            latInput.value = "" + e.result.geometry.coordinates[1];
            lngInput.value = "" + e.result.geometry.coordinates[0];
            addressInput.value = e.result.place_name;
        });
        // gmap.createAutocomplete(addressInput);
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

        // /**
        //  * Since Google Places doesn't work, this code generates
        //  * random coordinates to avoid adding all the new restaurants
        //  * at the same location
        //  */
        // let lat = Math.random() * (91);
        // if (lat > 90) {
        //     lat = 90;
        // }
        // lat = Math.random() > 0.5 ? lat: -lat;

        // let lng = Math.random() * (181);
        // if (lng > 180) {
        //     lng = 180;
        // }
        // lng = Math.random() > 0.5 ? lng: -lng;
        
        const lat = isNaN(Number(latInput.value)) ? 0: Number(latInput.value);
        const lng = isNaN(Number(lngInput.value)) ? 0: Number(lngInput.value);

        const userInfo: IRestaurant = {
            name: nameInput.value,
            description: descriptionTextArea.value,
            cuisine: cuisineInput.value.split(','),
            daysOpen: Array.from(checkboxList).filter(c => c.checked).map((c) => Number(c.value)),
            phone: phoneInput.value,
            image: imgPreview.src,
            // address: 'Fake St. 123',
            // lat: lat,
            // lng: lng,
            lat: lat,
            lng: lng,
            address: addressInput.value
        };
        const restaurant = new Restaurant(userInfo);
        console.log(restaurant);
        restaurant.post().then(res => {
            location.assign('./index.html');
        }).catch(err => console.log(err));
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