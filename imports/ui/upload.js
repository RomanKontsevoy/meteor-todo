import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Files } from '../api/files';

import './upload.html';

Template.uploadForm.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
    currentUpload() {
        return Template.instance().currentUpload.get();
    }
});

Template.uploadForm.events({
    'change #fileInput'(e, template) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            const file = e.currentTarget.files[0];
            Files.insert({
                file: file,
                meta: {
                    createdAt: new Date(),
                    userLoaded: Meteor.user().username || Meteor.user().profile.name,
                },
                onStart() {
                    template.currentUpload.set(this);
                },
                onUploaded(error, fileObj) {
                    if (error) {
                        alert('Error during upload: ' + error);
                    } else {
                        alert('File "' + fileObj.name + '" successfully uploaded');
                        Meteor.call('info.insert', {
                            fileCreatedAt: fileObj.meta.createdAt,
                            userLoaded: fileObj.meta.userLoaded,
                            userLoadedId: fileObj.userId,
                            event: 'Файл загружен',
                            size: fileObj.size,
                            type: fileObj.type,
                            fileId: fileObj._id
                        });
                    }
                    template.currentUpload.set(false);

                },
                streams: 'dynamic',
                chunkSize: 'dynamic'
            });
        }
    },
});