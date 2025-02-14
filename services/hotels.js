const hotelDao = require("../DAO/hotels");
module.exports = {
    getListOfHotels: (query) => {
        if (query.search) {
            return hotelDao.getSearchedHotels(query.search)
        }
        return hotelDao.getAllHotels();
    }
}