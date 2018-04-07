class Form {
    constructor() {
        this.form = $("#registration__form");
        this.name = $("#registration__form_name");
        this.country = $("#registration__form_country");
        this.email = $("#registration__form_mail");
        this.birthday = $("#registration__form_birthday");
        this.password = $("#registration__form_password");
        this.confirm = $("#registration__form_confirm");
        this.submit = $("#registration__form_submit");
            this.submit.on("click", this.stopDefAction, false, );
        this.submit.on("click", this.validate.bind(this));
    }

    stopDefAction(e) {
        e.preventDefault();
    }
    validate() {
        let name = "registration__form_name";
        let mail = "registration__form_mail";
        let country = "registration__form_country";
        let birthday = "registration__form_birthday";
        let password = "registration__form_password";
        let confirmPassword = "registration__form_confirm";
        this.error = false;
        this.nameValidation(name);
        this.emailValidation(mail);
        this.passwordValidation(password);
        this.passwordConfirm(password, confirmPassword);
    }
    nameValidation(name) {
        let reg = /^[а-яА-ЯёЁa-zA-Z]+$/gi;
        let value = document.getElementById(name).value;
        if (reg.test(value) === true) {
            this.name.removeClass("wrong");
            this.name.addClass("wright");
            $("#wrong__name").removeClass("visible");
            $("#wrong__name").addClass("invisible");
            return true;

        } else {
            this.name.removeClass("wright");
            this.name.addClass("wrong");
            this.name.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            this.name.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            this.error = true;
            $("#wrong__name").addClass("visible");
            $("#wrong__name").removeClass("invisible");
        }
    }
    emailValidation(email) {
        // language=JSRegexp
        let reg = /^[-\w.]+@([A-z][-A-z]+\.)+[A-z]{2,4}$/gi;
        let value = document.getElementById(email).value;
        if (reg.test(value) === true) {
            this.email.removeClass("wrong");
            this.email.addClass("wright");
            $("#wrong__email").removeClass("visible");
            $("#wrong__email").addClass("invisible");
            return true;

        } else {
            this.email.removeClass("wright");
            this.email.addClass("wrong");
            this.email.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            this.email.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#wrong__email").addClass("visible");
            $("#wrong__email").removeClass("invisible");

        }

    }
    passwordValidation(password) {
        // language=JSRegexp
        let reg = /^[a-zA-Z0-9]{6,20}$/gi;
        let value = document.getElementById(password).value;
        if (reg.test(value) === true) {
            this.password.removeClass("wrong");
            this.password.addClass("wright");
            $("#wrong__password").removeClass("visible");
            $("#wrong__password").addClass("invisible");
            return true;

        } else {
            this.password.removeClass("wright");
            this.password.addClass("wrong");
            this.password.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            this.password.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#wrong__password").addClass("visible");
            $("#wrong__password").removeClass("invisible");
        }

    }
    passwordConfirm(pass, conf){
        let reg = /^[a-zA-Z0-9]{6,20}$/gi;
        let password = document.getElementById(pass).value;
        let confirm = document.getElementById(conf).value;
        if (reg.test(confirm) === true && password === confirm) {
            this.confirm.removeClass("wrong");
            this.confirm.addClass("wright");
            $("#wrong__confirm").removeClass("visible");
            $("#wrong__confirm").addClass("invisible");
            return true;

        } else {
            this.confirm.removeClass("wright");
            this.confirm.addClass("wrong");
            this.confirm.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            this.confirm.toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#wrong__confirm").addClass("visible");
            $("#wrong__confirm").removeClass("invisible");

        }
        }


}

let form = new Form();