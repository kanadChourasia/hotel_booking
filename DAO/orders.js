const orders = require("../inMemoryDB/orders");

module.exports = {
    /**
     * 
     * @name order
     * @param {number} userId 
     * @returns {{id: number, userId: number}}
     */
    createNewOrder: (userId) => {

        return {
            id: orders.length ? orders[orders.length - 1].id + 1 : 0,
            userId
        }
    },

    removeOrder: (orderId) => {
        orders.splice(orders.findIndex(order => order.id === orderId), 1)
    }
}