/**
 * leads to the authentification side if user needs to login for given page
 */
export function setupUiByUserStatus() {
    const page = window.location.pathname;
    const allowedPages = ["/", "/index.html", "/authentication.html", "/404.html", "/shelters/index.html", "/pets/index.html"];
    const loginMngEls = document.querySelectorAll("header > div#login-management > small");
    // reset (hide) all login management elements: [0]sign in/up , [1]sign out
    if (page !== "/authentication.html") {
        loginMngEls[0].hidden = loginMngEls[1].hidden = true;
    }
    //evaluate user authentication status
    auth.onAuthStateChanged(async function (user) {
        // if status is 'anonymous' or 'registered'
        if (user) {
            if (user.isAnonymous) { // if user is 'anonymous'
                if (!allowedPages.includes(page)) {
                    // redirect to authentication page
                    window.location.pathname = "/authentication.html";
                }
                loginMngEls[0].hidden = false; // show 'sign in/up'
                console.log("Authenticated as 'anonymous'");
            }
            else { // if user is 'registered'
                const spanEl = document.createElement("span");
                // handle without verified email
                if (!user.emailVerified) {
                    spanEl.textContent = `Check your email '${user.email}' for instructions to verify your account before using any operation `;
                }
                else {
                    spanEl.textContent = `${user.email} `;
                }
                loginMngEls[1].prepend(spanEl);
                loginMngEls[1].hidden = false; // show 'sign out'
                // if current page is not allowed & email is not verified
                if (!allowedPages.includes(page) && !user.emailVerified) { // if current page is not allowed
                    alert(`Check your email ${user.email} for instructions to verify your account before using this operation`);
                    window.location.pathname = "/index.html";
                }
                else if (page === "/" || page === "/index.html" || page === "/shelters/index.html" || page === "/pets/index.html") {
                    // enable UI elements on home page
                    const linkEls = document.querySelectorAll(".disabled");
                    for (const el of linkEls) {
                        el.classList.remove("disabled");
                    }
                    const clearDataButton = document.getElementById("clearData");
                    if (clearDataButton && clearDataButton instanceof HTMLButtonElement) {
                        clearDataButton.disabled = false;
                    }
                    const generateDataButtons = document.querySelectorAll(".createTestData");
                    for (const btn of generateDataButtons) {
                        if (btn instanceof HTMLButtonElement) {
                            btn.disabled = false;
                        }
                    }
                }
                // set and event handler for 'sign out' button
                const signOutButton = loginMngEls[1].querySelector("button");
                if (signOutButton) {
                    signOutButton.addEventListener("click", handleLogOut);
                }
                console.log(`Authenticated as 'registered with ${user.emailVerified ? '' : 'NO '}verified account' (${user.email})`);
            }
        }
        else { // if user is not 'registered' nor 'anonymous' (null)  
            // sign in user as 'anonymous' 
            auth.signInAnonymously();
        }
    });
}
export function setupSignInAndSignUp() {
    const form = document.forms.namedItem("User");
    const btnSignIn = form.signin;
    const btnSignUp = form.signup;
    // manage sign up event
    btnSignUp.addEventListener("click", handleSignUpButton);
    // manage sign in event
    btnSignIn.addEventListener("click", handleSignInButton);
    // neutralize the submit event
    form.addEventListener("submit", function (e) {
        e.preventDefault();
    });
    // console.log(document.referrer.split("/"));
    const path = document.referrer.split("/");
    var backPage = "/index.html";
    if (document.referrer.includes("/shelters/") || document.referrer.includes("/pets/")) {
        backPage = "/" + path[path.length - 2] + "/" + path[path.length - 1];
    }
    else {
        backPage = "/" + path[path.length - 1];
    }
    async function handleSignUpButton() {
        const formEl = document.forms.namedItem("User");
        const email = formEl.email.value;
        const password = formEl.password.value;
        if (email && password) {
            try {
                // get 'anonymous user' user data from IndexedDB
                const userRef = await auth.currentUser;
                // create credential with email and password
                const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                if (userRef) {
                    // create a 'registered' user merging credential with 'anonymous' user data
                    await userRef.linkWithCredential(credential);
                    // send verification email
                    await userRef.sendEmailVerification();
                }
                console.log(`User ${email} became 'Registered'`);
                alert(`Account created ${email}.\n\nCheck your email for instructions to verify this account.`);
                window.location.pathname = backPage;
            }
            catch (e) {
                const divEl = document.getElementById("error");
                if (divEl) {
                    const smallEl = divEl.querySelector("small");
                    if (smallEl) {
                        smallEl.textContent = e.message;
                    }
                    divEl.hidden = false;
                }
            }
        }
    }
    async function handleSignInButton() {
        const formEl = document.forms.namedItem("User");
        const email = formEl.email.value;
        const password = formEl.password.value;
        if (email && password) {
            try {
                const signIn = await auth.signInWithEmailAndPassword(email, password);
                if (signIn.user) {
                    if (signIn.user.emailVerified) {
                        console.log(`Granted access to user ${email}`);
                    }
                }
                window.location.pathname = backPage;
            }
            catch (e) {
                const divEl = document.getElementById("error");
                if (divEl) {
                    const smallEl = divEl.querySelector("small");
                    if (smallEl) {
                        smallEl.textContent = e.message;
                    }
                    divEl.hidden = false;
                }
            }
        }
    }
}
export async function handleVerifyEmail() {
    const urlParams = new URLSearchParams(location.search);
    const verificationCode = urlParams.get("oobCode"); // get verification code from URL
    const h1El = document.querySelector("main > h1");
    const pEl = document.querySelector("main > p");
    const linkEl = document.querySelector("footer > a");
    try { // if email can be verified
        if (verificationCode && h1El && pEl && linkEl) {
            // apply the email verification code
            await auth.applyActionCode(verificationCode);
            // if success, manipulate HTML elements: message, instructions and link
            h1El.textContent = "Your email has been verified.";
            pEl.textContent = "You can use now any operation on the Minimal App.";
            let textNodeEl = document.createTextNode("« Go to Minimal App");
            linkEl.appendChild(textNodeEl);
            linkEl.href = "index.html";
        }
    }
    catch (e) { // if email has been already verified
        if (verificationCode && h1El && pEl && linkEl) {
            // if error, manipulate HTML elements: message, instructions and link
            h1El.textContent = "Your validation link has been already used.";
            pEl.textContent = "You can now Sign In the JS + Firebase Minimal App with Auth.";
            let textNodeEl = document.createTextNode("« Go to the Sign in page");
            linkEl.appendChild(textNodeEl);
            linkEl.href = "authenticateUser.html";
            console.error(e.message);
        }
    }
}
export function handleLogOut() {
    try {
        auth.signOut();
        window.location.pathname = "/index.html";
    }
    catch (e) {
        console.error(e.message);
    }
}
//# sourceMappingURL=authentication.js.map