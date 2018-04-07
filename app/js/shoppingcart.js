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
        this.order = [];
    }
    makeOrder() {
        for (let i = 0; i < this.items.length; i++) {
            this.order.push({id: this.items[i].id, count: 0, shippingPrice: 0, discount: 0, totalAmount: 0,})
        }
    }
}

