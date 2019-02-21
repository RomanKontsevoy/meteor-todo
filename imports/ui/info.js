import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './info.html';

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

Template.info.helpers({
    getSize() {
        return Math.round(this.size / 1024 / 1024 * 100) / 100;
    },
    getFileCreatedAt() {
        return toLocaleDate(this.fileCreatedAt);
    },
    getCreatedAt() {
        return toLocaleDate(this.createdAt);
    },
});

Template.info.events({
    'click .delete'() {
        Meteor.call('info.remove', this._id);
    },
});