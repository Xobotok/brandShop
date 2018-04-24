'use strict';
class IndexItems {
    constructor(count, basket, row, column) {
        let that = this;
        this.basket = basket;
        this.row = row;
        this.column = column;
        this.count = count;
        this.items = [];
        this.initialize(that);

    }
    initialize(that){
        $.get({
            url: "./js/JSON/items.json",
            dataType: "json",
            context: this,
            success: function(data) {
                let items = data.items;
                for (let i = 0; i < items.length; i++) {
                    this.items.push(new Item(items[i].id,items[i].title, items[i].description, items[i].img, items[i].link,
                        items[i].price, items[i].rating, items[i].designer, items[i].material, items[i].brand, items[i].category,
                        items[i].color, items[i].size));
                }
                that.render(getRandomItems(this.items, this.count), that.basket, that.row, that.column);
            }
        });

    }
    render(items, basket, row, column){

        for (let n = 0; n < row; n++) {
            let $itemblock = $('<div />', {
                class: "featured__itemblock",
            }).appendTo("#featured");
            for (let i = n * column; i < (n + 1) * column && i < items.length; i++) {
                let item = $('<div class = "featured__item"></div>').appendTo($itemblock);
                let substrate = $('<div />', {
                    class: "substrate"
                }).appendTo(item);
                let img = $('<img />', {
                    class: "featured__item_img",
                    src: items[i].img
                }).appendTo(substrate);
                let title = $('<a />', {
                    class: "featured__item_title",
                    text: items[i].title,
                    href: items[i].link
                }).appendTo(item);
                let price = $('<h4 />', {
                    class: "featured__item_price",
                    text: "$" + items[i].price.toFixed(2)
                }).appendTo(item);
                let button = $('<button class = "featured__item_add"><i class = "fa fa-cart-plus"></i>Add to Cart</button>', {
                }).appendTo(item);
                button.on("click",  function() {
                    basket.addItem(items[i]);
                });
            }
        }



        let featured__browseall = $("<div />", {
            class: "featured__browseall"
        });
        featured__browseall.appendTo("#featured");

        let featured__browseall_link = $("<a class = \"featured__browseall_link\" href = 'product.html'>Browse All Product  &#10144;</a>");
        featured__browseall_link.appendTo(featured__browseall);
    }
}

"use strict";
class Dropdown {
    constructor(element, dropmenu, dropmenuLinks, caret) {
        this.element = document.getElementById(element);
        this.dropmenu = document.getElementById(dropmenu);
        this.dropmenuLinks = document.getElementsByClassName(dropmenuLinks);
        this.caretElement = document.getElementById(caret);
        this.element.addEventListener("click", this.dropped.bind(this));
        for (let i = 0; i < this.dropmenuLinks.length; i++) {
            this.dropmenuLinks[i].addEventListener("click", this.changeTitle.bind(this));
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
        console.log(this.items);
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
               } else if (this.items[i].id === item.id && this.items[i].count > 1){
                   this.items[i].count--;
                   break;
               }
           }
        }
        // for (let i = 0; i < this.items.length; i++) {
        //     if (item.actualSize) {
        //         if(item.id === this.items[i].id && item.actualSize === this.items[i].actualSize &&
        //         item.actualColor === this.items[i].actualSize) {
        //             this.items.splice(i, 1);
        //             i--;
        //         }
        //         break;
        //     }
        //     if(item.id === this.items[i].id) {
        //         this.items.splice(i, 1);
        //         i--;
        //         break;
        //     }
        // }
        console.log(this.items);
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
                value: items[i].count,
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
                    this.value = items[i].count;
                    $subtotal.text("$" + (items[i].count * items[i].price).toFixed(2));
                    console.log("Регулярка не работает")
                } else {
                    if(parseInt(this.value) === 0) {
                        this.value = 1;
                        items[i].count = this.value();
                    }
                    if($(ev.target).val() < 99) {
                    items[i].count = $(ev.target).val();
                    this.value = items[i].count;
                    $subtotal.text("$" + (items[i].count * items[i].price).toFixed(2));
                    localStorage.setItem("basket", JSON.stringify(items));
                    context.basketDropRender(context);
                    } else {
                        $(ev.target).val(99);
                        items[i].count = this.value();
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
        let $buttonClear = $("<button />", {
            class: "product__itembuttons_button",
            text: "clear shopping cart",
        });
        $buttonClear.appendTo($buttonContainer);
        $buttonClear.on("click", function () {
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

"use strict";
function sortingItems(sorting, items) {
    switch (sorting) {
        case "Name": {
            let n = items.length;
            do {
                var swapped = false;
                for (let i = 1; i < n; i++) {
                    if (items[i - 1].title.toUpperCase() > items[i].title.toUpperCase()) {
                        let tmp = items[i - 1];
                        items[i - 1] = items[i];
                        items[i] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped);
            break;
        }
        case "Price": {
            let n = items.length;
            do {
                var swapped = false;
                for (let i = 1; i < n; i++) {
                    if (items[i - 1].price > items[i].price) {
                        let tmp = items[i - 1];
                        items[i - 1] = items[i];
                        items[i] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped);
            break;
        }
        case "Rating": {
            let n = items.length;
            do {
                var swapped = false;
                for (let i = 1; i < n; i++) {
                    if (items[i - 1].rating > items[i].rating) {
                        let tmp = items[i - 1];
                        items[i - 1] = items[i];
                        items[i] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped);
            break;
        }
    }
    return items;
}

/**
 * class ProductItems - класс, создающий, хранящий и отрисоывающий элементы на странице
 * @property {basket} - принимает объект корзины, куда можно будет добавить созданные элементы
 * @property {number} row - принимает количество строк элементов, которые будут находиться на одной странице
 * @property {number} column - количество колонок элементов на одной странице.
 * @param [{items}] - список объектов типа Items, с которыми будут работать методы класса
 * @param [pages] - список объектов типа Items, разбитых на страницы и записанных в двумерный массив.
 * @param {number} activePage - текущая страница, которую необходимо отрисовать. По умолчанию это страница 1
 * @function jsonRender(src) - принимает адрес json файла, в котором находится список товаров,
 * записывая эти товары в массив items и запускает метод run
 * @function run() - сперва чистит контейнер, затем запускает процесс создания и отрисовки всех элементов страницы.
 * @function makePages() - получает список элементов Items, количество элементов на странице count
 * и разбивает все переданные элементы на страницы. Возвращает двумерный массив элементов, разбитых на страницы.
 * @function renderPage() - принимает [pages] - массив объектов Items, разбитых на страницы,
 * pageNumber - номер страницы для отрисовки, row - количество строк элементов на странице,
 * col - количество колонок элементов на странице, затем отрисовывает эти элементы и присваивает
 * функцию добавления товара в корзину.
 * @function renderPageCount() - создаёт и отрисовывает список всех страниц, присваивая им функцию
 * переключения между страницами, а так же создаёт кнопку, сбрасывающую все фильтры
 * и запускающую отрисовку всех страниц и элементов по умолчанию.
 */
class ProductItems {
    constructor(basket, row, column) {
        this.basket = basket;
        this.row = row;
        this.column = column;
        this.items = [];
        this.pages = [];
        this.activePage = 1;
        this.sorting = "";
        this.jsonRequest("./js/JSON/items.json");
    }

    run() {
        $("#featured").empty();
        sortingItems(this.sorting, this.items);
        this.pages = this.makePages(this.items, this.row * this.column);
        this.renderPage(this.pages, this.activePage, this.row, this.column);
        this.renderPageCount();
    }
    showItemsOnPage(itemsCount) {
        this.row = itemsCount/this.column;
        this.run();
    }
    renderPage(pages, pageNumber, row, col) {
        if (pageNumber === 0) {
            pageNumber = 1;
        }
        if (this.items.length > 0) {
            let that = this;
            let page = 0;
            if (pages.length < pageNumber) {
                page = pages[pages.length - 1].pageItems;
                this.activePage = pages.length;
            } else {
                page = pages[pageNumber - 1].pageItems;
            }
            $("div.featured__itemblock").remove();
            for (let i = 0; i < row; i++) {
                let $itemblock = $('<div />', {
                    class: "featured__itemblock",
                }).appendTo("#featured");
                for (let n = col * i; n < col * (i + 1) && n < page.length; n++) {
                    let item = $('<div class = "featured__item"></div>').appendTo($itemblock);
                    item.attr('id', page[n].id);
                    $(item).draggable({
                        revert: true,
                        revertDuration: 400,
                        scrol: true,
                        zIndex: 99
                    });
                    $("#basket__drop").droppable({
                        drop: function () {
                            $(".ui-droppable-active").addClass("visible");
                            for (let x = 0; x < page.length; x++) {
                                if ($(".ui-draggable-dragging").attr("id") === page[x].id) {
                                    that.basket.addItem(page[x]);
                                    break;
                                }
                            }
                            let $added = $("<h4 class = item__added><i class=\"fa fa-check-circle-o\" aria-hidden=\"true\"></i></h4>");
                            $added.dialog({
                                modal: true,
                                show: 'fade',
                                hide: 'fade',
                            });
                            $added.dialog("close");
                        }
                    });
                    let substrate = $('<div />', {
                        class: "substrate"
                    }).appendTo(item);
                    let img = $('<img />', {
                        class: "featured__item_img",
                        src: page[n].img
                    }).appendTo(substrate);
                    let title = $('<a />', {
                        class: "featured__item_title",
                        text: page[n].title,
                        href: page[n].link
                    }).appendTo(item);
                    let price = $('<h4 />', {
                        class: "featured__item_price",
                        text: "$" + page[n].price.toFixed(2)
                    }).appendTo(item);
                    let button = $('<button class = "featured__item_add"><i class = "fa fa-cart-plus"></i>Add to Cart</button>', {}).appendTo(item);
                    button.on("click", function () {
                        console.log(page[n]);
                        that.basket.addItem(page[n]);
                    });
                }
            }
            for (let i = 0; i < $(".sorting__by_count").length; i++) {
                $(".sorting__by_count")[i].onclick = function () {
                    that.sorting = this.textContent;
                    that.run();
                }
            }
            for (let i = 0; i < $(".sorting__container_count").length; i++) {
                $(".sorting__container_count")[i].onclick = function () {
                    that.showItemsOnPage(parseInt($(".sorting__container_count")[i].textContent))
                }
            }
        } else {
            this.noItemsForRender();
        }
    }

    makePages(items, counts) {
        let pages = [];
        for (let i = 0; i < items.length / counts; i++) {
            let page = {
                id: i,
                pageItems: []
            };
            for (let n = counts * i; n < items.length && n < counts * (i + 1); n++) {
                page.pageItems.push(items[n]);
            }
            pages.push(page);
        }
        return pages;
    }

    renderPageCount() {
        let context = this;
        let $pageContainer = $("<div/>", {
            class: "pagecontainer",
            id: "pagecontainer"
        });
        $pageContainer.appendTo("#featured");
        let $pagePrevious = $("<p class = page><i class=\"fa fa-chevron-left\" aria-hidden=\"true\"></i></p>");
        $pagePrevious.appendTo($($pageContainer));
        $pagePrevious.on("click", function () {
            if (context.activePage > 1) {
                context.activePage--;
                context.renderPage(context.pages, context.activePage, context.row, context.column);
                $(".page").removeClass("page__active");
                $("#page" + (context.activePage - 1)).addClass("page__active");
            }

        });
        for (let i = 0; i < this.pages.length; i++) {
            let $page = $("<p />", {
                class: "page",
                text: i + 1,
                id: "page" + i
            });
            $page.appendTo($pageContainer);
            $page.on("click", function () {
                context.activePage = i + 1;
                context.renderPage(context.pages, context.activePage, context.row, context.column);
                $(".page").removeClass("page__active");
                $("#page" + (context.activePage - 1)).addClass("page__active");
            })
        }
        let $pageNext = $("<p class = page><i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i></p>");
        $pageNext.appendTo($($pageContainer));
        $pageNext.on("click", function () {
            if (context.activePage < context.pages.length) {
                context.activePage++;
                context.renderPage(context.pages, context.activePage, context.row, context.column);
                $(".page").removeClass("page__active");
                $("#page" + (context.activePage - 1)).addClass("page__active");
            }
        });
        $("#page" + (this.activePage - 1)).addClass("page__active");

        let $viewAll = $("<button />", {
            class: "featured__viewall",
            text: "View All"
        });
        $viewAll.appendTo($("#featured"));
        $viewAll.on("click", function () {
            location.reload();


        })
    }

    jsonRequest(jsonSrc) {
        $.get({
            url: jsonSrc,
            dataType: "json",
            context: this,
            success: function (data) {
                this.items = [];
                for (let i = 0; i < data.items.length; i++) {
                    this.items.push(new Item(data.items[i].id, data.items[i].title, data.items[i].description, data.items[i].img,
                        data.items[i].link, data.items[i].price, data.items[i].rating, data.items[i].designer, data.items[i].material,
                        data.items[i].brand, data.items[i].category, data.items[i].color, data.items[i].size));
                }
                this.run();
            }
        });
    }
    noItemsForRender() {
        $("#featured").empty();
        this.items = [];
        let $noItemsContainer = $("<div />" , {
            class: "featured__noitems",
        });
        $noItemsContainer.appendTo($("#featured"));
        let $noItemsText = $("<h3 />", {
            class: "featured__noitems_text",
            text: "There are no products matching your search."
        });
        $noItemsText.appendTo($noItemsContainer);
        let $viewAll = $("<button />", {
            class: "featured__viewall",
            text: "View All"
        });
        $viewAll.appendTo($("#featured"));
        $viewAll.on("click", function () {
            location.reload();
        })
    }
}

/**
 * Удаляет повторения в переданном массиве
 * @param [array] - принимает массив, из которого нужно удалить повторяющиеся элементы
 * @return [] - возвращает новый массив, где каждый элемент встречается 1 раз
 */
function removeDuplicates(array) {
    let newArray = array;
    for (let i = 0; i < newArray.length; i++) {
        for (let n = i; n < array.length; n++) {
            if (newArray[i] === newArray[n + 1]) {
                newArray.splice(n + 1, 1);
                n--;
            }
        }
    }
    return newArray;
}

/**
 *
 * @param array - принимает двумерный массив.
 * @return {*} - возвращает все элементы двумерного массива в одномерном массиве.
 */
function removeDuplicatesDoubleArray(array) {
    let doubleArray = array;
    let justArray = [];
    for (let i = 0; i < doubleArray.length; i++) {
        for (let n = 0; n < doubleArray[i].length; n++) {
            justArray.push(doubleArray[i][n]);
        }
    }
    doubleArray = removeDuplicates(justArray);
    return doubleArray;
}


/**
 * Класс, создающий, хранящий и применяющий все фильтры, которые влияют на отображение элементов.
 * @param String jsonSrc - адрес json файла со списком всех товаров
 * @param {productItems} - объект класса ProductItems, в котором находятся все товары для отображения.
 * @param [items] - массив со всеми товарами из json файла
 * @param [filterList] - массив всех фильтров.
 * @function takeItemsFrom() - принимает адрес json файла, выполняет json запрос, записывает все
 * элементы из json в поле и запускает метод run();
 * @function run() - запускает создание и отрисовку на странице всех фильтров
 * @function makeFilters(items) - принимает список товаров items, создаёт двумерный массив
 * списка фильтров filterItems и записывает в него фильтры.
 * @function spoilerRender() - принимает список фильтров по категориям category, бренду brand и дизайнеру
 * designer, а так же контекс вызова для применения фильтров. Создаёт кнопки и список фильтров под спойлером,
 * назначает на каждый фильтр функцию применения фильтра appendFilter.
 * @function appendFilter() - принимает список всех товаров items, тип фильтра String filterType
 * и имя фильтра String filter. Перебирает все элементы списка товаров items, сравнивает
 * поля filterType (поле category, brand или designer) со значением filter и при нахождении соответствия
 * добавляет объект в новый массив товаров filteredItems[]. Если добавлен хотя бы один элемент, изменяет
 * в текущем классе productItems текущую страницу на первую, в список элементов items
 * записывает выбранные элементы filteredItems[] и запускает метод run() объекта productItems,
 * который заново отрисовывает всю страницу, но уже с новыми элементами из filteredItems[].
 *
 */
class FilterList {
    constructor(jsonSrc, productItems) {
        $("#dropfilter").empty();
        $('input:checked').prop('checked', false);
        this.items = [];
        this.activeFilter = "";
        this.activeFilterType = "";
        this.productItems = productItems;
        this.filterList = [];
        this.prices = [];
        this.takeItemsFrom(jsonSrc);
    }

    takeItemsFrom(jsonSrc) {
        $.get({
            url: jsonSrc,
            dataType: "json",
            context: this,
            success: function (data) {
                this.items = [];
                for (let i = 0; i < data.items.length; i++) {
                    this.items.push(new Item(data.items[i].id, data.items[i].title, data.items[i].description, data.items[i].img,
                        data.items[i].link, data.items[i].price, data.items[i].rating, data.items[i].designer, data.items[i].material,
                        data.items[i].brand, data.items[i].category, data.items[i].color, data.items[i].size));
                }
                this.run();
            }
        });
    }

    run() {
        sortingItems(this.productItems.sorting, this.items);
        this.makeFilters(this.items);
        this.spoilerRender(this.filterList[4], this.filterList[3], this.filterList[1], this);
        this.priceSlider(this);

    }

    makeFilters(items) {
        let itemList = items;
        let filterItems = [[], [], [], [], [], [], []];
        for (let n = 0; n < items.length; n++) {
            filterItems[0].push(itemList[n].price);
            filterItems[1].push(itemList[n].designer);
            filterItems[2].push(itemList[n].material);
            filterItems[3].push(itemList[n].brand);
            filterItems[4].push(itemList[n].category);
            for (let i = 0; i < items[n].size.length; i++) {
                filterItems[5].push(itemList[n].size[i]);
            }
            for (let i = 0; i < items[n].color.length; i++) {
                filterItems[6].push(itemList[n].color[i]);
            }
        }
        for (let i = 0; i < filterItems.length; i++) {
            filterItems[i] = removeDuplicates(filterItems[i]);
        }
        this.filterList = filterItems;
    }

    spoilerRender(category, brand, designer, context) {
        let $categoryButton = $("<button class = products__button id = category__button>" +
            "category<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i></button>");
        let $brandButton = $("<button class = products__button id = brand__button>" +
            "brand<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i></button>");
        let $designerButton = $("<button class = products__button id = designer__button>" +
            "designer<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i></button>");
        $categoryButton.appendTo($("#dropfilter"));
        let $categoryFilter = $("<ul />", {
            class: "products__filter",
        });
        $categoryFilter.appendTo($("#dropfilter"));
        $brandButton.appendTo($("#dropfilter"));
        let $brandFilter = $("<ul />", {
            class: "products__filter",
        });
        $brandFilter.appendTo($("#dropfilter"));
        $designerButton.appendTo($("#dropfilter"));
        let $designerFilter = $("<ul />", {
            class: "products__filter",
        });
        $designerFilter.appendTo($("#dropfilter"));
        for (let i = 0; i < category.length; i++) {
            let $filter = $("<li />", {
                class: "products__filter_category",
                text: category[i],
                id: "category" + i
            });
            $filter.on("click", function () {
                context.appendFilter("category", category[i]);
                for (let n = 0; n < category.length; n++) {
                    $("#category"+n).removeClass("active");
                }
                for(let n = 0; n < brand.length; n++) {
                    $("#brand"+n).removeClass("active");
                }
                for (let n = 0; n < category.length; n++) {
                    $("#designer"+n).removeClass("active");
                }
                $("#category"+i).addClass("active");
            });
            $filter.appendTo($categoryFilter);
        }
        for (let i = 0; i < brand.length; i++) {
            let $filter = $("<li />", {
                class: "products__filter_category",
                id: "brand"+i,
                text: brand[i]
            });
            $filter.appendTo($brandFilter);

            $filter.on("click", function () {
                context.appendFilter("brand", brand[i]);
                for (let n = 0; n < category.length; n++) {
                    $("#category"+n).removeClass("active");
                }
                for(let n = 0; n < brand.length; n++) {
                    $("#brand"+n).removeClass("active");
                }
                for (let n = 0; n < category.length; n++) {
                    $("#designer"+n).removeClass("active");
                }
                $("#brand"+i).addClass("active");
            });

        }
        for (let i = 0; i < designer.length; i++) {
            let $filter = $("<li />", {
                class: "products__filter_category",
                text: designer[i],
                id: "designer"+i
            });
            $filter.on("click", function () {
                context.appendFilter("designer", designer[i]);
                for (let n = 0; n < category.length; n++) {
                    $("#category"+n).removeClass("active");
                }
                for(let n = 0; n < brand.length; n++) {
                    $("#brand"+n).removeClass("active");
                }
                for (let n = 0; n < category.length; n++) {
                    $("#designer"+n).removeClass("active");
                }
                $("#designer"+i).addClass("active");
            });
            $filter.appendTo($designerFilter);
        }
        $categoryButton.on("click", function () {
            if ($categoryFilter.is(':visible')) {
                $categoryButton.removeClass("opened");
            } else {
                $categoryButton.addClass("opened");
            }
            $categoryFilter.toggle(500);

        });
        $brandButton.on("click", function () {
            if ($brandFilter.is(':visible')) {
                $brandButton.removeClass("opened");
            } else {
                $brandButton.addClass("opened");
            }
            $brandFilter.toggle(500);
        });
        $("#filter__size_xxs").change(function () {
            context.appendFilter("size", $("#filter__size_xxs").name)
        });
        $("#filter__size_xs").change(function () {

            context.appendFilter("size", $("#filter__size_xs").name)
        });
        $("#filter__size_s").change(function () {
            context.appendFilter("size", $("#filter__size_s").name)

        });
        $("#filter__size_m").change(function () {
            context.appendFilter("size", $("#filter__size_m").name)

        });
        $("#filter__size_l").change(function () {
            context.appendFilter("size", $("#filter__size_l").name)

        });
        $("#filter__size_xl").change(function () {
            context.appendFilter("size", $("#filter__size_xl").name)
        });
        $("#filter__size_xxl").change(function () {
            context.appendFilter("size", $("#filter__size_xxl").name)

        });
        $designerButton.on("click", function () {
            if ($designerFilter.is(':visible')) {
                $designerButton.removeClass("opened");
            } else {
                $designerButton.addClass("opened");
            }
            $designerFilter.toggle(500);
        });

    }

    priceSlider(context) {
        let values = [];
        let maxValue = 0;
        let minValue = this.items[0].price;
            for (let n = 0; n < this.items.length; n++) {
                if (this.items[n].price < minValue) {
                    minValue = Math.ceil(this.items[n].price);
                }
                if (this.items[n].price > maxValue) {
                    maxValue = Math.ceil(this.items[n].price);
                }
        }
        values[0] = minValue;
        values[1] = maxValue;
        let currentValues = $("<div />", {
            class: "price__value_current",
            id: "price__value_current"
        });
        currentValues.appendTo($("#price__slider"));
        let currentValueMin = $("<p />", {
            class: "price__value_min",
            id: "current__price_min",
            text: "$"+minValue + "-"
        });
        currentValueMin.appendTo(currentValues);
        let currentValueMax = $("<p />", {
            class: "price__value_max",
            id: "current__price_max",
            text: "$"+maxValue
        });
        currentValueMax.appendTo(currentValues);

        let priceSlider = $("#price__slider").slider({
            values: values,
            range: true,
            min: values[0],
            max: values[1],
            change: function (event, ui) {
                context.appendFilter("price", ui.values);
                $("#current__price_min").text("$" + ui.values[0] + "-");
                $("#current__price_max").text("$" + ui.values[1]);
            }
        });
        $("#filter__price_min").append("$" + priceSlider.slider('values')[0]);
        $("#filter__price_max").append("$" + priceSlider.slider('values')[1]);
    };

    appendFilter(filterType, filter) {
        $.get({
            url: "./js/JSON/items.json",
            dataType: "json",
            context: this,
            success: function (data) {
                this.items = [];
                for (let i = 0; i < data.items.length; i++) {
                    this.items.push(new Item(data.items[i].id, data.items[i].title, data.items[i].description, data.items[i].img,
                        data.items[i].link, data.items[i].price, data.items[i].rating, data.items[i].designer, data.items[i].material,
                        data.items[i].brand, data.items[i].category, data.items[i].color, data.items[i].size));
                }
                sortingItems(this.items, this.productItems.sorting);
                this.runFilter(this.items, filterType, filter);
            }
        });
    }

    runFilter(items, filterType, filter) {
        let filteredItems = [];
        if (filterType === "price") {
            this.prices = filter;
        }
        switch (filterType) {
            case "category": {
                this.activeFilterType = "category";
                this.activeFilter = filter;
                break;
            }
            case "brand": {
                this.activeFilterType = "brand";
                this.activeFilter = filter;
                break;
            }
            case "designer": {
                this.activeFilterType = "designer";
                this.activeFilter = filter;
                break;
            }
        }
        switch (this.activeFilterType) {
            case "category": {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].category === this.activeFilter) {
                        filteredItems.push(items[i]);
                    }
                }
                break;
            }
            case "brand": {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].brand === this.activeFilter) {
                        filteredItems.push(items[i]);
                    }
                }
                break;
            }
            case "designer": {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].designer === this.activeFilter) {
                        filteredItems.push(items[i]);
                    }
                }
                break;
            }
        }
        if(filteredItems.length < 1) {
            filteredItems = items;
        }

        if (filteredItems.length < 1) {
            filteredItems = this.items;
        }
        let checkBoxes = $("input:checkbox:checked");
        let filters = [];
        if (checkBoxes.length > 0) {
            for (let i = 0; i < checkBoxes.length; i++) {
                filters.push(checkBoxes[i].name);
            }
            for (let i = 0; i < filteredItems.length; i++) {
                let bool = false;
                for (let n = 0; n < filteredItems[i].size.length; n++) {
                    for (let m = 0; m < filters.length; m++) {
                        if (filters[m] === filteredItems[i].size[n]) {
                            bool = true;
                        }
                    }
                }
                if (bool === false) {
                    filteredItems.splice(i, 1);
                    i--;
                }
            }
        }
        for (let i = 0; i < filteredItems.length; i++) {
            if (filteredItems[i].price < this.prices[0] || filteredItems[i].price > this.prices[1]) {
                filteredItems.splice(i, 1);
                i--;
            }
        }

        if (filteredItems.length > 0) {
            if (this.productItems.activePage > this.productItems.pages.length) {
                this.productItems.activePage = this.productItems.pages.length;
            }
            sortingItems(this.productItems.sorting, filteredItems);
            this.productItems.items = filteredItems;
            this.productItems.run();
        } else {
            this.productItems.noItemsForRender();
        }
    }
}


"use strict";
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
"use strict";
class OrderItem {
    constructor(item) {
        this.id = item.id;
        this.count = item.count;

        this.size = item.size;

    }
}


class Order {
    constructor(basket) {
        this.items = basket.items;
        this.items = [];
    }
    makeOrder() {
        for (let i = 0; i < this.items.length; i++) {
            this.items.push({id: this.items[i].id, count: 0, shippingPrice: 0, discount: 0, totalAmount: 0,})
        }
    }
}

