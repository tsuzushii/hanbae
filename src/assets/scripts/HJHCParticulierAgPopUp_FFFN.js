(function ($) {

    var colorbox;
    var initSettings = {
        'colorboxDiv': '#colorbox',
        'colorboxMoveTo': 'body > form'
    };
    var defaults = {
        transition: 'none',
        opacity: '0.5',
        overlayClose: false
    };
    var messages = {
        'colorboxNoInit': 'Colorbox is not initialised.',
        'noMethod': 'Method "{method}" does not exist on jQuery.agpopup.',
        'colorboxNoHref': 'No href specified.',
        'colorboxNoInline': 'Inline content "{href}" not found.'
    };

    var methods = {
        init: function () {

            colorbox = $(initSettings.colorboxDiv);
            if (colorbox.length == 1) {
                colorbox.prependTo(initSettings.colorboxMoveTo);
            }
            else throw new Error(messages.colorboxNoInit);
        },

        portTo: function (options) {

            var settings = {
                href: false
            };

            $.extend(settings, defaults);
            if (options) $.extend(settings, options);

            if (!this[0] || this.selector === undefined) {
                if (settings.href != false) {
                    $.colorbox(settings);
                } else throw new Error(messages.colorboxNoHref);
            } else {
                return this.each(function () {
                    $(this).colorbox(settings);
                });
            }
        },

        iframe: function (options, colorboxOptions) {
            var settings = {
                resize: true,
                resizeDiv: '.popUpContent',
                href: false
            };

            var colorboxSettings = {
                width: '100%',
                height: '100%'
            };

            $.extend(colorboxSettings, defaults);
            if (options) $.extend(settings, options);

            if (settings.resize == true) {
                $.extend(colorboxSettings, {
                    onComplete: function () {
                        var iframe = $('#colorbox iframe');
                        iframe.load(function () {
                            var contentDiv = iframe.contents().find(settings.resizeDiv);
                            var width = contentDiv.css('width');
                            var height = contentDiv.css('height');
                            $.colorbox.resize({ width: width, height: height });
                        });
                    }
                });
            }

            if (colorboxOptions) $.extend(colorboxSettings, colorboxOptions);

            $.extend(colorboxSettings, { iframe: true });

            if (!this[0] || this.selector === undefined) {
                if (settings.href != false) {
                    $.extend(colorboxSettings, { href: settings.href });
                    $.colorbox(colorboxSettings);
                } else throw new Error(messages.colorboxNoHref);
            } else {
                return this.each(function () {
                    $(this).colorbox(colorboxSettings);
                });
            }
        },

        inline: function (options, colorboxOptions) {

            var settings = {
                href: false
            };
            var colorboxSettings = {
        };

        $.extend(colorboxSettings, defaults);
        if (options) $.extend(settings, options);

        var directTrigger;
        if (!this[0] || this.selector === undefined) {
            directTrigger = true;
            if (settings.href != false) {
                $.extend(colorboxSettings, {
                    href: settings.href,
                    onOpen: function () {
                        var href = settings.href;
                        if ($(href).length != 1) {
                            $.colorbox.close();
                            throw new Error(messages.colorboxNoInline.replace('{href}', href));
                        }
                    }
                });
            } else throw new Error(messages.colorboxNoHref);
        } else {
            directTrigger = false;
            $.extend(colorboxSettings, {
                onOpen: function () {
                    var href = $(this).attr('href');
                    if ($(href).length != 1) {
                        $.colorbox.close();
                        throw new Error(messages.colorboxNoInline.replace('{href}', href));
                    }
                }
            });
        }

        if (colorboxOptions) $.extend(colorboxSettings, colorboxOptions);

        $.extend(colorboxSettings, { inline: true });

        if (directTrigger == true) {
            $.colorbox(colorboxSettings);
        } else {
            return this.each(function () {
                $(this).colorbox(colorboxSettings);
            });
        }
    }
};

$.fn.agpopup = function (method) {

    if (!this[0] && this.selector) {
        return this;
    }

    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.portTo.apply(this, arguments);
    } else {
        $.error(messages.noMethod.replace('{method}', method));
    }

};

$(methods.init);

})(jQuery);