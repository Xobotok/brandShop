class ProductItem {
    constructor(itemId, basket){
        this.itemId = itemId;
        this.basket = basket;
        this.collection = "";
        this.item = "";
        this.run();
    }
    run() {
        this.initialize();
    }
    initialize() {
        $.get({
            url: "./js/JSON/items.json",
            dataType: "json",
            context: this,
            success: function (data) {
                for (let i = 0; i < data.items.length; i++) {
                    if (data.items[i].id === this.itemId) {
                        this.item = new Item(data.items[i].id, data.items[i].title, data.items[i].description, data.items[i].img,
                            data.items[i].link, data.items[i].price, data.items[i].rating, data.items[i].designer,
                            data.items[i].material, data.items[i].brand, data.items[i].category, data.items[i].color,
                            data.items[i].size);
                        this.item.actualColor = data.items[i].color[0];
                        this.item.actualSize = data.items[i].size[0];
                        this.item.collection = data.items[i].collection;
                        new ArrivalItems(this.item);
                        break;
                    }
                }
                this.render();
            }
        })
    }
    render() {
        $("<img />", {
            src: this.item.img,
            alt: this.item.title,
            class: "product__img_img"
        }).appendTo($("#product__img"));
        $("<span />", {
            text: this.collection,
        }).appendTo( $("#product__details_collection"));
        $("#product__details_name").text(this.item.title);
        $("#product__details_description").text(this.item.description);
        $("<span />", {
            text: this.item.material,
        }).appendTo( $("#product__details_material"));
        $("<span />", {
            text: this.item.designer,
        }).appendTo( $("#product__details_designer"));
        $("<span />", {
            text: "$" + parseFloat(this.item.price).toFixed(2),
        }).appendTo( $("#product__details_price"));
        this.colorRender();
        this.sizeRender();
        this.quantityRender();
        this.buttonInitialize();
    }
    colorRender(){
        $("#extra__color_color").text(this.item.actualColor[0].toUpperCase() + this.item.actualColor.substring(1));
        $("<span />", {
            class: "extra__color_example",
            id: "extra__color_example"
        }).appendTo($("#extra__color_color"));
        $("<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i>").appendTo($("#extra__color_color"));
        switch(this.item.actualColor) {
            case "red": {
                $("#extra__color_example").css("background-color", "#f5455e");
                break;
            }
            case "green": {
                $("#extra__color_example").css("background-color", "#66d054");
                break;
            }
            case "blue": {
                $("#extra__color_example").css("background-color", "#1975f3");
                break;
            }
            case "black": {
                $("#extra__color_example").css("background-color", "#000000");
                break;
            }
            case "pink": {
                $("#extra__color_example").css("background-color", "#e95ec7");
                break;
            }
        }
        for (let i = 0; i < this.item.color.length; i++) {
            let color = $("<li />", {
                text: this.item.color[i][0].toUpperCase() + this.item.color[i].substring(1),
                class: "extra__color_col"
            }).appendTo($("#extra__color_colors"));
            $("<span />", {
                class: "extra__color_example",
                id: "extra__color_" + this.item.color[i]
            }).appendTo(color);
            switch(this.item.color[i]) {
                case "red": {
                    $("#extra__color_" + this.item.color[i]).css("background-color", "#f5455e");
                    break;
                }
                case "green": {
                    $("#extra__color_" + this.item.color[i]).css("background-color", "#66d054");
                    break;
                }
                case "blue": {
                    $("#extra__color_" + this.item.color[i]).css("background-color", "#1975f3");
                    break;
                }
                case "black": {
                    $("#extra__color_" + this.item.color[i]).css("background-color", "#000000");
                    break;
                }
                case "pink": {
                    $("#extra__color_" + this.item.color[i]).css("background-color", "#e95ec7");
                    break;
                }
            }
            color.on("click", () => {
                this.colorChange(this.item.color[i]);
                $("#extra__color_colors").toggle(500);
            })
        }
    }
    sizeRender(){
        $("#extra__color_size").text(this.item.actualSize.toUpperCase());
        $("<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i>").appendTo($("#extra__color_size"));
        for (let i = 0; i < this.item.size.length; i++) {
            let size = $("<li />", {
                class: "extra__color_col",
                text: this.item.size[i].toUpperCase(),
                id: "extra__color_" + this.item.size[i]
            });
            size.appendTo($("#extra__color_sizes"));
            size.on("click", () => {
                this.sizeChange(this.item.size[i]);
            })
        }
    }
    buttonInitialize() {
        $("#extra__color_color").on("click", () => {
            $("#extra__color_colors").toggle(500);
        });
        $("#extra__color_size").on("click", () => {
            $("#extra__color_sizes").toggle(500);
        });
        $("#product__button_add").on("click", () => {
            this.item.count =  parseInt($("#extra__color_quantity").val());
            this.basket.addItem(this.item);
        })
    }
    colorChange(color) {
    this.item.actualColor = color;
        $("#extra__color_color").text(color[0].toUpperCase() + color.substring(1));
        $("<span />", {
            class: "extra__color_example",
            id: "extra__color_example"
        }).appendTo($("#extra__color_color"));
        $("<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i>").appendTo($("#extra__color_color"));
        switch(color) {
            case "red": {
                $("#extra__color_example").css("background-color", "#f5455e");
                break;
            }
            case "green": {
                $("#extra__color_example").css("background-color", "#66d054");
                break;
            }
            case "blue": {
                $("#extra__color_example").css("background-color", "#1975f3");
                break;
            }
            case "black": {
                $("#extra__color_example").css("background-color", "#000000");
                break;
            }
            case "pink": {
                $("#extra__color_example").css("background-color", "#e95ec7");
                break;
            }
        }
    }
    sizeChange(size) {
        this.item.actualSize = size;
        $("#extra__color_size").text(size);
        $("<i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i>").appendTo($("#extra__color_size"));
        $("#extra__color_sizes").toggle(500);
    }
    quantityRender() {
        $("#extra__color_quantity").val(1);
        $("#extra__color_quantity").on("input", function(ev) {
            let reg = /\D/;
            if(reg.exec($(ev.target).val())) {
                $(ev.target).val(($(ev.target).val()).replace(/\D/, ""));
            }
            if (!$(ev.target).val() || parseInt($(ev.target).val()) === 0) {
                $(ev.target).val(1);
            }
            if (parseInt($(ev.target).val()) > 99) {
                $(ev.target).val(99);
            }
        });
    }
}
class ArrivalItems {
    constructor(item){
        this.item = item;
        this.items = [];
        this.run();
    }
    run(){
        this.initialize();
    }
    initialize() {
        $.get({
            url: "./js/JSON/items.json",
            dataType: "json",
            context: this,
            success: function (data) {
                for (let i = 0; i < data.items.length; i++) {
                    if (data.items[i].collection === this.item.collection) {
                        this.items.push(data.items[i]);
                    }
                }
                this.render();
            }
        })
    }
    render() {
        for (let i = 0; i < 4 && i < this.items.length; i++) {
            let iter = i + 1;
            if (this.items[i].id !== this.item.id) {
                $("<img />", {
                    src: this.items[i].img,
                    alt: this.items[i].title,
                    class: "arrivals__item_img",
                }).appendTo($("#arrivals__item"+ iter));
                $("<a />", {
                    href: this.items[i].link,
                    class: "arrivals__item_title",
                    text: this.items[i].title
                }).appendTo($("#arrivals__item"+ iter));
                $("<span />", {
                    text: "$" + parseFloat(this.items[i].price).toFixed(2),
                }).appendTo($("<h5 />", {
                    class: "arrivals__item_title",
                }).appendTo($("#arrivals__item"+ iter)));

            } else {
                this.items.splice(i, 1);
                i--;
            }
        }

    }
}