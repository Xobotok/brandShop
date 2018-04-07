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

