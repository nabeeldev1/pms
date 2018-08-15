function isLoggedIn() {
    const loggedIn = JSON.parse(localStorage.getItem('userObj')) ? true : false;
    return loggedIn;
}

export default isLoggedIn;