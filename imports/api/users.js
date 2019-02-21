import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {_} from 'meteor/underscore';
import {Roles} from 'meteor/alanning:roles';

if (Meteor.isServer) {

    Meteor.startup(() => {
        let users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                roles: ['admin']
            }
        ];

        _.each(users, function (user) {

            if (Meteor.users.findOne({'emails.address': user.email})) {
                return;
            }

            let id = Accounts.createUser({
                email: user.email,
                password: 'qwerty',
                profile: {name: user.name}
            });

            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles, 'default-group');
            }

        });
    });
}