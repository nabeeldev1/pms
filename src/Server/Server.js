import initialData from '../Data/initialData';

export function getData() {
    return initialData;
}

export function signin(user) {
    localStorage.setItem('userObj', JSON.stringify(user));
    return true;
}