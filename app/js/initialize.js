"use strict";
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyDBsWgzUF3Q_cxeMpV2g0SkQSH7m82cTV0",
        authDomain: "adopets-btu-webapps.firebaseapp.com",
        projectId: "adopets-btu-webapps",
    });
}
else {
    // if already initialized
    firebase.app();
}
// initialize Firebase user authentication interface
const auth = firebase.auth();
//# sourceMappingURL=initialize.js.map