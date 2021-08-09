const bcrypt = require('bcrypt');

const users = []

let idCounter = 1

const getAllUsers = () =>{
    return {'users': users};
}

const getUserById = (id) =>{
    for(let user=0; user<users.length; user++){
        if(users[user]["id"] == id){
            return users[user];
        }
    }
}

const getUserByEmail = (email) =>{
    for(let user=0; user<users.length; user++){
        if(users[user]["email"] == email){
            return users[user];
        }
    }
}

const register = (name,email,mobile,password,profile_picture) => {
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        'id': idCounter,
        'name': name,
        'email': email,
        'mobile' : mobile,
        'password': encryptedPassword,
        'profile_picture': profile_picture
    }
    idCounter+=1
    users.push(newUser)
    return {'msg': 'User registered successfully!'}
}

const login = (email,password,token) => {
    const user = getUserByEmail(email)
    if(!user){
        return {'msg': 'User not found'}
    }
    else if(user && (bcrypt.compareSync(password, user['password']))){
        user['token'] = token
        return { 'msg': 'login sucessful!','id': user['id'],'token': user['token']}
    }
    else{
        return {'msg': 'Invalid credentials'}
    }
}

const updateUser = (email,name,new_email,mobile,profile_picture) => {
    const user = getUserByEmail(email);
    if(!user){
        return {'msg': 'Please check that you have registered/login'}
    }
    if(user){
        user['name']=name;
        user['email']=new_email;
        user['mobile']=mobile;
        user['profile_picture'] = profile_picture;
        return {'msg': 'User updated!','name': user['name'],'email': user['email'],'mobile': user['mobile'],'profile_picture': user['profile_picture']}
    }
}

const changePassword = (email, currentPassword, newPassword) => {
    const user = getUserByEmail(email);
    if(!user){
        return {'msg': 'Please check that you have registered/login'}
    }
    if((bcrypt.compareSync(currentPassword, user['password']))){
        user['password'] = newPassword;
        return {'msg': 'Your password has been changed!'}
    }
    else{
        return {'msg': 'Your current password is wrong!'};
    }
}

const getInfo = (id) => {
    const user = getUserById(id);
    if(user){
        return {'msg': 'User Found','id': user['id'],'name': user['name'],'email': user['email'],'mobile': user['mobile'],'profile_picture': user['profile_picture']}
    }
    else{
        return {'msg': 'User Not Found!'}
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    register,
    login,
    updateUser,
    changePassword,
    getInfo
}