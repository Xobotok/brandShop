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
