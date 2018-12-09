import { Auth } from './classes/auth.class';
import { IUser } from './interfaces/iuser';

import { Geolocation } from './classes/geolocation.class';

Auth.checkToken().then(() => location.assign('./index.html')).catch(err => {});

document.addEventListener('DOMContentLoaded', (loadedEvent) => {
    const loginForm: HTMLFormElement = document.querySelector('#form-login');
    const emailInput: HTMLInputElement = loginForm.querySelector('#email');
    const passwordInput: HTMLInputElement = loginForm.querySelector('#password');
    const errorP: HTMLParagraphElement = loginForm.querySelector('#errorInfo');

    loginForm.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        
        const userInfo: IUser = {
            "email": emailInput.value,
            "password": passwordInput.value
        };

        Geolocation.getLocation()
            .then(coordinates => {
                userInfo.lat = coordinates.latitude;
                userInfo.lng = coordinates.longitude;
            })
            .catch()
            .then(() => {
                Auth.login(userInfo).then(
                    () => {
                        location.assign('./index.html');
                    }
                ).catch(err => {
                    errorP.textContent = `${err.error}`;
                });
            }
        );

        
    });
});