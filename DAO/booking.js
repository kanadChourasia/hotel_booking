const bookings = require("./../inMemoryDB/bookings");

const roomDao = require("./rooms");
const userDao = require("./users");

module.exports = {
    /**
     * 
     * @param {{userId: number, roomId: number, from: Date, to: Date, orderId: number}} bookingData 
     */
    addBooking: (bookingData) => {
        bookings.push({
            id: bookings[bookings.length - 1].id + 1,
            userId: bookingData.userId,
            roomId: bookingData.roomId,
            from: bookingData.from,
            to: bookingData.to,
            orderId: bookingData.orderId
        })
    },

    /**
     * 
     * @param {Array<{userId: number, roomId: number, from: Date, to: Date, orderId: number}>} bookingData 
     */
    addBookings: function (bookingData) {
        bookingData.forEach(function(booking) {
            booking.id = bookings[bookings.length - 1].id + 1
            bookings.push({
                id: booking.id,
                userId: booking.userId,
                roomId: booking.roomId,
                from: booking.from,
                to: booking.to,
                orderId: booking.orderId
            })
        })
        return bookingData
    },

    /**
     * 
     * @param {Date} from 
     * @param {Date} to 
     * @param {number} roomId 
     */
    getExistingBookingForDurationForRoom: (from, to, roomId) => {
        return bookings.filter(booking => {
            if (booking.roomId === roomId) {
                if (from >= booking.from && from < booking.to) {
                    return true
                } else if (from <= booking.from && to >= booking.to) {
                    return true
                } else if (to > booking.from && to <= booking.to) {
                    return true
                } else if (from >= booking.from && to <= booking.to) {
                    return true
                }
            }
        }).map(booking => {
            return {
                ...booking,
                room: roomDao.getRoomById(booking.roomId),
                user: userDao.getUserById(booking.userId)
            }
        })
    },

    /**
     * 
     * @param {Date} from 
     * @param {Date} to 
     * @param {number} roomId
     */
    getExistingBookingForDurationForRoomForOtherUser: (from, to, roomId, userId) => {
        return bookings.filter(booking => {
            if (booking.roomId === roomId && booking.userId !== userId) {
                if (from >= booking.from && from < booking.to) {
                    return true
                } else if (from <= booking.from && to >= booking.to) {
                    return true
                } else if (to > booking.from && to <= booking.to) {
                    return true
                } else if (from >= booking.from && to <= booking.to) {
                    return true
                }
            }
        }).map(booking => {
            return {
                ...booking,
                room: roomDao.getRoomById(booking.roomId),
                user: userDao.getUserById(booking.userId)
            }
        })
    },

    /**
     * 
     * @param {Date} from 
     * @param {Date} to 
     * @param {number} hotelId 
     */
    getExistingBookingForDurationForHotel: (from, to, hotelId) => {
        return bookings.filter(booking => {
            let bookedRoom = roomDao.getRoomById(booking.roomId)
            if (bookedRoom.hotelId === hotelId) {
                if (from >= booking.from && from < booking.to) {
                    return true
                } else if (from <= booking.from && to >= booking.to) {
                    return true
                } else if (to > booking.from && to <= booking.to) {
                    return true
                } else if (from >= booking.from && to <= booking.to) {
                    return true
                }
            }
        })
    },

    getAllBookings: () => {
        return bookings.map(booking => {
            return {
                ...booking,
                room: roomDao.getRoomById(booking.roomId),
                user: userDao.getUserById(booking.userId)
            }
        })
    },

    getBookingsFromOrder: (orderId) => {
        const bookingsOfOrder = [];
        for (let booking of bookings) {
            if (booking.orderId === orderId) {
                bookingsOfOrder.push({
                    ...booking,
                    room: roomDao.getRoomById(booking.roomId),
                    user: userDao.getUserById(booking.userId)
                })
            }
        }
        return bookingsOfOrder;
    },

    /**
     * 
     * @param {Array<{id: number, userId: number, roomId: number, from: Date, to: Date, orderId: number}>} bookingData 
     */
    updateBookings: (bookingData) => {
        for (let booking of bookingData) {
            for (var i=0; i<bookings.length; i++) {
                if (booking.bookingId === bookings[i].id) {
                    bookings[i] = {
                        id: booking.id,
                        userId: booking.userId,
                        roomId: booking.roomId,
                        from: booking.from,
                        to: booking.to,
                        orderId: booking.orderId
                    }
                    break;
                }
            }
        }
    },

    /**
     * 
     * @param {Array<number>} bookingIds 
     */
    removeBookingByIds: (bookingIds) => {
        const bookingIndexes = bookingIds.map(bookingId => bookings.findIndex(booking => booking.id === bookingId));

        bookingIndexes.sort();
        for (var i = bookings.length-1; i>=0; --i) {
            if (bookingIndexes.includes(i)) {
                bookings.splice(i, 1);
            }
        }
    }
}