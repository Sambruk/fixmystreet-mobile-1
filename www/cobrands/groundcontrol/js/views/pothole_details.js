(function (FMS, Backbone, _, $) {
    FMS.PhotoView = FMS.PhotoView.extend({
        currentFile: null,

        events: {
            'pagehide': 'destroy',
            'pagebeforeshow': 'beforeDisplay',
            'pageshow': 'afterDisplay',
            'vclick .ui-btn-left': 'onClickButtonPrev',
            'vclick .ui-btn-right': 'onClickButtonNext',
            'vclick #id_photo_button': 'takeNewPhoto',
            'vclick #id_existing': 'addPhotoFromLibrary',
            'vclick .del_photo_button': 'deletePhoto',
            'vclick .pothole-size-button': 'potholeSizeSelected',
            'vclick .pothole-size': 'resizePotholeForPhoto'
        },

        addPhotoToReport: function(file) {
            this.currentFile = file;
            $.mobile.loading('hide');
            this.showSizeSelector(file.toURL());
        },

        showSizeSelector: function(url) {
            this.blurBackground();
            $(".pothole-size-selector .photo").css("background-image", "url("+url+")");
            $(".pothole-size-selector .photo").data("photo_url", url);
            $(".pothole-size-selector").removeClass('hidden');

            // There's some weird bug on iOS 10 where grid items are much too
            // tall, meaning only the first row of pothole size buttons is
            // displayed. This works around the problem by removing and
            // re-applying the grid to the list of buttons. Ugly, but works.
            if (device.platform === "iOS" && /^10/.test(device.version)) {
                $(".pothole-size-selector ul").css("display", "block");
                setTimeout(function() {
                    $(".pothole-size-selector ul").css("display", "grid");
                }, 0);
            }
        },

        potholeSizeSelected: function(e) {
            e.preventDefault();

            var size = e.target.dataset.potholeSize;
            var pothole_sizes = this.model.get("pothole_sizes") || {};
            var filekey = $(".pothole-size-selector .photo").data("photo_url");
            pothole_sizes[filekey] = size;
            this.model.set("pothole_sizes", pothole_sizes);
            this.unblurBackground();
            $(".pothole-size-selector").addClass('hidden');
            $(".pothole-size-selector .photo").css("background-image", "");
            $(".pothole-size-selector .photo").removeData("photo_url");

            if (this.currentFile) {
                FMS.PhotoView.__super__.addPhotoToReport.call(this, this.currentFile);
                this.currentFile = null;
            } else {
                this.rerender();
            }
        },

        resizePotholeForPhoto: function(e) {
            e.preventDefault();
            var url = $(e.target).closest(".photo").data("photoUrl");
            this.showSizeSelector(url);
        },

        blurBackground: function() {
            $("#photo-page [data-role=header], #photo-page [data-role=content], #map_box").addClass("blurred");
        },

        unblurBackground: function() {
            $("#photo-page [data-role=header], #photo-page [data-role=content], #map_box").removeClass("blurred");
        }
    });
})(FMS, Backbone, _, $);
