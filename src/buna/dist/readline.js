'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // IMPORTANT: choose one
var RL_LIB = "libreadline"; // NOTE: libreadline is GPL
//var RL_LIB = "libedit";

var ffi = require('ffi');
var rllib = ffi.Library(RL_LIB, {
    'readline': ['string', ['string']] });var


readLine = function () {
    function readLine() {(0, _classCallCheck3.default)(this, readLine);

    }(0, _createClass3.default)(readLine, null, [{ key: 'readline', value: function readline(

        prompt) {
            prompt = typeof prompt != 'undefined' ? prompt : "user> ";

            var line = rllib.readline(prompt);

            return line;
        } }]);return readLine;}();exports.default = readLine;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9yZWFkbGluZS5qcyJdLCJuYW1lcyI6WyJSTF9MSUIiLCJmZmkiLCJyZXF1aXJlIiwicmxsaWIiLCJMaWJyYXJ5IiwicmVhZExpbmUiLCJwcm9tcHQiLCJsaW5lIiwicmVhZGxpbmUiXSwibWFwcGluZ3MiOiIyYUFBQTtBQUNBLElBQUlBLFNBQVMsYUFBYixDLENBQTZCO0FBQzdCOztBQUVBLElBQUlDLE1BQU1DLFFBQVEsS0FBUixDQUFWO0FBQ0EsSUFBSUMsUUFBUUYsSUFBSUcsT0FBSixDQUFZSixNQUFaLEVBQW9CO0FBQzVCLGdCQUFZLENBQUMsUUFBRCxFQUFXLENBQUMsUUFBRCxDQUFYLENBRGdCLEVBQXBCLENBQVosQzs7O0FBSXFCSyxRO0FBQ2pCLHdCQUFjOztBQUViLEs7O0FBRWVDLGMsRUFBUTtBQUNwQkEscUJBQVMsT0FBT0EsTUFBUCxJQUFpQixXQUFqQixHQUErQkEsTUFBL0IsR0FBd0MsUUFBakQ7O0FBRUEsZ0JBQUlDLE9BQU9KLE1BQU1LLFFBQU4sQ0FBZUYsTUFBZixDQUFYOztBQUVBLG1CQUFPQyxJQUFQO0FBQ0gsUywyQ0FYZ0JGLFEiLCJmaWxlIjoicmVhZGxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJTVBPUlRBTlQ6IGNob29zZSBvbmVcbnZhciBSTF9MSUIgPSBcImxpYnJlYWRsaW5lXCI7ICAvLyBOT1RFOiBsaWJyZWFkbGluZSBpcyBHUExcbi8vdmFyIFJMX0xJQiA9IFwibGliZWRpdFwiO1xuXG52YXIgZmZpID0gcmVxdWlyZSgnZmZpJyk7XG52YXIgcmxsaWIgPSBmZmkuTGlicmFyeShSTF9MSUIsIHtcbiAgICAncmVhZGxpbmUnOiBbJ3N0cmluZycsIFsnc3RyaW5nJ11dXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcmVhZExpbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIHJlYWRsaW5lKHByb21wdCkge1xuICAgICAgICBwcm9tcHQgPSB0eXBlb2YgcHJvbXB0ICE9ICd1bmRlZmluZWQnID8gcHJvbXB0IDogXCJ1c2VyPiBcIjtcblxuICAgICAgICB2YXIgbGluZSA9IHJsbGliLnJlYWRsaW5lKHByb21wdCk7XG5cbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfVxufSJdfQ==