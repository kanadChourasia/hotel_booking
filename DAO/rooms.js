const rooms = require("./../inMemoryDB/rooms");

const hotelDao = require("./hotels");

module.exports = {
    getRoomById: (roomId) => {
        for (let room of rooms) {
            if (room.id === roomId) {
                return {
                    ...room,
                    hotel: hotelDao.getHotelById(room.hotelId)
                }
            }
        }
    }
}