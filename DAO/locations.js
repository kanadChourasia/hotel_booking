const locations = require("./../inMemoryDB/locations");

module.exports = {
    getLocationById: (locationId) => {
        return locations.filter(location => location.id === locationId)[0]
    }
}