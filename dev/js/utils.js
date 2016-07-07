define([
    "jquery"
], function(
    $
){
    'use strict';

    return {

        isArray : function (any) {
            return Array.isArray(any);
        },

        isBoolean : function (any) {
            return this.toString(any) === '[object Boolean]';
        },

        isDate : function (any) {
            return this.toString(any) === '[object Date]';
        },

        isFunction:  function(any) {
            return this.toString(any) === '[object Function]';
        },

        isNumber : function (any) {
            return !isNaN(parseFloat(any)) && isFinite(any);
        },

        isString : function (any) {
            return this.toString(any) === '[object String]';
        },

        isUndefined : function (any) {
            return any === undefined;
        },

        digitFormat: function (str) {
            return str.toString().replace(/(\s)+/g, '').replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ');
        },
        
        parseDateTime: function(timestamp) {
            var date = timestamp;
            if ( typeof date == "string" ) date = parseInt(date);
            if ( typeof date != "number" ) return "";
            date = new Date(date);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            return this.parseDate(timestamp)  + " " +  (hours < 10 ? "0" : "") + hours + ":" +  (minutes < 10 ? "0" : "") + minutes + ":" +  (seconds < 10 ? "0" : "") + seconds;
        },

        parseDate: function(timestamp) {
            var date = timestamp;
            if ( typeof date == "string" ) date = parseInt(date);
            if ( typeof date != "number" ) return;
            date = new Date(date);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return (day < 10 ? "0" : "") + day + "." + (month < 10 ? "0" : "") + month + "." +  date.getFullYear();
        }
    };

});


