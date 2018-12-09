import swal from 'sweetalert2';
import Cropper from 'cropperjs';

import { Auth } from './classes/auth.class';
import { User } from './classes/user.class';
import { SERVER } from './constants';

let profileForm: HTMLFormElement;
let emailInput: HTMLInputElement;
let nameInput: HTMLInputElement;
let okInfo1P: HTMLParagraphElement;
let errorInfo1P: HTMLParagraphElement;

let avatarForm: HTMLFormElement;
let imageInput: HTMLInputElement;
let avatarImg: HTMLImageElement;
let previewImg: HTMLImageElement;
let okInfo2P: HTMLParagraphElement;
let errorInfo2P: HTMLParagraphElement;

let passwordForm: HTMLFormElement;
let passwordInput: HTMLInputElement;
let password2Input: HTMLInputElement;
let okInfo3P: HTMLParagraphElement;
let errorInfo3P: HTMLParagraphElement;

document.addEventListener('DOMContentLoaded', loadEvent => {
    setReferences();

    User.getProfile().then(
        user => {
            emailInput.value = user.email;
            nameInput.value = user.name;
            avatarImg.src = `${SERVER}/${user.avatar}`
        }
    ).catch(err => {
        swal(
            'Profile Error',
            err.message,
            'error'
        );
    });
});

const modifyProfile = () => {
    User.saveProfile(nameInput.value, emailInput.value).then(
        () => {
            showInfo(
                okInfo1P,
                errorInfo1P,
                true,
                undefined,
                'Profile updated succesfully!'
            );
        }
    ).catch(
        err => {
            showInfo(
                okInfo1P,
                errorInfo1P,
                false,
                err
            );
        }
    );
}

const modifyAvatar = () => {
    User.saveAvatar(previewImg.src).then(
        path => {
            imageInput.value = '';
            previewImg.src = '';
            previewImg.classList.add('d-none');
            avatarImg.src = `${SERVER}/${path}`;

            showInfo(
                okInfo2P,
                errorInfo2P,
                true,
                undefined,
                'Avatar updated successfully!'
            );
        }
    ).catch(
        err => {
            showInfo(
                okInfo2P,
                errorInfo2P,
                false,
                err
            );
        }
    );
}

const modifyPassword = () => {
    User.savePassword(passwordInput.value).then(
        () => {
            showInfo(
                okInfo3P,
                errorInfo3P,
                true,
                undefined,
                'Password updated succesfully!'
            );
        }
    ).catch(
        err => {
            showInfo(
                okInfo3P,
                errorInfo3P,
                false,
                err
            );
        }
    );
}

const setReferences = () => {
    const logoutBtn = document.querySelector('#logout');
    logoutBtn.addEventListener('click', clickEvent => {
        Auth.logout();
        clickEvent.preventDefault();
    });

    profileForm = document.querySelector('#form-profile');
    emailInput = profileForm.querySelector('#email');;
    nameInput = profileForm.querySelector('#name');;
    okInfo1P = profileForm.querySelector('#okInfo1');
    errorInfo1P = profileForm.querySelector('#errorInfo1');
    profileForm.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        modifyProfile();
    });

    avatarForm = document.querySelector('#form-avatar');
    imageInput = avatarForm.querySelector('#image');
    previewImg = avatarForm.querySelector('#imgPreview');
    avatarImg = avatarForm.querySelector('#avatar');
    okInfo2P = avatarForm.querySelector('#okInfo2');
    errorInfo2P = avatarForm.querySelector('#errorInfo2');
    imageInput.addEventListener('change', event => {
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        if (file) {
            reader.readAsDataURL(file)
        };
        
        reader.addEventListener('load', e => {
            previewImg.classList.remove('d-none');

            previewImg.src = reader.result.toString();
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
    avatarForm.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        if (previewImg.classList.contains('d-none')) {
            showInfo(
                okInfo2P,
                errorInfo2P,
                false,
                { message: 'No image was chosen'}
            );
            return;
        }
        modifyAvatar();
    });

    passwordForm = document.querySelector('#form-password');
    passwordInput = passwordForm.querySelector('#password');;
    password2Input = passwordForm.querySelector('#password2');;
    okInfo3P = passwordForm.querySelector('#okInfo3');
    errorInfo3P = passwordForm.querySelector('#errorInfo3');
    passwordForm.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();
        if (passwordInput.value !== password2Input.value) {
            showInfo(
                okInfo3P,
                errorInfo3P,
                false,
                { message: `Passwords don't match!`}
            );
            return;
        }
        modifyPassword();
    });
}

const showInfo = (
    okInput: HTMLParagraphElement,
    errorInput: HTMLParagraphElement,
    ok: boolean,
    err: any,
    successMsg?: string
) => {
    if (!ok) {
        okInput.classList.remove('d-none');
        okInput.classList.add('d-none');
        errorInput.classList.remove('d-none');
        let message = err.message;
        if (typeof message !== 'string') {
            message = message.map(error => {
                return Object.keys(error.constraints)
                    .map(key => `${error.constraints[key]}`)
                    .join('\n');
            }).join(' - ');
        }
        errorInput.textContent = message;
        return;
    }

    errorInput.classList.remove('d-none');
    errorInput.classList.add('d-none');
    okInput.classList.remove('d-none');
    okInput.textContent = successMsg;
}