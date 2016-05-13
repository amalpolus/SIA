/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    UserCheck: function (req, res) {
        var userName = req.param('UserName');
        var Mail = req.param('Mail');
        var location = req.param('location');
        var phNo = req.param('phNo');
        Users.find().where({UserName:userName}).exec(function(err, userrowObj){
            if (err)
            {
                sails.log.error('Error updating user', err);
                res.send(500, { title: 'error updating user' });
            }
            else
            {
                if (userrowObj[0] == null) {
                    var userdata = [];
                    userdata.push({
                        'UserName': userName,
                        'Mail': Mail,
                        'location': location,
                        'phNo': phNo
                    });

                    Users.create(userdata).exec(function (err, userentryObj) {
                        if (err) {
                            sails.log.error('Error adding user', err);
                            res.send(500, { title: 'error adding Userdata' });
                        } else {
                            req.session.user = userentryObj;
                            res.send(200, { 'userdetails': userentryObj });
                            sails.log.debug('New user logged In');
                            sails.log.debug('Logged in user= ' + userentryObj[0].UserName + ', Logged in time=' + userentryObj[0].updatedAt);
                        }
                    });
                }
                else
                {
                    var userdata = userrowObj;
                    res.send(200, { 'userdetails': userdata });
                    req.session.user = userdata;
                    sails.log.debug('Logged in user= ' + userdata[0].UserName + ', Logged in time=' + userdata[0].updatedAt);
                }
            
            }
        });
       
    },
    UsersList: function (req, res) {
        var username = req.param("UserName");
        if (username != null || username != undefined) {
            Users.find().where({ UserName: username }).exec(function (err, users) {
                if (err) {
                    sails.log.error('Error updating user', err);
                    res.send(500, { title: 'error updating user' });
                }
                else {
                    var userdata = users;
                    res.send(200, { 'userdetails': userdata });
                }
            });
        }
        else {
            var search=req.param("Search");
             Users.find({ UserName: { 'contains':  search} }).exec(function (err, users) {
                if (err) {
                    sails.log.error('Error updating user', err);
                    res.send(500, { title: 'error updating user' });
                }
                else {
                    var userdata = users;
                    res.send(200, { 'userdetails': userdata });
                }
            });
        }
        
    }


};

        