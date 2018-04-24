class OrderInformation {
    constructor() {
        this.clientName = "";
        this.clientSurName = "";
        this.quantity = 0;
        this.paymentType = "";
       this.run();

    }
    run() {
        if (sessionStorage.getItem("order")) {
            this.order = JSON.parse(sessionStorage.getItem("order"));
            this.dropdownForm("checkout__block_shipping","checkout__shipping_block");
            this.dropdownForm("checkout__block_billing","checkout__shipping_block2");
            this.dropdownForm("checkout__block_shippinginfo","checkout__shipping_block3");
            this.dropdownForm("checkout__block_paymentmethod","checkout__shipping_block4");
            this.dropdownForm("checkout__block_review","checkout__shipping_block5");
            this.billingInformationRender();
            this.shippingInformationRender();
            this.paymentMethod();
            this.orderReviewRender();
        } else {
            this.noOrder();
        }
    }
    noOrder() {
        $("#checkout").empty();
        $("<a />", {
            class: "checkout__noorderTitle",
            text: "Session is obsolete. Click to go to the cart and confirm the order again.",
            href: "./shoppingcart.html"
        }).appendTo($("#checkout"));
    }
    dropdownForm(buttonId, dropElementId){
        let $button = $("#" + buttonId);
        $button.on("click", () => {
            $("#" + dropElementId).toggle(500);
        })
    }
    billingInformationRender() {
       this.quantity = 0;
        for (let i = 0; i < this.order.items.length; i++) {
            this.quantity += this.order.items[i].count;
        }
    $("#order__quantity").text(this.quantity);
        $("#order__subtotal").text("$" + parseFloat(this.order.subTotal).toFixed(2));
        $("#order__discount").text("$" +  parseFloat(this.order.discount).toFixed(2));
        $("#order__delivery").text("$" +  parseFloat(this.order.shipping).toFixed(2));
        $("#order__total").text("$" +  parseFloat(this.order.grandTotal).toFixed(2));
    }
    shippingInformationRender() {
        $("#order__country").text(this.order.country);
        $("#order__state").text(this.order.state);
        $("#order__postcode").text(this.order.postcode);
    }
    paymentMethod() {
        $("#payment__card").on("click", function () {
            if ($("#payment__card:checked")) {
                $("#checkout__cardblock").css('visibility', 'visible');
            }
        });
        $("#payment__cash").on("click", function () {
            if ($("#payment__cash:checked")) {
                $("#checkout__cardblock").css('visibility', 'hidden');
            }
        });
        $("#confirm__payment").on("click", () => {
            event.preventDefault();
            this.confirmPayment();
        });
        $('#cardnumber__input').keyup(function () {
            let $this = $(this);
            if ($this.val().length > 18)
                $this.val($this.val().substr(0, 18));
        });
        $('#cardmounth__input').keyup(function () {
            let $this = $(this);
            if ($this.val().length > 2)
                $this.val($this.val().substr(0, 2));
        });
        $('#cardyear__input').keyup(function () {
            let $this = $(this);
            if ($this.val().length > 2)
                $this.val($this.val().substr(0, 2));
        });
        $('#cardcvv__input').keyup(function () {
            let $this = $(this);
            if ($this.val().length > 3)
                $this.val($this.val().substr(0, 3));
        });
        $('#cardname__input').keyup(function () {
            let $this = $(this);
            if ($this.val().length > 50)
                $this.val($this.val().substr(0, 50));
        });
    }
    confirmPayment(){
        this.paymentType = "";
        if ($("#payment__cash").prop("checked")) {
            this.paymentType = "Cash";
            $("#checkout__customer_payment").text("Payment type: " + this.paymentType);
            $("#checkout__customer_paymentstatus").text("Payment status: Payment on receipt");
        } else if($("#payment__card").prop("checked")) {
            let valid = true;
            if ($("#cardnumber__input").val() !== "") {
                let cardRegular = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
                if ($("#cardnumber__input").val().search(cardRegular) === 0) {
                    $("#cardnumber__input").css("border-color", "#E6E6E6")
                } else {
                    $("#cardnumber__input").css("border-color", "#f16d7f");
                    $("#cardnumber__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    $("#cardnumber__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    valid = false;

                }
            } else {
                $("#cardnumber__input").css("border-color", "#f16d7f");
                $("#cardnumber__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                $("#cardnumber__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                valid = false;
            }
            if ($("#cardmounth__input").val() !== "") {
                let cardRegular = /\D/;
                if (!cardRegular.exec($("#cardmounth__input").val()) && ($("#cardmounth__input").val().length === 2)) {
                    if (parseInt($("#cardmounth__input").val()) > 0 && parseInt($("#cardmounth__input").val()) < 13 ) {
                        $("#cardmounth__input").css("border-color", "#E6E6E6")
                    } else {
                        $("#cardmounth__input").css("border-color", "#f16d7f");
                        $("#cardmounth__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                        $("#cardmounth__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                        valid = false;
                    }
                } else {
                    $("#cardmounth__input").css("border-color", "#f16d7f");
                    $("#cardmounth__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    $("#cardmounth__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    valid = false;
                }
            } else {
                $("#cardmounth__input").css("border-color", "#f16d7f");
                $("#cardmounth__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                $("#cardmounth__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                valid = false;
            }
            if ($("#cardyear__input").val() !== "") {
                let cardRegular = /\D/;
                if (!cardRegular.exec($("#cardyear__input").val()) && ($("#cardyear__input").val().length === 2)) {
                        $("#cardyear__input").css("border-color", "#E6E6E6")
                } else {
                    $("#cardyear__input").css("border-color", "#f16d7f");
                    $("#cardyear__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    $("#cardyear__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    valid = false;
                }
            } else {
                $("#cardyear__input").css("border-color", "#f16d7f");
                $("#cardyear__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                $("#cardyear__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                valid = false;
            }
            if ($("#cardcvv__input").val() !== "") {
                let cardRegular = /\D/;
                if (!cardRegular.exec($("#cardcvv__input").val()) &&($("#cardcvv__input").val().length === 3)) {
                    $("#cardcvv__input").css("border-color", "#E6E6E6")
                } else {
                    $("#cardcvv__input").css("border-color", "#f16d7f");
                    $("#cardcvv__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    $("#cardcvv__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    valid = false;
                }
            } else {
                $("#cardcvv__input").css("border-color", "#f16d7f");
                $("#cardcvv__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                $("#cardcvv__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                valid = false;
            }
            if ($("#cardname__input").val() !== "") {
                let cardRegular = /[^a-zA-z.]/;
                if (cardRegular.exec($("#cardname__input").val())) {
                    $("#cardname__input").css("border-color", "#f16d7f");
                    $("#cardname__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    $("#cardname__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                    valid = false;
                    } else {
                    $("#cardname__input").css("border-color", "#E6E6E6")
                }
            } else {
                $("#cardname__input").css("border-color", "#f16d7f");
                $("#cardname__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                $("#cardname__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
                valid = false;
            }
            if (valid === true) {
                this.paymentType = "Credit card";
                $("#checkout__customer_paymentstatus").text("Payment status: waiting for payment");
            }
        }
        $("#checkout__customer_payment").text("Payment type: " + this.paymentType);
    }
    orderReviewRender() {
       $("#checkout__customer_name").text("Customer Name: " + this.clientName);
        $("#checkout__customer_surname").text("Customer Surname: " + this.clientSurName);
        $("#checkout__customer_quantity").text("Quantity of Goods: " + this.quantity);
        $("#checkout__customer_totalprice").text("Total price: $" + this.order.grandTotal.toFixed(2));
        $("#checkout__customer_country").text("Delivery country: " + this.order.country);
        $("#checkout__customer_state").text("Delivery state / postcode: " + this.order.state + " / " + this.order.postcode);
        $("#checkout__customer_payment").text("Payment type: " + this.paymentType);
        $("#checkout__customer_paymentstatus").text("Payment status: ");
    }
}