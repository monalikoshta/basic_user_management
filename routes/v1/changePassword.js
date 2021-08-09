const users = require('../../services/user')

const changePassword = (id,currentPassword,newPassword) =>{
    return users.changePassword(id, currentPassword, newPassword)
}

module.exports = {
    changePassword
}