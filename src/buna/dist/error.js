'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Returns = exports.RuntimeError = exports.ParseError = undefined;var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _tokenType = require('./tokenType');var TokenType = _interopRequireWildcard(_tokenType);
var _stmt = require('./stmt');var Stmt = _interopRequireWildcard(_stmt);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

CustomError = function () {
    function CustomError(err, message) {(0, _classCallCheck3.default)(this, CustomError);
        this.err = err;
        this.message = message;
        this.name = "CustomError";
    }(0, _createClass3.default)(CustomError, [{ key: 'error', value: function error()

        {
            if ((0, _typeof3.default)(this.err) == "object") {
                if (this.err.type == TokenType.EOF) {
                    this.report(this.err.line, " at the end", this.message);
                } else {
                    this.report(this.err.line, " at '" + this.err.lexeme + "'", this.message);
                }
            } else {
                this.report(this.err, "", this.message);
            }
        } }, { key: 'report', value: function report(

        line, where, message) {
            console.log("[line ", line, "] Error ", where, ":", message);
        } }]);return CustomError;}();var


ParseError = function (_CustomError) {(0, _inherits3.default)(ParseError, _CustomError);
    function ParseError(err, message) {(0, _classCallCheck3.default)(this, ParseError);var _this = (0, _possibleConstructorReturn3.default)(this, (ParseError.__proto__ || (0, _getPrototypeOf2.default)(ParseError)).call(this,
        err, message));
        _this.err = err;
        _this.message = message;
        _this.name = "ParseError";return _this;
    }return ParseError;}(CustomError);var


RuntimeError = function (_CustomError2) {(0, _inherits3.default)(RuntimeError, _CustomError2);
    function RuntimeError(err, message) {(0, _classCallCheck3.default)(this, RuntimeError);var _this2 = (0, _possibleConstructorReturn3.default)(this, (RuntimeError.__proto__ || (0, _getPrototypeOf2.default)(RuntimeError)).call(this,
        err, message));
        _this2.err = err;
        _this2.message = message;
        _this2.name = "RuntimeError";return _this2;
    }return RuntimeError;}(CustomError);var


Returns = function (_Stmt$Return) {(0, _inherits3.default)(Returns, _Stmt$Return);
    function Returns(keyword, value) {(0, _classCallCheck3.default)(this, Returns);return (0, _possibleConstructorReturn3.default)(this, (Returns.__proto__ || (0, _getPrototypeOf2.default)(Returns)).call(this,
        keyword, value));
    }return Returns;}(Stmt.Return);exports.


ParseError = ParseError;exports.RuntimeError = RuntimeError;exports.Returns = Returns;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9lcnJvci5qcyJdLCJuYW1lcyI6WyJUb2tlblR5cGUiLCJTdG10IiwiQ3VzdG9tRXJyb3IiLCJlcnIiLCJtZXNzYWdlIiwibmFtZSIsInR5cGUiLCJFT0YiLCJyZXBvcnQiLCJsaW5lIiwibGV4ZW1lIiwid2hlcmUiLCJjb25zb2xlIiwibG9nIiwiUGFyc2VFcnJvciIsIlJ1bnRpbWVFcnJvciIsIlJldHVybnMiLCJrZXl3b3JkIiwidmFsdWUiLCJSZXR1cm4iXSwibWFwcGluZ3MiOiI0NkJBQUEsd0MsSUFBWUEsUztBQUNaLDhCLElBQVlDLEk7O0FBRU5DLFc7QUFDRix5QkFBWUMsR0FBWixFQUFpQkMsT0FBakIsRUFBMEI7QUFDdEIsYUFBS0QsR0FBTCxHQUFVQSxHQUFWO0FBQ0EsYUFBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsYUFBS0MsSUFBTCxHQUFZLGFBQVo7QUFDSCxLOztBQUVPO0FBQ0osZ0JBQUksc0JBQU8sS0FBS0YsR0FBWixLQUFtQixRQUF2QixFQUFpQztBQUM3QixvQkFBSSxLQUFLQSxHQUFMLENBQVNHLElBQVQsSUFBaUJOLFVBQVVPLEdBQS9CLEVBQW9DO0FBQ2hDLHlCQUFLQyxNQUFMLENBQVksS0FBS0wsR0FBTCxDQUFTTSxJQUFyQixFQUEyQixhQUEzQixFQUEwQyxLQUFLTCxPQUEvQztBQUNILGlCQUZELE1BRU87QUFDSCx5QkFBS0ksTUFBTCxDQUFZLEtBQUtMLEdBQUwsQ0FBU00sSUFBckIsRUFBMkIsVUFBVSxLQUFLTixHQUFMLENBQVNPLE1BQW5CLEdBQTRCLEdBQXZELEVBQTRELEtBQUtOLE9BQWpFO0FBQ0g7QUFDSixhQU5ELE1BTU87QUFDSCxxQkFBS0ksTUFBTCxDQUFZLEtBQUtMLEdBQWpCLEVBQXNCLEVBQXRCLEVBQTBCLEtBQUtDLE9BQS9CO0FBQ0g7QUFDSixTOztBQUVNSyxZLEVBQU1FLEssRUFBT1AsTyxFQUFTO0FBQ3pCUSxvQkFBUUMsR0FBUixDQUFZLFFBQVosRUFBc0JKLElBQXRCLEVBQTRCLFVBQTVCLEVBQXdDRSxLQUF4QyxFQUErQyxHQUEvQyxFQUFvRFAsT0FBcEQ7QUFDSCxTOzs7QUFHQ1UsVTtBQUNGLHdCQUFZWCxHQUFaLEVBQWlCQyxPQUFqQixFQUEwQjtBQUNoQkQsV0FEZ0IsRUFDWEMsT0FEVztBQUV0QixjQUFLRCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxjQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxjQUFLQyxJQUFMLEdBQVksWUFBWixDQUpzQjtBQUt6QixLLG9CQU5vQkgsVzs7O0FBU25CYSxZO0FBQ0YsMEJBQVlaLEdBQVosRUFBaUJDLE9BQWpCLEVBQTBCO0FBQ2hCRCxXQURnQixFQUNYQyxPQURXO0FBRXRCLGVBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNBLGVBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGVBQUtDLElBQUwsR0FBWSxjQUFaLENBSnNCO0FBS3pCLEssc0JBTnNCSCxXOzs7QUFTckJjLE87QUFDRixxQkFBWUMsT0FBWixFQUFxQkMsS0FBckIsRUFBNEI7QUFDbEJELGVBRGtCLEVBQ1RDLEtBRFM7QUFFM0IsSyxpQkFIaUJqQixLQUFLa0IsTTs7O0FBTW5CTCxVLEdBQUFBLFUsU0FBWUMsWSxHQUFBQSxZLFNBQWNDLE8sR0FBQUEsTyIsImZpbGUiOiJlcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRva2VuVHlwZSBmcm9tICcuL3Rva2VuVHlwZSc7XG5pbXBvcnQgKiBhcyBTdG10IGZyb20gJy4vc3RtdCc7XG5cbmNsYXNzIEN1c3RvbUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihlcnIsIG1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5lcnI9IGVycjtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJDdXN0b21FcnJvclwiO1xuICAgIH1cblxuICAgIGVycm9yKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZXJyID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVyci50eXBlID09IFRva2VuVHlwZS5FT0YpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcG9ydCh0aGlzLmVyci5saW5lLCBcIiBhdCB0aGUgZW5kXCIsIHRoaXMubWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVwb3J0KHRoaXMuZXJyLmxpbmUsIFwiIGF0ICdcIiArIHRoaXMuZXJyLmxleGVtZSArIFwiJ1wiLCB0aGlzLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnQodGhpcy5lcnIsIFwiXCIsIHRoaXMubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBvcnQobGluZSwgd2hlcmUsIG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbbGluZSBcIiwgbGluZSwgXCJdIEVycm9yIFwiLCB3aGVyZSwgXCI6XCIsIG1lc3NhZ2UpO1xuICAgIH1cbn1cblxuY2xhc3MgUGFyc2VFcnJvciBleHRlbmRzIEN1c3RvbUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihlcnIsIG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoZXJyLCBtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5lcnIgPSBlcnI7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiUGFyc2VFcnJvclwiO1xuICAgIH1cbn1cblxuY2xhc3MgUnVudGltZUVycm9yIGV4dGVuZHMgQ3VzdG9tRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKGVyciwgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcihlcnIsIG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmVyciA9IGVycjtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJSdW50aW1lRXJyb3JcIjtcbiAgICB9XG59XG5cbmNsYXNzIFJldHVybnMgZXh0ZW5kcyBTdG10LlJldHVybiB7XG4gICAgY29uc3RydWN0b3Ioa2V5d29yZCwgdmFsdWUpIHtcbiAgICAgICAgc3VwZXIoa2V5d29yZCwgdmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtQYXJzZUVycm9yLCBSdW50aW1lRXJyb3IsIFJldHVybnN9Il19