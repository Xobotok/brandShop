"use strict";
class Dropdown {
    constructor(element, dropmenu, dropmenuLinks, caret) {
        this.element = document.getElementById(element);
        this.dropmenu = document.getElementById(dropmenu);
        this.dropmenuLinks = document.getElementsByClassName(dropmenuLinks);
        this.caretElement = document.getElementById(caret);
        this. initializeButtons();
    }
    initializeButtons(){
        this.element.addEventListener("click",  () => {
            this.dropped()
        });
        for (let i = 0; i < this.dropmenuLinks.length; i++) {
            this.dropmenuLinks[i].addEventListener("click", () => {
                this.changeTitle()
            });
        }
    }
    dropped() {
        let visibility = window.getComputedStyle(this.dropmenu).visibility;
        if (visibility === "hidden" || visibility === "") {
            this.dropmenu.classList.remove("invisible");
            this.dropmenu.classList.add("visible");
        } else {
            this.dropmenu.classList.remove("visible");
            this.dropmenu.classList.add("invisible");
        }
    }

    changeTitle() {
        let newTextContent = event.target.textContent;
        this.element.textContent = newTextContent;
        if (this.caretElement) {
            this.element.appendChild(this.caretElement);
        }
        this.dropmenu.classList.remove("visible");
        this.dropmenu.classList.add("invisible");
    }
}
class DropBasketItem {
    constructor(item) {
        this.id = item.id;
        this.title = item.title;
        this.rating = item.rating;
        this.price = item.price;
        this.img = item.img;
        this.count = 1;
    }
}
class Basket {
    constructor() {
        this.dropDownCart = new Dropdown("header__cart", "basket__drop");
        this.element = document.getElementById("basket__drop");
        this.items = [];
        this.totalPrice = 0;

        if (localStorage.length > 0) {
            this.items = JSON.parse(localStorage.getItem("basket"));
        }
        this.basketDropRender(this);
    }

    refreshTotalPrice(){
        this.totalPrice = 0;
        for (let i = 0; i < this.items.length; i++) {
            this.totalPrice += this.items[i].price;
        }
    }
    addItem(item) {
        this.items.push(item);
        localStorage.setItem("basket", JSON.stringify(this.items));
        this.refreshTotalPrice();
        this.basketDropRender(this);
    }
    removeItem(item) {
        for (let i = 0; i < this.items.length; i++) {
           if (item === this.items[i]) {
               this.items.splice(i, 1);
               i--;
               break;
           } else if (item instanceof DropBasketItem) {
               if(this.items[i].id === item.id && parseInt(this.items[i].count) === 1) {
                   this.items.splice(i, 1);
                   i--;
                   break;
               } else if (this.items[i].id === item.id && parseInt(this.items[i].count) > 1){
                   this.items[i].count--;
                   break;
               }
           }
        }
        localStorage.setItem("basket", JSON.stringify(this.items));
        this.refreshTotalPrice();
        this.basketDropRender(this);
    }
    clearBasket() {
        this.items = [];
        localStorage.setItem("basket", JSON.stringify(this.items));
        this.refreshTotalPrice();
        this.basketDropRender(this);
    }
    basketDropRender(that) {
        let context = that;
        this.removeAll();
        if (this.items.length < 1) {
            this.noItems = document.createElement("h4");
            this.noItems.className = "noItems";
            this.noItems.setAttribute("id", "noItems");
            this.noItems.textContent = "No items in a cart";
            this.element.appendChild(this.noItems);
        } else {
            this.totalPrice = 0;
            let renderItems = [];
            for (let i = 0; i < that.items.length; i++) {
               if(that.items[i].count > 1) {
                   for (let n = 1; n < that.items[i].count; n++) {
                       renderItems.push(new DropBasketItem(this.items[i]));
                   }
               }
                renderItems.push(new DropBasketItem(this.items[i]));
            }
            for (let i = 0; i < renderItems.length; i++) {
                for (let n = i + 1; n < renderItems.length; n++) {
                    if (renderItems[i].id === renderItems[n].id) {
                        renderItems[i].count++;
                        renderItems.splice(n, 1);
                        n--;
                    }
                }
            }
            this.renderItems = renderItems;
            for (let i = 0; i < renderItems.length; i++) {
                this.totalPrice += renderItems[i].price * renderItems[i].count;
                let basketItem = $("<div />", {
                    class: "basket__item",
                });
                basketItem.appendTo(this.element);
                let basket__item_img = $("<img />", {
                    class: "basket__item_img",
                    src: renderItems[i].img
                });
                basket__item_img.appendTo(basketItem);

                let basket__item_title = $("<p />", {
                    class: "basket__item_title",
                    text: renderItems[i].title
                });
                basket__item_title.appendTo(basketItem);

                let stars = $("<div />", {
                    class: "stars"
                });
                stars.appendTo(basketItem);

                for(let n = 0; n < 5; n++) {
                    if (renderItems[i].rating - n > 0.5) {
                        let fullstar = $("<i class='fa fa-star star fullstar'></i>");
                        fullstar.appendTo(stars);
                    } else if (renderItems[i].rating - n === 0.5) {
                        let halfstar = $("<i class='fa fa-star-half-o star halfstar'></i>");
                        halfstar.appendTo(stars);
                    } else {
                        let emptystar = $("<i class='fa fa-star-o star emptystar'></i>");
                        emptystar.appendTo(stars);
                    }
                }
                let basket__item_price = $("<div />", {
                    class: "basket__item_price"
                });
                basket__item_price.appendTo(basketItem);

                let price = $("<p />", {
                    class: "price",
                    text: renderItems[i].count + " x " + "$" + renderItems[i].price,
                });
                price.appendTo(basket__item_price);

                let removeItem = $("<button class = \"basket__item_delete\"><i class = 'fa fa-times-circle'></i></button>", {
                });
                removeItem.on("click", function() {
                    context.removeItem(renderItems[i]);
                    context.basketDropRender(that);
                    if("#cont") {
                        context.bigBasketRender(that);
                    }

                });
                removeItem.appendTo(basketItem);
            }

            let totalContainer = document.createElement("div");
            let totalTitle = document.createElement("p");
            totalContainer.className = "total";
            totalTitle.classList.add("total__title");
            totalTitle.textContent = "total";
            totalContainer.appendChild(totalTitle);
            let totalPrice = document.createElement("p");
            totalPrice.classList.add("total__price");
            totalPrice.textContent = "$" + this.totalPrice.toFixed(2);
            totalContainer.appendChild(totalPrice);
            this.element.appendChild(totalContainer);

            let basket__drop_checkout = $("<a />", {
                class: "basket__drop_checkout",
                text: "checkout",
                href: "#"
            });
            basket__drop_checkout.appendTo(this.element);

            let basket__drop_gotocart = $("<a />", {
                class: "basket__drop_gotocart",
                text: "go to cart",
                href: "shoppingcart.html"
            });
            basket__drop_gotocart.appendTo(this.element);

            let basket__count = 0;
            for (let i = 0; i < this.items.length; i++) {
                basket__count+= parseInt(this.items[i].count);
            }
            let basket__drop_count = $("<p />", {
                class:"basket__drop_count",
                text: basket__count,
                id: "header__cart_count"
            });
            basket__drop_count.appendTo($("#header__cart"));
        }
    }
    bigBasketRender() {
        let context = this;
        let items = this.items;
        $("#cont").empty();
        if (this.items < 1) {
            let $emptyBasketCont = $("<div />", {
                class: "emptybasket__container",
            });
            $emptyBasketCont.appendTo($("#cont"));
            let $emptyBusketTitle = $("<h3 />", {
                class: "emptybasket__container_title",
                text: "No items in a cart"
            });
            $emptyBusketTitle.appendTo($emptyBasketCont);
        }
        for (let i = 0; i < items.length; i++) {
            if(items[i].count === "") {
                items[i].count = 1;
            }
            let $productsItem = $("<div />", {
                class: "product__item"
            });
            $productsItem.appendTo($("#cont"));
            let $div = $("<div />");
            $div.appendTo($productsItem);

            let $img = $("<img />", {
                class: "product__item_img",
                src: items[i].img,
                alt: items[i].title.toUpperCase(),
            });
            $img.appendTo($div);

            let $title = $("<h5 />", {
                class: "product__item_title",
                text: items[i].title,
            });
            $title.appendTo($div);
            let $color = $("<button />", {
                class: "product__item_color",
                text: "Color: " + items[i].actualColor[0].toUpperCase() + items[i].actualColor.substring(1),
            });
            $color.appendTo($div);
            let $colorDrop = $("<ul />", {
                class: "color__drop",
                id: "color" + items[i].id + i
            });
            $colorDrop.appendTo($div);
            $color.on("click", function () {
                $("#size" + items[i].id + i).hide(500);
                $("#color" + items[i].id + i).toggle(500);
            });
            for (let n = 0; n < items[i].color.length; n++) {
                let $colors = $("<li/>", {
                    text: items[i].color[n][0].toUpperCase() + items[i].color[n].substring(1),
                });
                $colors.appendTo($colorDrop);
                $colors.on("click", function () {
                    $color.text("Color: " + $colors.text());
                    items[i].actualColor = event.target.textContent;
                    localStorage.setItem("basket", JSON.stringify(context.items));
                    $colorDrop.hide(500);
                });
            }
            let $size = $("<button />", {
                class: "product__item_size",
                text: "Size: " + items[i].actualSize.toUpperCase(),
            });
            let $sizeDrop = $("<ul />", {
                class: "size__drop",
                id: "size" + items[i].id + i,
            });
            $size.appendTo($div);
            $size.on("click", function () {
                $("#size" + items[i].id + i).toggle(500);
                $("#color" + items[i].id + i).hide(500);
            });
            $sizeDrop.appendTo($div);
            for (let m = 0; m < items[i].size.length; m++) {
                let $sizes = $("<li />", {
                    text: items[i].size[m].toUpperCase(),
                    id: items[i].id + items[i].size[m].toUpperCase(),
                });
                $sizes.on("click", function () {
                    $size.text("Size: " + $sizes.text());
                    items[i].actualSize = event.target.textContent;
                    localStorage.setItem("basket", JSON.stringify(context.items));
                    console.log(items);
                    $colorDrop.hide(500);
                    $sizeDrop.hide(500);
                });
                $sizes.appendTo($sizeDrop);
            }
            let $currentPrice = $("<p />", {
                class: "product__item_currentprice",
                text: "$" + items[i].price.toFixed(2)
            });
            $currentPrice.appendTo($productsItem);

            let $quantity = $("<input>", {
                type: "text",
                value: parseInt(items[i].count),
                class: "product__item_quantity"
            });
            $quantity.appendTo($productsItem);
            let $shipping = $("<p />", {
                class: "product__item_shipping",
                text: "FREE",
            });
            $shipping.appendTo($productsItem);
            let $subtotal = $("<p />", {
                class: "product__item_subtotal",
                text: "$" + (items[i].price * items[i].count).toFixed(2),
            });
            $subtotal.appendTo($productsItem);
            $quantity.on("input", function (ev) {
                let reg = /\D/;
                if(reg.exec($(ev.target).val())) {
                    this.value = parseInt(items[i].count);
                    $subtotal.text("$" + (items[i].count * items[i].price).toFixed(2));
                } else {
                    if(parseInt(this.value) === 0) {
                        this.value = 1;
                        items[i].count = this.value;
                    }
                    if($(ev.target).val() <= 99) {
                    items[i].count = parseInt($(ev.target).val());
                    this.value = items[i].count;
                    $subtotal.text("$" + (items[i].count * items[i].price).toFixed(2));
                    localStorage.setItem("basket", JSON.stringify(items));
                    context.basketDropRender(context);
                    } else {
                        $(ev.target).val(99);
                        items[i].count = 99;
                        context.basketDropRender(context);
                    }
                }
            });
            $quantity.blur(function(){
                if (this.value === "") {
                    this.value = 1;
                    items[i].count = parseInt(this.value);
                    context.basketDropRender(context);
                    context.bigBasketRender();
                }
            });
            let $action = $('<p class=\"product__item_action\"><i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i></p>');
            $action.appendTo($productsItem);
            $action.on("click", function () {
                context.removeItem(items[i]);
                context.bigBasketRender();
                context.basketDropRender(context);
            });

        }
        let $buttonContainer = $("<div />", {
            class: "product__itembuttons",
        });
        $buttonContainer.appendTo($("#cont"));
        this.$buttonClear = $("<button />", {
            class: "product__itembuttons_button",
            id: "product__itembuttons_button",
            text: "clear shopping cart",
        });
        this.$buttonClear.appendTo($buttonContainer);
        this.$buttonClear.on("click", function () {
            context.clearBasket();
            context.basketDropRender(context);
            context.bigBasketRender();
        });
        let $buttonContinue = $("<a />", {
            class: "product__itembuttons_button",
            text: "continue shopping",
            href: "product.html"
        });
        $buttonContinue.appendTo($buttonContainer);

    }
    removeAll() {
        while (this.dropDownCart.dropmenu.firstChild) {
            this.dropDownCart.dropmenu.removeChild(this.dropDownCart.dropmenu.firstChild);
            let count = $("#header__cart_count");
            count.remove();
        }
    }
}
class Navigation {
    constructor(json) {
        this.json = json;
        this.jsonMenu = this.render(this.json);
    }

    render(json) {
        let jsonMenu = JSON.parse(json).menu;
        let container = document.getElementById("header__navigation");
        for (let i = 0; i < jsonMenu.length; i++) {
            let ul = document.createElement("ul");
            ul.classList.add(jsonMenu[i].class);
            ul.setAttribute("id", jsonMenu[i].id);
            let a = document.createElement("a");
            a.setAttribute("href", jsonMenu[i].href);
            a.classList.add("navigation__link");
            a.textContent = jsonMenu[i].content;
            a.setAttribute("href", jsonMenu[i].href);
            ul.appendChild(a);
            let dropdown = document.createElement("div");
            dropdown.classList.add("dropdown");
            container.appendChild(ul);
            if (jsonMenu[i].tabs.length > 0) {
                for (let n = 0; n < jsonMenu[i].tabs.length; n++) {
                    if (!jsonMenu[i].tabs[n].object) {
                        let subUl = document.createElement("ul");
                        let subLi = document.createElement("li");
                        let subA = document.createElement("a");
                        subA.setAttribute("href", jsonMenu[i].tabs[n].href);
                        subA.textContent = jsonMenu[i].tabs[n].name;
                        subLi.appendChild(subA);
                        subUl.appendChild(subLi);
                        dropdown.appendChild(subUl);
                        ul.appendChild(dropdown);
                    } else {
                        let subUl = document.createElement("ul");
                        let subLi = document.createElement("li");
                        subLi.textContent = jsonMenu[i].tabs[n].object;
                        subUl.appendChild(subLi);
                        dropdown.appendChild(subUl);
                        ul.appendChild(dropdown);
                        for (let m = 0; m < jsonMenu[i].tabs[n].tabs.length; m++) {
                            if (jsonMenu[i].tabs[n].tabs[m].name === "image") {
                                let subSubA = document.createElement("a");
                                subSubA.setAttribute("href", jsonMenu[i].tabs[n].tabs[m].href);
                                let subSubImg = document.createElement("img");
                                subSubImg.setAttribute("src", jsonMenu[i].tabs[n].tabs[m].src);
                                subSubImg.setAttribute("alt", jsonMenu[i].tabs[n].tabs[m].alt);
                                subSubA.appendChild(subSubImg);
                                subUl.appendChild(subSubA);
                                continue;
                            }
                            let subSubA = document.createElement("a");
                            subSubA.textContent = jsonMenu[i].tabs[n].tabs[m].name;
                            subSubA.setAttribute("href", jsonMenu[i].tabs[n].tabs[m].href);
                            subUl.appendChild(subSubA);
                        }
                    }
                }
            }
        }
    }
}

function jsonNavigationRequest(src) {
    let xhr = new XMLHttpRequest();
    let result = "";
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                result = xhr.responseText;
                new Navigation(result);
            } else {

            }
        }
    };
    xhr.open("GET", src);
    xhr.send();
}

function getRandomItems(items, count) {
    let myItems = items;
    let myCount = count;
    let randomItems = [];
    for (let i = 0; i < myCount; i++) {
        let rand = Math.floor(Math.random() * (myItems.length));
        randomItems.push(myItems[rand]);
        myItems.splice(rand,1);
    }
    return randomItems;
}


class Item {
    constructor(id, title, description, img, link, price, rating, designer, material, brand, category, color, size) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.img = img;
        this.link = link;
        this.price = price;
        this.rating = rating;
        this.designer = designer;
        this.material = material;
        this.brand = brand;
        this.category = category;
        this.color = color;
        this.size = size;
        this.count = 1;
        this.actualColor = this.color[0][0].toUpperCase() + this.color[0].substring(1).toLowerCase();
        this.actualSize = this.size[0].toUpperCase();
        this.collection = "";
    }
}
class SlideItem {
    constructor(id, img, alt, text, signature, town) {
        this.id = id;
        this.img = img;
        this.alt = alt;
        this.text = text;
        this.signature = signature;
        this.town = town;
        this.button = "";
    }
}
class Slider {
    constructor() {
        let that = this;
        this.jsonRequest(that);
        this.items = [];
        this.slider = $("#slider")[0];
        this.activeSlide = "";
        this.timer = 10000;
    }

    jsonRequest(that) {
        $.get({
            url: "./js/JSON/slider.json",
            dataType: "json",
            success: function (data) {
                let items = data.items;
                that.initialize(that, items);
            }
        });
    }

    initialize(context, items) {
        this.items = [];
        for (let i = 0; i < items.length; i++) {
            let sliderItem = new SlideItem(items[i].id, items[i].img, items[i].alt, items[i].text, items[i].signature,
                items[i].town);
            this.items.push(sliderItem);
        }
        this.render(this, this.items);

    }

    render(context, items) {
        let slideItems = items;
        let element = $("#slider");
        let buttons = $("<div />", {
            class: "slider__buttons",
        });
        for (let i = 0; i < slideItems.length; i++) {
            let slide = $("<div />", {
                class: "slider__slide invisible",
                id: slideItems[i].id
            });
            slide.appendTo(element);
            let img = $("<img />", {
                class: "slider__slide_img",
                src: slideItems[i].img,
                alt: slideItems[i].alt
            });
            img.appendTo(slide);
            let text = $("<p />", {
                class: "slider__slide_text",
                text: slideItems[i].text
            });
            text.appendTo(slide);
            let signature = $("<p />", {
                class: "slider__slide_signature",
                text: slideItems[i].signature
            });
            signature.appendTo(slide);
            let town = $("<p />", {
                class: "slider__slide_town",
                text: slideItems[i].town
            });
            town.appendTo(slide);
            let button = $("<button />", {
                class: "slider__slide_activate",
                id: "button" + slideItems[i].id
            });
            slideItems[i].button = "button" + slideItems[i].id;
            button.appendTo(buttons);
            button.on("click", function () {
                context.activateSlide(slideItems[i].button);
            })
        }
        buttons.appendTo(element);
        let randomSlide = this.items[Math.floor(Math.random() * 4)].id;
        document.getElementById(randomSlide).classList.add("visible");
        $("#" + "button" + randomSlide).toggleClass("active");

    }

    activateSlide(buttonId) {
        for (let i = 0; i < this.items.length; i++) {
            if (buttonId === "button" + this.items[i].id) {
                $("#" + this.items[i].id)[0].classList.add("visible");
                $("#" + "button" + this.items[i].id)[0].classList.add("active");
            } else {
                $("#" + this.items[i].id)[0].classList.remove("visible");
                $("#" + "button" + this.items[i].id)[0].classList.remove("active");
            }
        }
    }
}