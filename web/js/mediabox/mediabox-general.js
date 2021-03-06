define(function (require) {
    "use strict";

    var $ = require('jquery');
    
    require('kendo/kendo.web.min');
    var mxFunctions = require('/js/mediabox/mediabox-functions.js');
    var MediaboxFunctions = new mxFunctions();

    var imageFs = require('/js/mediabox/mediabox-image-fs.js');
    var MediaboxImageFs = new imageFs();

    $(document).ready(function() {
        $("#splitter").on("click", ".fm_sel", function() {
            $(this).removeClass("fm_sel").addClass("fm_unsel");
            $(".fm_unsellabel").removeClass("fm_unsellabel").addClass("fm_sellabel").addClass("f-file-select");
        });

        $("#splitter").on("click", ".fm_unsel", function() {
            $(this).removeClass("fm_unsel").addClass("fm_sel");
            $(".fm_sellabel").removeClass("fm_sellabel").addClass("fm_unsellabel").removeClass("f-file-select");
        });

        $("#allTags").on("click", ".tagAll", function(){
            $.ajax({ type: "GET", url: '/image/selTag/', data: "tag=" + encodeURIComponent($(this).text()) })
                .done(function(res) {
                    MediaboxImageFs.getTagsAndCrops();
                    MediaboxImageFs.loadImgFs();
                })
        });

        $("#allCrops").on("click", ".cropAll", function(){
            $.ajax({ type: "GET", url: '/image/selCrop/', data: "crop=" + encodeURIComponent($(this).text()) })
                .done(function(res) {
                    MediaboxImageFs.getTagsAndCrops();
                    MediaboxImageFs.loadImgFs();
                })
        });

        $("#fs-all").on("click", ".fs-view", function(){
            $("#mediabox-view").val($(this).attr("data-id"));
            $.ajax({ type: "GET", url: '/fm/view/', data: "view=" + $(this).attr("data-id"), cache: false })
                .done(function(res) {
                    if (window.location.pathname == "/")
                        MediaboxFunctions.chdir($("#start_dir").val());

                    if (window.location.pathname == "/trash/")
                        MediaboxFunctions.trash($("#start_dir").val());
                });
        });

        $("#fs-all").on("click", ".fs-sort", function(){
            $("#mediabox-sort").val($(this).attr("data-id"));
            $.ajax({ type: "GET", url: '/fm/sort/', data: "type=" + $(this).attr("data-id"), cache: false })
                .done(function(res) {
                    if (window.location.pathname == "/")
                        MediaboxFunctions.chdir($("#start_dir").val());

                    if (window.location.pathname == "/trash/")
                        MediaboxFunctions.trash($("#start_dir").val());
                });
        });




        $("#advanced-overlay").on("click", "#advanced-overlay-back", function(){
            $("#adv-menu-upload").hide();
            $("#adv-menu-buffer").hide();
            $("#advanced-overlay").fadeOut();
        });



        $(".fs-container-div").on("dblclick", ".dfile", function(e){
            MediaboxFunctions.openFile(this);
        });
        $(".fs-container-div").on("click", ".file-open-link", function(e){
            var file = $(this).closest(".dfile");
            MediaboxFunctions.openFile(file);
        });




        $(".check-type").change(function(){
            var sList = Array();

            $(".check-type").each(function() {
                var sThisVal = $(this).val() + "=" + (this.checked ? 1 : 0);
                sList[sList.length] = sThisVal;
            });

            $.ajax({ type: "GET", url: '/fm/types/', data: sList.join("&"), cache: false })

            MediaboxFunctions.chdir($("#start_dir").val());
        });





        // Left audio
        $("#create-new-playlist").click(function(){
            $("#new-playlist-window").kendoWindow({
                width: "300px",
                height: "120px",
                modal: true,
                title: "New playlist"
            });
            $("#new-playlist-window").data("kendoWindow").center().open();
        });
        $("#new-playlist-close").click(function(){
            $("#new-playlist-window").data("kendoWindow").close();
        });
        $("#new-playlist-save").click(function(){
            $.ajax({ type: "GET", url: '/audio/createList/', data: "name=" + $("#new-playlist-name").val(), cache: false })
                .done(function(res) {
                    $("#new-playlist-window").data("kendoWindow").close();
                })
        });

        $("#show-playlists").click(function(){
            $("#user-playlists").html("");

            $.ajax({ type: "GET", url: '/audio/showList/', dataType: "JSON", cache: false })
                .done(function(data) {
                    $.each(data, function(key, value) {
                        $("#user-playlists").append("<div class='row-fluid'><div class='span7'><a href='#' class='playlist-item' data-id='" + value.id + "'>" + value.name + "</a></div><div class='span5'><a class='delete-playlist' data-id='" + value.id + "'>Delete</a></div></div>");
                    });
                })
        });

        $("#show-playlist").click(function(){
            $("#pl-audio").html("");

            $.ajax({ type: "GET", url: '/audio/getTracksList/', dataType: "JSON", cache: false })
                .done(function(data) {
                    $.each(data, function(key, value) {
                        $("#pl-audio").append('<div class="track" title="'+value.name+'" data-id="'+value.id+'" data-ext="mp3"><div class="track-title">'+value.name+'</div></div>');
                    });
                })
        });

        $("#user-playlists").on("click", ".playlist-item", function(){
            $.ajax({ type: "GET", url: '/audio/setPlaylist/', dataType: "JSON", data: "playlist-id=" + $(this).attr("data-id"), cache: false })
                .done(function(data) {

                });
        });

        $("#user-playlists").on("click", ".delete-playlist", function(){
            $.ajax({ type: "GET", url: '/audio/deletePlaylist/', dataType: "JSON", data: "playlist-id=" + $(this).attr("data-id"), cache: false })
                .done(function(data) {

                });
        });

    });



});