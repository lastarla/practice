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
                required: function (value) {
                    if (value) {
                        return true;
                    }
                },

                id_card: function (value) {
                    var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;

                    if (reg.test(value)) {
                        return true;
                    }
                },

                email: function (value) {
                    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

                    if (reg.test(value)) {
                        return true;
                    }
                },

                tel: function (value) {
                    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;

                    if (reg.test(value)) {
                        return true;
                    }
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

            setTimeout(function () {
                me._bindEventHandle();
            });
        },

        _bindEventHandle: function () {
            var me = this;
            var rule = me.opts.rule;
            var forms = me.forms;

            for (var i in rule) {
                if (rule.hasOwnProperty(i)) {
                    var obj = rule[i];

                    for (var j in obj) {
                        if (obj.hasOwnProperty(j) && obj[j]) {
                            (function (i, j) {
                                var method = me.methods[j];
                                method && forms[i].on(method.events, function (e) {
                                    var $this = $(this);
                                    var value = $this.val();
                                    var result = method.fn(value, obj[j], method.message );
                                    var valid = typeof result === 'object' ? result.valid : result;
                                    var message = typeof result === 'object' ? result.message || method.message : method.message;

                                    if (valid) {
                                        me.hideMessage($this);
                                    }
                                    else {
                                        me.showMessage($this, message);
                                    }
                                });
                            })(i, j);
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

                if (me.$form.find('.error').length) {
                    return false;
                }
            });
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

        showMessage: function (target, message) {
            if (target.siblings('.error').length) {
                return;
            }
            target.after('<span class="error" style="color: red; padding: 0 10px;">' + message + '</span>')
        },

        hideMessage: function (target) {
            target.siblings('.error').remove();
        }
    };

    $.fn.formValidate = function (options) {
        return new FormValidate(this, options);
    };

})(jQuery, window, document);