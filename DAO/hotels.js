const hotels = require("./../inMemoryDB/hotels");
const locationDAO = require("./locations");

module.exports = {
    getAllHotels: () => {
        const hotelList = [];
        hotels.forEach(hotel => {
            let hotelObj = {
                ...hotel,
                location: locationDAO.getLocationById(hotel.locationId)
            }
            hotelList.push(hotelObj);
        });
        return hotelList;
    },
    getSearchedHotels: (searchParam) => {
        const searchedHotels = [];
        hotels.forEach(hotel => {
            let searchedHotel = {
                ...hotel,
                location: locationDAO.getLocationById(hotel.locationId)
            }
            
            if (searchedHotel.name.toLowerCase().includes(searchParam) || searchedHotel.location.name.toLowerCase().includes(searchParam)) {
                searchedHotels.push(searchedHotel)
            }
        })
        return searchedHotels;
    },
    getHotelById: (hotelId) => {
        for (let hotel of hotels) {
            if (hotel.id === hotelId) {
                return {
                    ...hotel,
                    location: locationDAO.getLocationById(hotel.locationId)
                }
            }
        }
    }
}