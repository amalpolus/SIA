
module.exports.routes = {

    '/UserCheck': {
        controller: 'Users',
        action: 'UserCheck'
    },

    '/UsersList': {
        controller: 'Users',
        action: 'UsersList'
    },

    '/ChangeStatus': {
        controller: 'Invoice',
        action: 'ChangeStatus'
    }
};
