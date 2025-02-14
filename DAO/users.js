const users = require("./../inMemoryDB/users");

module.exports = {
    getUserById: (userId) => {
        return users.filter(user => user.id === userId)[0]
    }
}