"use strict";

class OrderItem {
    constructor(item) {
        this.id = item.id;
        this.title = item.title;
        this.count = item.count;
        this.size = item.actualSize;
        this.color = item.actualColor;
        this.price = item.price;
        this.category = item.category;
        this.count = item.count;
        this.discount = 0;
    }
}

class Order {
    constructor(basket) {
        this.basket = basket;
        this.id += 1;
        this.items = [];
        this.subTotal = 0;
        this.shipping = 0;
        this.discount = 0;
        this.country = "";
        this.state = "";
        this.postcode = "";
        this.run();
        this.grandTotal = (this.subTotal + this.shipping - this.discount).toFixed(2);
        this.activeCoupon = "";
        this.itemsWithDiscount = [];
    }
    run(){
        this.initialize();
        this.deliveryCountries(this);
        this.totalPrice();
        this.initializeButtons();
    }
    validation() {
        this.refreshDiscount();
        this.calculateDeliveryCost();
        if (this.country.length < 1) {
            return false;
        }
        if(this.postcode.length < 1) {
            return false;
        }
        if(this.state.length < 1) {
            return false;
        }
        return true;
    }
    renderToCheckout() {
        if (this.validation() === false) {
            return;
        }
        if ($("#country__input").val().length < 1) {

            return;
        }
        let $orderdialog = $("#orderdialog");
        $orderdialog.empty();
        $orderdialog.dialog("open");
        $("<h4/>", {
            class: "orderdialog__title",
            text: "please, check your order."
        }).appendTo($orderdialog);

        for (let i = 0; i < this.items.length; i++) {
            let $item = $("<div />", {
                class: "orderdialog__item"
            });
            $item.appendTo($orderdialog);
            let $itemTitle = $("<h5 />", {
                class: "orderdialog__item_title",
                text: this.items[i].title,
            });
            $itemTitle.appendTo($item);
            let $itemColor = $("<p />", {
                class: "orderdialog__item_desc",
                text: "Color: " + this.items[i].color,
            });
            $itemColor.appendTo($item);
            let $itemSize = $("<p />", {
                class: "orderdialog__item_desc",
                text: "Size: " + this.items[i].size,
            });
            $itemSize.appendTo($item);
            let $itemCount = $("<p />", {
                class: "orderdialog__item_desc",
                text: "Count: " + this.items[i].count,
            });
            $itemCount.appendTo($item);
            let $itemPrice = $("<p />", {
                class: "orderdialog__item_desc",
                text: "Price: $" + (this.items[i].price * this.items[i].count).toFixed(2),
            });
            $itemPrice.appendTo($item);
        }
        let $deliveryAdress = $("<h5 />", {
            class: "delivery__address_title",
            text: "Delivery address",
        });
        $deliveryAdress.appendTo($orderdialog);
        let $deliveryContainer = $("<div />", {
            class: "delivery__address"
        });
        $deliveryContainer.appendTo($orderdialog);
        let $deliveryCountry = $("<h5 />", {
            class: "delivery__address_country",
            text: "Country: " + this.country,
        });
        $deliveryCountry.appendTo($deliveryContainer);
        let $deliveryState = $("<h5 />", {
            class: "delivery__address_country",
            text: "State: " + this.state,
        });
        $deliveryState.appendTo($deliveryContainer);
        let $deliveryPostcode = $("<h5 />", {
            class: "delivery__address_country",
            text: "Postcode: " + this.postcode,
        });
        $deliveryPostcode.appendTo($deliveryContainer);
        let $delivery = $("<h5 />", {
            class: "orderdialog__delivery",
            text: "Delivery: $" + this.shipping
        });
        $delivery.appendTo($orderdialog);
        if(this.discount > 0) {
            let $discount = $("<h5 />", {
                class: "orderdialog__delivery",
                text: "Discount: $" + (parseFloat(this.discount).toFixed(2))
            });
            $discount.appendTo($orderdialog);
        }
        let $discount = $("<h5 />", {
            class: "orderdialog__delivery orderdialog__total",
            text: "Total price: $" + this.grandTotal.toFixed(2)
        });
        $discount.appendTo($orderdialog);
    }
    setGrandTotal() {
        this.grandTotal = this.subTotal + this.shipping - this.discount;
        this.totalPrice();
    }

    initialize() {
        this.items = [];
        this.subTotal = 0;
        let basketItems = JSON.parse(localStorage.getItem("basket"));
        for (let i = 0; i < basketItems.length; i++) {
            this.items.push(new OrderItem(basketItems[i]));
            this.subTotal += (basketItems[i].price * basketItems[i].count);
        }
        this.setGrandTotal();
    }
    refreshDiscount() {
        this.discount = 0;
        if(this.activeCoupon) {
            for (let i = 0; i < this.itemsWithDiscount.length; i++) {
                this.discount += this.itemsWithDiscount[i].count *
                    (this.itemsWithDiscount[i].price * (this.activeCoupon.discount/100));
            }
            this.discount = this.discount.toFixed(2);
        }
        if(this.discount > 0) {
            $("#shipping__total_discount").text("Your discount: $" + this.discount);
            $("#shipping__total_discount").addClass("visible");
            $("#shipping__total_discount").removeClass("invisible");
        } else {
            $("#shipping__total_discount").removeClass("visible");
            $("#shipping__total_discount").addClass("invisible");
        }
        this.setGrandTotal();
    }
    initializeButtons(){
        for (let i = 0; i < $(".product__item_action").length; i++) {
            let button = $(".product__item_action")[i];
            button.onclick = event => {
                if(this.activeCoupon) {
                    $("#shipping__discount_nocoupon").text("Your order has changed, please apply coupon again.");
                }
                this.activeCoupon = "";
                this.initialize();
                this.refreshDiscount();
                this.initializeButtons();
            };
        }
        for (let i = 0; i < $(".basket__item_delete").length; i++) {
            let button = $(".basket__item_delete")[i];
            button.onclick = event => {
                if(this.activeCoupon) {
                    $("#shipping__discount_nocoupon").text("Your order has changed, please apply coupon again.");
                }
                this.activeCoupon = "";
                this.initialize();
                this.refreshDiscount();
                this.initializeButtons();
            };
        }
        for (let i = 0; i < $(".product__item_quantity").length; i++) {
            $(".product__item_quantity")[i].oninput  = event => {
                if(this.activeCoupon) {
                    $("#shipping__discount_nocoupon").text("Your order has changed, please apply coupon again.");
                }
                this.activeCoupon = "";
                this.initialize();
                this.refreshDiscount();
                this.initializeButtons();
            };
        }
        this.basket.$buttonClear.click(() => {
            this.activeCoupon = "";
            this.initialize();
            this.refreshDiscount();
            this.initializeButtons();
        });
        let $orderdialog = $("#orderdialog");
        $orderdialog.dialog({
            modal: true,
            zIndex: 1000,
            minWidth: 1180,
            autoOpen: false,
            closeOnEscape: true,
            resizable: false,
            hide: 'fade',
            show: 'fade',
            buttons: [{text: "Confirm", click: () => {
            let order = this;
            sessionStorage.setItem("order",JSON.stringify(order));
                document.location.href = "./checkout.html"
            }, class: "orderdialog__button confirm", id: "orderdialog__confirm"},{text: "Close", click: function () {
                $orderdialog.dialog("close");
            }, class: "orderdialog__button close", id: "orderdialog__close"}]
        });
        $("#shipping__total_order").click(event => {
            this.renderToCheckout();
        });
    }
    deliveryCountries(context) {
        this.countryList = "";
        $.get({
            url: "./js/JSON/country.json",
            dataType: "json",
            context: this,
            success: function (data) {
                this.countryList = data;
                let countryNames = [];
                for (let i = 0; i < this.countryList.length; i++) {
                    countryNames.push(this.countryList[i].name)
                }
                $("#country__input").autocomplete({
                    source: countryNames,
                    minLength: 1
                });
            }
        });
        $("#get_the_cost").on("click", function (event) {
            event.preventDefault();
            context.calculateDeliveryCost();
            context.initialize();
            if(context.shipping > 0) {
                for (let i = 0; i < $(".product__item_shipping").length; i++) {
                    $(".product__item_shipping")[i].innerText = "$" + context.shipping;
                }
            } else {
                for (let i = 0; i < $(".product__item_shipping").length; i++) {
                    $(".product__item_shipping")[i].innerText = "FREE";
                }
            }
        });
    }
    calculateDeliveryCost() {
        this.shipping = 0;
        this.country = "";
        this.state = "";
        this.postcode = "";
        for (let i = 0; i < this.countryList.length; i++) {
           if ($("#country__input").val().toLowerCase() === this.countryList[i].name.toLowerCase()) {
               this.shipping = 20 * this.countryList[i].type;
               this.country = this.countryList[i].name;
               $("#shipping__address_cost").text(" Delivery: $" + this.shipping);
               $("#shipping__address_cost").css("color", "#f16d7f");
               $("#shipping__address_cost").css("border-color", "#f16d7f");
               $("#country__input").removeClass("invalid");
               $("#country__invalid").css("opacity", "0");
               break;
           }
        }
        if (this.shipping === 0) {
            $("#shipping__address_cost").text("Country of delivery not found.");
            $("#shipping__address_cost").css("color", "#f16d7f");
            $("#shipping__address_cost").css("border-color", "#f16d7f");
            $("#country__input").addClass("invalid");
            $("#country__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#country__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#country__invalid").css("opacity", "1");
        }
        if($("#state__input").val().length < 1) {
            $("#state__input").addClass("invalid");
            $("#state__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#state__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#state__invalid").css("opacity", "1");
        } else {
            $("#state__invalid").css("opacity", "0");
            $("#state__input").removeClass("invalid");
            this.state = $("#state__input").val().toLowerCase();
        }
        if($("#postcode__input").val().length < 1) {
            $("#postcode__input").addClass("invalid");
            $("#postcode__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#postcode__input").toggle("shake", {direction: "up", distance: 1, times:3}, 50);
            $("#postcode__invalid").css("opacity", "1");
        } else {
            $("#postcode__invalid").css("opacity", "0");
            $("#postcode__input").removeClass("invalid");
            this.postcode = $("#postcode__input").val().toLowerCase();
        }
        this.setGrandTotal();

    }
    totalPrice() {
    $("#shipping__total_subtotal").text("Subtotal");
    $("<span/>" , {
        text: "$" + this.subTotal.toFixed(2)
    }).appendTo($("#shipping__total_subtotal"));

        $("#shipping__total_grandtotal").text("grandtotal");
        $("<span />", {
            text: "$" + this.grandTotal.toFixed(2)
        }).appendTo($("#shipping__total_grandtotal"));
    }
}

class CouponList {
    constructor(order) {
        this.couponList = [];
        this.items = order;
        this.initialize(this);
    }

    initialize(context) {
        $.get({
            url: "js/JSON/coupon.json",
            dataType: "json",
            context: this,
            success: function (data) {
                this.makeCouponList(data);
            }
        });
        let discountApply = $("#shipping__discount_apply");
        discountApply.on("click", function () {
            context.applyCoupon($("#coupon__input").val(), context.items);

        });
    }

    makeCouponList(list) {
        for (let i = 0; i < list.length; i++) {
            this.couponList.push(new Coupon(list[i].id, list[i].code, list[i].type, list[i].discount, list[i].items))
        }
    }

    applyCoupon(code, order) {
        order.discount = 0;
        order.activeCoupon = "";
        order.itemsWithDiscount = [];
        order.refreshDiscount();
        order.setGrandTotal();
        if(order.items.length < 1) {
            $("#shipping__discount_nocoupon").text("Add items to the cart to be able to activate the coupon.")
        return;
        }
            for (let i = 0; i < this.couponList.length; i++) {
                if (this.couponList[i].code === code) {
                    order.activeCoupon = this.couponList[i];
                    break;
                }
            }

        if(!order.activeCoupon && order.items.length > 0) {
                $("#shipping__discount_nocoupon").text("Coupon with this code does not exist.");
        }
        switch (order.activeCoupon.type) {
            case "all": {
                for (let i = 0; i < order.items.length; i++) {
                    order.itemsWithDiscount.push(order.items[i]);
                }
                order.refreshDiscount();
                order.initialize();
                $("#shipping__discount_nocoupon").text("You activated coupon. Your discount: "
                    + order.activeCoupon.discount + "%");
                break;
            }
            case "category": {
                for (let n = 0; n < order.items.length; n++) {
                    for (let m = 0; m < order.activeCoupon.items.length; m++) {
                        if (order.items[n].category === order.activeCoupon.items[m]) {
                            order.itemsWithDiscount.push(order.items[n]);
                        }
                    }
                }
                order.refreshDiscount();
                order.initialize();
                if (order.discount === 0) {
                    $("#shipping__discount_nocoupon").text("Discount does not apply to the items you selected.")
                } else {
                    $("#shipping__discount_nocoupon").text("You activated coupon. Your discount: $"
                        + order.discount);
                }
                break;
            }
            case "regular": {
                if (order.subTotal >= order.activeCoupon.items[0]) {
                    for (let i = 0; i < order.items.length; i++) {
                        order.itemsWithDiscount.push(order.items[i]);
                    }
                    order.refreshDiscount();
                    order.initialize();
                    $("#shipping__discount_nocoupon").text("You activated coupon. Your discount: "
                        + order.discount + "%");
                } else {
                    $("#shipping__discount_nocoupon").text("The coupon is valid for purchases from $" +
                        order.activeCoupon.items[0] + ".");
                }
                break;
            }
            case "personal": {
                for (let i = 0; i < order.items.length; i++) {
                    for (let n = 0; n < order.activeCoupon.items.length; n++) {
                        if(order.items[i].id === order.activeCoupon.items[n]) {
                            order.itemsWithDiscount.push(order.items[i]);
                        }
                    }
                }
                order.refreshDiscount();
                order.initialize();
                if (order.discount === 0) {
                    $("#shipping__discount_nocoupon").text("Discount does not apply to the items you selected.")
                } else {
                    $("#shipping__discount_nocoupon").text("You activated the coupon. Your discount: $"
                        + order.discount);
                }
                break;
            }
        }
    }
}


class Coupon {
    constructor(id, code, type, discount, items) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.discount = discount;
        this.items = items;
        this.couponList = '';

    }
}



