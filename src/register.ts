import swal from 'sweetalert2';
import Cropper from 'cropperjs';
import { Auth } from './classes/auth.class';
import { IUser } from './interfaces/iuser';
import { Geolocation } from './classes/geolocation.class';

let registerForm: HTMLFormElement;
let nameInput: HTMLInputElement;
let passwordInput: HTMLInputElement;
let emailInput: HTMLInputElement;
let email2Input: HTMLInputElement;
let avatarInput: HTMLInputElement;
let latInput: HTMLInputElement;
let lngInput: HTMLInputElement;
let previewImg: HTMLImageElement;

document.addEventListener('DOMContentLoaded', (loadedEvent) => {
    registerForm = document.querySelector('#form-register');
    nameInput = registerForm.querySelector('#name'); 
    emailInput = registerForm.querySelector('#email');
    email2Input = registerForm.querySelector('#email2');
    passwordInput = registerForm.querySelector('#password');
    avatarInput = registerForm.querySelector('#avatar');
    latInput = registerForm.querySelector('#lat');
    lngInput = registerForm.querySelector('#lng');

    previewImg = registerForm.querySelector('#imgPreview');
    avatarInput.addEventListener('change', event => {
        const file = (<HTMLInputElement>event.target).files[0];
        console.log(avatarInput);
        let reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }
        
        reader.addEventListener('load', e => {
            previewImg.src = <string>reader.result;
            const cropper = new Cropper(previewImg, {
                autoCrop: true,
                autoCropArea: 1,
                aspectRatio: 1,
                minCropBoxWidth: 200,
                minCropBoxHeight: 200,
                viewMode: 2,
                crop: function(event: any) {
                    const options = {
                        fillColor: 'white',
                        width: 200,
                        maxWidth: 200
                    };
                    previewImg.src = cropper.getCroppedCanvas(options).toDataURL('image/jpeg');
                    cropper.destroy();
                }
            });
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
            submitEvent.preventDefault();
            if (emailInput.value !== email2Input.value) {
                swal(
                    'Register error',
                    `E-mail addresses don't match`,
                    'error'
                );
            } else {
                registerUser();
            }
        });
    });
});

const registerUser = () => {
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