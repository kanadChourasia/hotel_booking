const bookingDao = require("./../DAO/booking");
const roomDao = require("./../DAO/rooms");
const orderDao = require("./../DAO/orders");
const userDao = require("./../DAO/users");

module.exports = {
    /**
     * 
     * @param {{userId: number, roomIds: Array<number>, from: Date, to: Date}} bookingData 
     */
    bookRooms: (bookingData) => {
        var bookings = [];
        var totalCharges = 0;
        const bookedRooms = [];
        for (let roomId of bookingData.roomIds) {

            let existingBooking = bookingDao.getExistingBookingForDurationForRoom(bookingData.from, bookingData.to, roomId);

            if (existingBooking.length) {
                return {
                    success: false,
                    message: "Sorry! room(s) are already booked in the given duration"
                }
            }

            bookings.push({
                userId: bookingData.userId,
                roomId,
                from: new Date(bookingData.from),
                to: new Date(bookingData.to),
                orderId: null
            })
            let room = roomDao.getRoomById(roomId);
            totalCharges += room.charge;
            bookedRooms.push(room);
        }
        const order = orderDao.createNewOrder(bookingData.userId);
        bookings = bookings.map(booking => {
            booking.orderId = order.id;
            return booking;
        })
        bookings = bookingDao.addBookings(bookings)
        bookings.map(booking => {
            booking.room = roomDao.getRoomById(booking.roomId)
            return booking;
        })
        return {
            success: true,
            data: {
                orderId: order.id,
                bookings,
                totalCharges
            }
        }
    },

    getAllBookings: () => {
        return bookingDao.getAllBookings()
    },

    /**
     * 
     * @param {{orderId: number, userId: number, roomIds: Array<number>, from: Date, to: Date}} bookingData 
     */
    updateBooking: (bookingData) => {
        /**
         * @type {Array<{id: number, userId: number, roomId: number, from: Date, to: Date, orderId: number}>}
         */
        const removeBookings = [];

        /**
         * @type {Array<{userId: number, roomId: number, from: Date, to: Date, orderId: number}>}
         */
        const addBookings = [];

        /**
         * @type {Array<{id: number, userId: number, roomId: number, from: Date, to: Date, orderId: number}>}
         */
        const updateBookings = [];
        var totalDifferenceInCharges = 0;
        for (let roomId of bookingData.roomIds) {

            let existingBookingOfOtherUser = bookingDao.getExistingBookingForDurationForRoomForOtherUser(bookingData.from, bookingData.to, roomId, bookingData.userId);

            // check if existing booking is there with any other user
            if (existingBookingOfOtherUser.length) {
                return {
                    success: false,
                    message: "Sorry! room(s) are already booked in the given duration"
                }
            }
        }

        const userExistingOrderBookings = bookingDao.getBookingsFromOrder(bookingData.orderId);
        for (let booking of userExistingOrderBookings) {
            if (bookingData.roomIds.includes(booking.roomId)) {
                updateBookings.push({
                    id: booking.id,
                    from: new Date(bookingData.from),
                    to: new Date(bookingData.to),
                    orderId: booking.orderId,
                    userId: booking.userId,
                    roomId: booking.roomId,
                    room: booking.room,
                    user: booking.user
                })
            } else {
                totalDifferenceInCharges -= booking.room.charge
                removeBookings.push(booking);
            }
        }
        const roomIdsNeedsUpdate = updateBookings.map(booking => booking.roomId);
        for (let roomId of bookingData.roomIds) {
            if (!roomIdsNeedsUpdate.includes(roomId)) {
                addBookings.push({
                    from: new Date(bookingData.from),
                    to: new Date(bookingData.to),
                    orderId: bookingData.orderId,
                    roomId,
                    userId: bookingData.userId,
                    room: roomDao.getRoomById(roomId),
                    user: userDao.getUserById(bookingData.userId)
                })
                totalDifferenceInCharges += roomDao.getRoomById(roomId).charge
            }
        }
        if (addBookings.length) {
            bookingDao.addBookings(addBookings);
        }
        if (updateBookings.length) {
            bookingDao.updateBookings(updateBookings);
        }
        if (removeBookings.length) {
            bookingDao.removeBookingByIds(removeBookings.map(booking => booking.id))
        }

        return {
            success: true,
            data: {
                bookedRooms: updateBookings.concat(addBookings),
                totalDifferenceInCharges
            }
        }
    },

    removeOrderBookings: (orderId) => {
        var totalCharges = 0;
        const orderBookings = bookingDao.getBookingsFromOrder(parseInt(orderId));
        
        const removeBookingIds = orderBookings.map(booking => {
            totalCharges += booking.room.charge;
            return booking.id
        })
        bookingDao.removeBookingByIds(removeBookingIds);
        orderDao.removeOrder(orderId);
        return {
            success: true,
            data: {
                message: "Order has been removed",
                totalCharges
            }
        }
    }
}