import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Files, Info} from '../api/files.js';

import './info.js';
import './file.js';
import './upload';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('files.all');
    Meteor.subscribe('infos');
    Meteor.subscribe('userData');
});

Template.body.helpers({
    files() {
        return Files.find({}, {sort: {createdAt: -1}});
    },
    infos() {
        return Info.find({}, {sort: {createdAt: -1}});
    },
    infosCount() {
        return Info.find().count();
    },
    incompleteCount() {
        return Files.find().count();
    },
});