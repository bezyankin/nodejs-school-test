window.onload = initialize;//() => {console.log('hello')};//initialize;

var fieldNames = ["fio", "email", "phone"];

function initialize () {
    console.log('initialisation started');
  
    initGlobalObject();
    initActionHandlers();
    initForm();
}

function initGlobalObject () {
    window.MyForm = {
        validate: validate,
        getData: getData,
        setData: setData,
        submit: submit
    };
}

function validate (values) {
    console.log("valodation called");
    var result = {
        isValid: true,
        errorFields: []
    };

    // The string with 3 words (latin+cyrillic) tolerant 
    // to leading, trailing and extra spaces between words
    var threeWordsRegExp = /^\s*(?:[a-zA-Zа-яА-Я\-]+\s+){2}(?:[a-zA-Zа-яА-Я\-]+\s*){1}$/;
    if (!values.fio || !values.fio.match(threeWordsRegExp)) {
        result.isValid = false;
        result.errorFields.push('fio');
    }

    var emailRegexp = /^[\w\.]+@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex.com)$/;
    if (!values.email || !values.email.match(emailRegexp)) {
        result.isValid = false;
        result.errorFields.push('email');
    }

    var phoneRegexp = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    if (!values.phone || !values.phone.match(phoneRegexp)) {
        result.isValid = false;
        result.errorFields.push('phone');
    }

    var digitsRegexp = /\d/g;
    if (!values.phone) {
        result.isValid = false;
        result.errorFields.push('phone');
    } else {
        var digits = values.phone.match(digitsRegexp);

        if (!(digits instanceof Array)) {
            result.isValid = false;
            result.errorFields.push('phone');
        } else {
            var digitsSum = digits.reduce((sum, digit) => {
                return sum + +digit;
            }, 0);
            console.log('Digits sum is: ' + digitsSum);

            if (digitsSum > 30) {
                result.isValid = false;
                result.errorFields.push('phone');
            };
        }
    }

    return result;
}

function getData () {
    console.log("getData called");

    return {
        fio: document.querySelector('[name=fio]').value,
        email: document.querySelector('[name=email]').value,
        phone: document.querySelector('[name=phone]').value
    }    
}

function setData (values) {
    console.log("setData called");

    document.querySelector('[name=fio]').value = values.fio,
    document.querySelector('[name=email]').value = values.email,
    document.querySelector('[name=phone]').value = values.phone
}

function clearErrors () {
    fieldNames.forEach(fieldName => {
        document.querySelector('[name=' + fieldName + ']').className = '';
    });
}

function markErrors (invalidFieldNames) {
    invalidFieldNames.forEach(fieldName => {
        document.querySelector('[name=' + fieldName + ']').className = 'error';
    });
}

function submit (e) {
    console.log("submit called");
    if (e)
        e.preventDefault();

    var values = getData();
    
    var validationResult = validate(values);
    clearErrors();

    if (!validationResult.isValid) {
        markErrors(validationResult.errorFields);
        return;
    }

    document.querySelector("#submitButton").disabled = true;

    httpGet(handleResponse);
}

function handleResponse (response) {
    console.log(response);

    var resultContainer = document.querySelector('#resultContainer');

    if (response.status === "success") {
        resultContainer.innerText = "Success";
        resultContainer.className = "success";
        document.querySelector("#submitButton").disabled = false;
    }

    if (response.status === "error") {
        resultContainer.innerText = response.reason;
        resultContainer.className = "error";
        document.querySelector("#submitButton").disabled = false;
    }

    if (response.status === "progress") {
        resultContainer.innerText = "";
        resultContainer.className = "progress";
        setTimeout(submit, response.timeout);
    }
}

function initActionHandlers () {
    console.log('initActionHandlers called')

    document.querySelector('#myForm').onsubmit = submit;
    document.querySelector('#mockResponse').onchange = refreshUrl;

}

function initForm() {
    setData({
        fio: 'Francis Ford Coppola',
        email: 'coppola.francis@ya.ru',
        phone: '+7(912)000-22-22'
    });
}

function refreshUrl() {
    var responseStatus = document.querySelector('#mockResponse :checked').value;
    document.querySelector('#myForm').action = "http://localhost:9080/" + responseStatus + ".json";
}


////////////////////////////////////////////////
////////////////   API client   ////////////////
////////////////////////////////////////////////

function httpGet (callback) {
    console.log("real call of api here");

    var url = getUrlFromForm();

    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            callback(JSON.parse(request.response));
        }
    }

    request.send();
}

function getUrlFromForm () {
    return document.querySelector('#myForm').action;
}
