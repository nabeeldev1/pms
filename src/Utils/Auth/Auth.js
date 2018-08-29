export function isLoggedIn() {
    let loggedIn = false;
    const userObj = JSON.parse(localStorage.getItem('userObj'));
    if(userObj && userObj.token) {
        return loggedIn = true;
    }
    return loggedIn;
}

export function isLogout() {
    localStorage.removeItem('userObj');
    return true;
}

export function getToken() {
    let token = null;
    const userObj = JSON.parse(localStorage.getItem('userObj'));
    if(userObj && userObj.token) {
        token = userObj.token;
        return token;
    }
    return token;
}

export function getHeaders() {
    let token = getToken();
    if(token !== null) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token 
        }
        return headers;
    }
}