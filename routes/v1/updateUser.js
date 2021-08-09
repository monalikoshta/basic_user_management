const users = require('../../services/user')

const updateUser = (id,name,email,mobile,profile_picture) =>{
    return users.updateUser(id,name,email,mobile,profile_picture)
}

module.exports = {
    updateUser
}