/**
 * 懒加载
 */

(function ($, window, document) {

    function FormValidate(el, options) {
        this.defOptions = {
            message: {
                required: '请填写必填项',
                id_card: '请正确填写身份证',
                email: '请正确填写邮箱',
                tel: '请正确填写电话号码',
            },
            rule: {}
        };
        this.opts = $.extend(true, {}, this.defOptions, options);
        this._init(el);
    }

    FormValidate.prototype = {
        constructor: FormValidate,

        _init: function (el) {
            this._initMethod();
            this._getDom(el);
            this._bindEvent();
        },

        // 初始化验证函数
        _initMethod: function () {
            var defaultMethod = {
                required: function () {
                    
                },

                id_card: function () {

                },

                email: function () {

                },

                tel: function () {

                }
            };

            var defaultData = [
                {
                    name: 'required',
                    events: 'blur',
                    fn: defaultMethod.required,
                    message: this.opts.message.required
                },
                {
                    name: 'id_card',
                    events: 'blur',
                    fn: defaultMethod.id_card,
                    message: this.opts.message.id_card
                },
                {
                    name: 'email',
                    events: 'blur',
                    fn: defaultMethod.email,
                    message: this.opts.message.email
                },
                {
                    name: 'tel',
                    events: 'blur',
                    fn: defaultMethod.tel,
                    message: this.opts.message.tel
                }
            ];

            for (var i = 0; i < defaultData.length; i++) {
                var item = defaultData[i];
                this.addMethod(item.name, item.events, item.fn, item.message);
            }
        },

        addMethod: function (name, events, fn, message) {
            this.methods  = this.methods || {};

            if (!this.methods[name]) {
                this.methods[name] = {
                    fn: fn,
                    events: events,
                    message: message
                };
            }
            else {
                console.log('该验证函数已经存在');
            }
        },

        _getDom: function (el) {
            this.$form = el;

            // 根据校验配置 获取待校验的表单项
            this.forms = {};

            var rule = this.opts.rule;

            for (var i in rule) {
                if (rule.hasOwnProperty(i)) {
                    this.forms[i] = $('#' + i, this.$form);
                }
            }
        },

        _bindEvent: function () {
            var me = this;
            var rule = me.opts.rule;
            var forms = me.forms;

            for (var i in rule) {
                if (rule.hasOwnProperty(i)) {
                    var obj = rule[i];

                    for (var j in obj) {
                        if (obj.hasOwnProperty(j) && obj[j]) {
                            var method = me.methods[j];
                            method && forms[i].on(method.events, function (e) {
                                var $this = $(this);
                                var value = $this.value();

                                if (method.fn(value)) {
                                    me.hideMessage($this);
                                }
                                else {
                                    me.showMessage($this, method.message);
                                }
                            });
                        }
                    }

                    forms[i].on('focus', function (e) {
                        me.hideMessage($(this));
                    });
                }
            }

            me.$form.on('submit', function () {
                for (var i in rule) {
                    if (rule.hasOwnProperty(i)) {
                        var obj = rule[i];
    
                        for (var j in obj) {
                            if (obj.hasOwnProperty(j) && obj[j]) {
                                var method = me.methods[j];
                                method && forms[i].trigger(method.events);
                            }
                        }
                    }
                }
            });
        },

        showMessage: function (target, message) {
            target.after('<div class="error">' + message + '</div>')
        },

        hideMessage: function (target) {
            target.siblings('.error').remove();
        }
    };

    $.fn.formValidate = function (options) {
        return new FormValidate(this, options);
    };

})(jQuery, window, document);