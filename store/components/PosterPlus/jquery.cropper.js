/*
 *!
 * jQuery Cropper v1.0.1
 * https://fengyuanchen.github.io/jquery-cropper
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2019-10-19T08:48:33.062Z
 */

(function (global, factory){
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery'), require('cropperjs')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'cropperjs'], factory) :
  (global = global || self, factory(global.jQuery, global.Cropper))
}(this, ($, Cropper) => { 'use strict'

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $
  Cropper = Cropper && Cropper.hasOwnProperty('default') ? Cropper['default'] : Cropper

  if ($ && $.fn && Cropper) {
    const AnotherCropper = $.fn.cropper
    const NAMESPACE = 'cropper'

    $.fn.cropper = function jQueryCropper(option){
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key]
      }

      let result
      this.each((i, element) => {
        const $element = $(element)
        const isDestroy = option === 'destroy'
        let cropper = $element.data(NAMESPACE)

        if (!cropper) {
          if (isDestroy) {
            return
          }

          const options = $.extend({}, $element.data(), $.isPlainObject(option) && option)
          cropper = new Cropper(element, options)
          $element.data(NAMESPACE, cropper)
        }

        if (typeof option === 'string') {
          const fn = cropper[option]

          if ($.isFunction(fn)) {
            result = fn.apply(cropper, args)

            if (result === cropper) {
              result = undefined
            }

            if (isDestroy) {
              $element.removeData(NAMESPACE)
            }
          }
        }
      })
      return result !== undefined ? result : this
    }

    $.fn.cropper.Constructor = Cropper
    $.fn.cropper.setDefaults = Cropper.setDefaults

    $.fn.cropper.noConflict = function noConflict(){
      $.fn.cropper = AnotherCropper
      return this
    }
  }

}))
