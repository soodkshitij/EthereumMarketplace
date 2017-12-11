$(function () {
    var ol = $('#upload ol');
    $('#drop a').click(function () {
        $(this).parent().find('input').click();
    });
    $('body').on('click', '#openUpload', function (e) {
        e.preventDefault();
        $('#upload ol').empty();
        $('#uploadModal').modal('show');
    });


    $('#upload').fileupload({
        messages: {
            maxFileSize: "File is too big",
            minFileSize: "File is too small",
            acceptFileTypes: "Filetype not allowed",
            maxNumberOfFiles: "Too many files",
            uploadedBytes: "Uploaded bytes exceed file size",
            emptyResult: "Empty file upload result"
        },
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        //url: 'http://jquery-file-upload.appspot.com/',
        url: '/upload-file',
        dataType: 'json',
        disableImageLoad: true,
        headers: {
            Accept: "application/json"
        },
        accept: 'application/json',
        maxFileSize: 10000000, //5mb
        maxNumberOfFiles: 5,
        sequentialUploads: true,
        //singleFileUploads: false,
        //resizeMaxWidth: 1920,
        //resizeMaxHeight: 1200,
        //acceptFileTypes: /(.|\/)(gif|jpe?g|png|pdf)$/i,
        uploadTemplateId: null,
        downloadTemplateId: null,
        uploadTemplate: function (o) {
            var rows = $();
            $.each(o.files, function (index, file) {
            	console.log("sending file ");
                var row = $('<li class="template-upload fade upload-file">' +
                    '<div class="upload-progress-bar progress" style="width: 0%;"></div>' +
                    '<div class="upload-file-info">' +
                    '<div class="filename-col"><span class="filename"></span></div>' +
                    '<div class="filesize-col"><span class="size"></span></div>' +
                    '<div class="error-col"><span class="error field-validation-error"></span></div>' +
                    '<div class="actions-col">' +
                    '<button class="btn btn-xs btn-danger cancel removeFile" data-toggle="tooltip" data-placement="left" title="" data-original-title="Remove file">' +
                    '<i class="glyphicon glyphicon-ban-circle"></i> <span></span>' +
                    '</button> ' +
                    '<button class="btn btn-success start"><i class="glyphicon glyphicon-upload"></i> <span>Start</span></button>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
                row.find('.filename').text(file.name);
                row.find('.size').text(o.formatFileSize(file.size));
                if (file.error) {
                    row.find('.error').text(file.error);
                }
                rows = rows.add(row);
            });
            return rows;
        },
        downloadTemplate: function (o) {
            var rows = $();
            $.each(o.files, function (index, file) {
                var row = $('<li class="template-download fade upload-file complete">' +
                    '<div class="upload-progress-bar progress" style="width: 100%;"></div>' +
                    '<div class="upload-file-info">' +
                    '<div class="filename-col"><span class="filename"></span> - <span class="size"></span></div>' +
                    '<div class="error-col"><span class="error"></span></div>' +
                    '</div>' +
                    '</li>');

                row.find('.size').text(o.formatFileSize(file.size));
                if (file.error) {
                    row.find('.filename').text(file.name);
                    row.find('.error').text(file.error);
                    row.removeClass('complete').addClass('error');
                } else {
                    row.find('.filename').text(file.name);
                }
                rows = rows.add(row);
            });
            return rows;
        }
    });

    $('#upload').bind('fileuploadprocessalways', function (e, data) {
        var currentFile = data.files[data.index];
        if (data.files.error && currentFile.error) {
            //console.log(currentFile.error);
            data.context.find(".start").prop('disabled', true);
            data.context.find('.error').text(currentFile.error);
            return;
        }
    });

    /*$(document, '.removeFile').on('show.bs.tooltip', function (e) {
        e.stopPropagation();
    }).on('hide.bs.tooltip', function (e) {
        e.stopPropagation();
    });*/

    $('#upload').bind('fileuploadadd', function (e, data) {
        setTimeout(function () {
            $('.removeFile').tooltip();
        }, 0);
        //$('.removeFile').tooltip();
        //console.log('add');
    })
        .bind('fileuploadprogress', function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        data.context.find('.progress').css('width', progress + '%');
        //console.log(progress);
    })
        .bind('fileuploadfail', function (e, data) {
        console.log('fail');
    }).bind('	', function (e,data) {
        console.log('start');
        console.log(data.result);
    })
    .bind('fileuploaddone', function(e,data) {
    	console.log("done");
    	console.log(data.result);
    	var result = (data.result);
    	console.log(result['files'][0]['public_id']);
    	var in_dom_obj = $("#uploaded-public-keys").val();
    	in_dom_obj = in_dom_obj+result['files'][0]['public_id']+",";
    	$("#uploaded-public-keys").val(in_dom_obj);
    })

});