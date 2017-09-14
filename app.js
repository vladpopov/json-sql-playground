let url = document.querySelector('#urlField');
let login = document.querySelector('#loginField');
let password = document.querySelector('#passwordField');
let requestArea = document.querySelector('#requestField');
let api = document.querySelector('#apiField');
let respounceView = document.querySelector('#respounceView');
let JsCode = document.querySelector('#JsCodeField');
let token = '';

let loginButton = document.querySelector('#login');
let submitButton = document.querySelector('#submit');

submitButton.addEventListener('click', sendRequest);
loginButton.addEventListener('click', goLogin);

function sendRequest(e) {
    let reqJSON = {};
    if (url.value != '' && api.value != '') {
        try {
            if (requestArea.value != '') {
                reqJSON = JSON.parse(requestArea.value);
            }
        } catch (e) {
            alert('Request JSON data is incorrect!');
            return;
        }
        document.querySelector('.appStatus').textContent = 'Sending...';
        axios({
                method: 'post',
                url: url.value + api.value,
                headers: {
                    'X-HTTP-Method-Override': 'GET',
                    Authorization: 'Bearer ' + token
                },
                data: reqJSON
            }).then(function (response) {
                if (response.data) {
                    let review = JSON.stringify(response.data);
                    eval(JsCode.value);
                    respounceView.value = review;
                } else {
                    respounceView.value = 'Respounce data is null.'
                }
                document.querySelector('.appStatus').textContent = 'Ready!';
            })
            .catch(function (error) {
                alert('We got request error, check the browser console.')
                console.log(error);
            });
    } else {
        alert('Please, enter all data.');
    }
}

function goLogin(e) {
    if (login.value != '' && password.value != '' && url.value != '') {
        document.querySelector('.loginMsg').textContent = "I'm trying to enter...";
        axios.post(url.value + `/api/meta/account/${login.value}/login`, {
                password: password.value
            })
            .then(function (response) {
                if (response.data.token) {
                    document.querySelector('.loginMsg').textContent = 'You entered.';
                    token = response.data.token;
                } else {
                    document.querySelector('.loginMsg').textContent = "Login failed!";
                }
            })
            .catch(function (error) {
                alert('We got request error, check the browser console.');
                document.querySelector('.loginMsg').textContent = "Login failed!";
                console.log(error);
            });
    } else {
        alert('Please, enter all data.');
    }
}
