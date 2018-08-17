export function isLoggedIn() {
    const loggedIn = JSON.parse(localStorage.getItem('userObj')) ? true : false;
    return loggedIn;
}

export function isLogout() {
    localStorage.removeItem('userObj');
    return true;
}