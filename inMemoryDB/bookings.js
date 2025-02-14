var nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 1);

/**
 * @type {Array<{id: number, userId: number, roomId: number, from: Date, to: Date, orderId: number}>}
 */
module.exports = [
    {
        id: 1,
        userId: 1,
        roomId: 1,
        from: new Date(),
        to: nextDate,
        orderId: 1
    }
]