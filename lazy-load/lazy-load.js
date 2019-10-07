/**
 * 懒加载
 */

(function ($, window, document) {

    function LazyLoad(el, options) {
        this.defOptions = {
            scrollWrapper: $(window),
            attr: 'data-src',
            distance: 100,
            wait: 100,
            css: {
                width: '100%',
                height: '100%'
            },
            templete: '',    // 图片容器 '<div></div>'
            images: [],      // 图片地址 ['imgUrl', 'imgUrl']
            loading: 'http://img2.bdstatic.com/static/searchresult/img/loading_circle_40b82ef.gif'
        };
        this.opts = $.extend(true, {}, this.defOptions, options);
        this._init(el);
    }

    LazyLoad.prototype = {
        constructor: LazyLoad,

        _init: function (el) {
            this._initImg(el);
            this._getDom(el);
            this._getData();
            this._bindEvent();
            this._loadImgs();
        },

        _initImg: function (el) {
            var css = this.opts.css;
            var attr = this.opts.attr;
            var images = this.opts.images;
            var loading = this.opts.loading;
            var templete = this.opts.templete;

            if (!images.length) {
                return;
            }

            var wrapper = $('<div></div>');
            
            $.each(images, function (index, item) {
                var img = $('<img>');

                img.css(css);
                img.attr(attr, item);
                img.attr('src', loading);

                if (templete) {
                    var imgWrapper = $(templete);
                    imgWrapper.append(img);
                    wrapper.append(imgWrapper);
                }
                else {
                    wrapper.append(img);
                }
            });

            el.html(wrapper.html());
        },

        _getDom: function (el) {
            this.$el = el;
            this.$imgs = this.$el.find('img');
            this.$scrollWrapper = this.opts.scrollWrapper;
        },
        
        _getData: function () {
            this.data = this.data || {};
            this.data.scrollWrapperHeight = this.$scrollWrapper.height();
        },

        _bindEvent: function () {
            var me = this;

            me.$scrollWrapper.on('scroll.LazyLoad', me._throttle(function () {
                me.start && me._loadImgs();
            }, me.opts.wait));
        },

        _throttle: function (cb, wait) {
            var me = this;

            return function () {
                var now = new Date().getTime();
                me.last = me.last || 0;

                me.scrollTimer = setTimeout(function () {
                    cb && cb();
                }, wait);

                if (now - me.last < wait) {
                    clearTimeout(me.scrollTimer);
                }
            };
        },

        _loadImgs: function () {
            var me = this;
            
            $.each(me.$imgs, function (index, item) {
                me._isNeedLoad(item) && me._loadImg(item);
            });
        },

        _loadImg: function (img) {
            var $img = $(img);
            var src = $img.attr(this.opts.attr);
            src && ($img.attr('src', src), img.loadStatus = true);
        },

        _isNeedLoad: function (img) {
            if (img.loadStatus) {
                return;
            }

            if (!this._isInView(img)) {
                return;
            }

            return true;
        },

        _isInView: function (img) {
            var top = this._getPos(img, this.$scrollWrapper[0]).top;
            var distance = this.opts.distance;
            var scrollTop = this.$scrollWrapper.scrollTop();
            var scrollWrapperHeight = this.data.scrollWrapperHeight;

            if (top - scrollTop - distance <= scrollWrapperHeight) {
                return true;
            }
        },

        _getPos: function (img, parent) {
            var top = 0;
            var left = 0;

            while(img && img !== parent) {
                top += img.offsetTop || 0;
                left += img.offsetLeft || 0;
                img = img.offsetParent;
            }

            return {
                top: top,
                left: left
            };
        },

        load: function () {
            this.start = true;
        },

        destroy: function () {
            this.$el = null;
            this.$imgs = null;
            this.$scrollWrapper.off('scroll.LazyLoad');
            this.$scrollWrapper = null;
            this.opts.scrollWrapper = null;
            this.opts = null;
        }
    };

    $.fn.lazyLoad = function (options) {
        return new LazyLoad(this, options);
    };

})(jQuery, window, document);