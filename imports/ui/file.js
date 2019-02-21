import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Files} from '../api/files';

import './file.html';

Template.file.helpers({
    isOwner() {
        return this.userId === Meteor.userId();
    },
    fileRef() {
        return Files.collection.findOne();
    },
    getSize() {
        return Math.round(this.size / 1024 / 1024 * 100) / 100;
    },

    getFormattedDate() {
        return toLocaleDate(this.meta.createdAt);
    },
    imageFile() {
        return Files.findOne({_id: this._id});
    }
});

Template.file.events({
    'click .delete'() {
        Meteor.call('files.remove', this._id);
        Meteor.call('info.insert', {
            fileCreatedAt: this.meta.createdAt,
            userLoaded: this.meta.userLoaded,
            userLoadedId: this.userId,
            event: 'Файл удален',
            size: this.size,
            type: this.type,
            fileId: this._id
        });
    },
    'click .toggle-info'() {
        Meteor.call('files.showInfo', this._id, !this.showInfo);
    },
});

function toLocaleDate (date) {
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return date.toLocaleString("ru", options); // 31 декабря 2014 г. 12:30:00
};