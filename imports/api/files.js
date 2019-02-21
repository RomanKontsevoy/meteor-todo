import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';

export const Files = new FilesCollection({
    collectionName: 'Files',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        let allowedSize, userinfo;
        if (Roles.userIsInRole(Meteor.userId(), ['view-secrets','admin'], 'default-group')) {
            allowedSize = 20971520;
            userinfo = 'Привилегированный пользователь, допустимый объем файла - 20 мб';
        } else {
            allowedSize = 5242880;
            userinfo = 'Привилегированный пользователь, допустимый объем файла - 5 мб';
        };
        if (file.size <= allowedSize && /zip|png|pdf|tiff|jpe?g/i.test(file.extension)) {
            return true;
        }
        return 'Недопустимое расширение или размер файла';
    }
});

export const Info = new Mongo.Collection('FilesInfo');

if (Meteor.isServer) {
    const filesCursor = Files.find();
    
    // Get cursor's data:
    filesCursor.fetch();

    
    Meteor.publish('files.all', function () {
        return Files.find().cursor;
    });

    Meteor.publish('infos', function () {
        return Info.find();
    });
    
    filesCursor.each(function (file) {
        // Only available in .each():
      file.link();
      file.remove();
      file.with(); // <-- Reactive object
    });
}

Meteor.methods({
    'info.insert'(info) {
        check(info, Object);
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        let obj = {
            ...info,
            createdAt: new Date()
        };
        Info.insert(obj);
    },
    'info.remove'(infoId) {
        check(infoId, String);
        Info.remove(infoId);
    },
    'files.remove'(fileId) {
        check(fileId, String);
        const file = Files.findOne(fileId);
        if (file.private && file.userId !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Files.remove(fileId);
    },
    'files.showInfo'(fileId, showInfo) {
        check(fileId, String);
        check(showInfo, Boolean);

        const file = Files.findOne(fileId);
        if (file.userId !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Files.update(fileId, { $set: { showInfo: showInfo } });
    },
});