window.onload = initialize;//() => {console.log('hello')};//initialize;

var fieldNames = ["fio", "email", "phone"];

function initialize () {
    console.log('initialisation started');
  
    initGlobalObject();
    initActionHandlers();
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

    var form = document.querySelector('#myForm');

    var serverUrl = '';
    if (document.querySelector('#mockParameters').value) {
        serverUrl = 'localhost';
    } else {
        serverUrl = form.value;
    }
}

function initActionHandlers () {
    console.log('initActionHandlers called')

    document.querySelector('#myForm').onsubmit = submit;
}
