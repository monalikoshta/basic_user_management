const users = require('../../services/user')

const getInfo = (id) =>{
    return users.getInfo(id)
}

module.exports = {
    getInfo
}