import swal from 'sweetalert2';

import { Auth } from './classes/auth.class';
import { IUser } from './interfaces/iuser';
import { Geolocation } from './classes/geolocation.class';

document.addEventListener('DOMContentLoaded', (loadedEvent) => {
    const registerForm: HTMLFormElement = document.querySelector('#form-register');
    const nameInput: HTMLInputElement = registerForm.querySelector('#name'); 
    const emailInput: HTMLInputElement = registerForm.querySelector('#email');
    const email2Input: HTMLInputElement = registerForm.querySelector('#email2');
    const passwordInput: HTMLInputElement = registerForm.querySelector('#password');
    const avatarInput: HTMLInputElement = registerForm.querySelector('#avatar');
    const latInput: HTMLInputElement = registerForm.querySelector('#lat');
    const lngInput: HTMLInputElement = registerForm.querySelector('#lng');

    const previewImg: HTMLImageElement = registerForm.querySelector('#imgPreview');
    avatarInput.addEventListener('change', event => {
        const file = avatarInput.files[0];
        console.log(avatarInput);
        let reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }
            reader.addEventListener('load', e => {
                previewImg.src = <string>reader.result;
        });
    });

    Geolocation.getLocation().then(
        (coords) => {
            latInput.value = `${coords.latitude}`;
            lngInput.value = `${coords.longitude}`;
        }
    ).catch(
        () => {
            latInput.type = 'hidden';
            lngInput.type = 'hidden';
        }
    ).then(() => {
        registerForm.addEventListener('submit', (submitEvent) => {
            if (emailInput.value !== email2Input.value) {
                swal(
                    'Register error',
                    `E-mail addresses don't match`,
                    'error'
                );
            } else {
                const lat = Number(latInput.value);
                const lng = Number(lngInput.value);

                const userInfo: IUser = {
                    name: nameInput.value,
                    password: passwordInput.value,
                    lat: isNaN(lat) ? undefined: lat,
                    lng: isNaN(lng) ? undefined: lng,
                    email: emailInput.value,
                    avatar: previewImg.src,
                };
                
                Auth.register(userInfo).then(async () => {
                    await swal(
                        'Register successful',
                        'The user has been registered',
                        'success'
                    );
                    location.assign('./login.html');
                }).catch(err => {
                    const errors = <Array<any>>err.message;
                    const message = errors.map(error => {
                        return Object.keys(error.constraints)
                            .map(key => `${error.constraints[key]}`)
                            .join('<br/>');
                    }).join('<br/>');

                    swal(
                        'Register error',
                        message,
                        'error'
                    );
                });
            }
            submitEvent.preventDefault();
        });
    });
});