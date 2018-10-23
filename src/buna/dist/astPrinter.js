"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var AstPrinter = function () {
    function AstPrinter() {(0, _classCallCheck3.default)(this, AstPrinter);

    }(0, _createClass3.default)(AstPrinter, [{ key: "print", value: function print(

        expr) {
            return expr.accept(this);
        } }, { key: "visitAssignExpr", value: function visitAssignExpr(

        expr) {
            return null;
        } }, { key: "visitBinaryExpr", value: function visitBinaryExpr(

        expr) {
            return this.parenthesize(expr.operator.lexeme, [expr.left, expr.right]);
        } }, { key: "visitCallExpr", value: function visitCallExpr(

        expr) {
            return null;
        } }, { key: "visitGetExpr", value: function visitGetExpr(

        expr) {
            return null;
        } }, { key: "visitGroupingExpr", value: function visitGroupingExpr(

        expr) {
            return this.parenthesize("group", [expr.expression]);
        } }, { key: "visitLiteralExpr", value: function visitLiteralExpr(

        expr) {
            if (expr.value == null) return "nil";
            return expr.value.toString();
        } }, { key: "visitLogicalExpr", value: function visitLogicalExpr(

        expr) {
            return null;
        } }, { key: "visitMsgExpr", value: function visitMsgExpr(

        expr) {
            return null;
        } }, { key: "visitSetExpr", value: function visitSetExpr(

        expr) {
            return null;
        } }, { key: "visitSuperExpr", value: function visitSuperExpr(

        expr) {
            return null;
        } }, { key: "visitThisExpr", value: function visitThisExpr(

        expr) {
            return null;
        } }, { key: "visitUnaryExpr", value: function visitUnaryExpr(

        expr) {
            return this.parenthesize(expr.operator.lexeme, [expr.right]);
        } }, { key: "visitVariableExpr", value: function visitVariableExpr(

        expr) {
            return expr.name.lexeme;
        } }, { key: "parenthesize", value: function parenthesize(

        name, exprs) {var _this = this;
            var builder = "(" + name;
            exprs.forEach(function (expr) {
                builder += " ";
                builder += expr.accept(_this);
            });
            builder += ")";
            return builder;
        } }]);return AstPrinter;}();exports.default = AstPrinter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9hc3RQcmludGVyLmpzIl0sIm5hbWVzIjpbIkFzdFByaW50ZXIiLCJleHByIiwiYWNjZXB0IiwicGFyZW50aGVzaXplIiwib3BlcmF0b3IiLCJsZXhlbWUiLCJsZWZ0IiwicmlnaHQiLCJleHByZXNzaW9uIiwidmFsdWUiLCJ0b1N0cmluZyIsIm5hbWUiLCJleHBycyIsImJ1aWxkZXIiLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOGFBQXFCQSxVO0FBQ2pCLDBCQUFjOztBQUViLEs7O0FBRUtDLFksRUFBTTtBQUNSLG1CQUFPQSxLQUFLQyxNQUFMLENBQVksSUFBWixDQUFQO0FBQ0gsUzs7QUFFZUQsWSxFQUFNO0FBQ2xCLG1CQUFPLElBQVA7QUFDSCxTOztBQUVlQSxZLEVBQU07QUFDbEIsbUJBQU8sS0FBS0UsWUFBTCxDQUFrQkYsS0FBS0csUUFBTCxDQUFjQyxNQUFoQyxFQUF3QyxDQUFDSixLQUFLSyxJQUFOLEVBQVlMLEtBQUtNLEtBQWpCLENBQXhDLENBQVA7QUFDSCxTOztBQUVhTixZLEVBQU07QUFDaEIsbUJBQU8sSUFBUDtBQUNILFM7O0FBRVlBLFksRUFBTTtBQUNmLG1CQUFPLElBQVA7QUFDSCxTOztBQUVpQkEsWSxFQUFNO0FBQ3BCLG1CQUFPLEtBQUtFLFlBQUwsQ0FBa0IsT0FBbEIsRUFBMkIsQ0FBQ0YsS0FBS08sVUFBTixDQUEzQixDQUFQO0FBQ0gsUzs7QUFFZ0JQLFksRUFBTTtBQUNuQixnQkFBSUEsS0FBS1EsS0FBTCxJQUFjLElBQWxCLEVBQXdCLE9BQU8sS0FBUDtBQUN4QixtQkFBT1IsS0FBS1EsS0FBTCxDQUFXQyxRQUFYLEVBQVA7QUFDSCxTOztBQUVnQlQsWSxFQUFNO0FBQ25CLG1CQUFPLElBQVA7QUFDSCxTOztBQUVZQSxZLEVBQU07QUFDZixtQkFBTyxJQUFQO0FBQ0gsUzs7QUFFWUEsWSxFQUFNO0FBQ2YsbUJBQU8sSUFBUDtBQUNILFM7O0FBRWNBLFksRUFBTTtBQUNqQixtQkFBTyxJQUFQO0FBQ0gsUzs7QUFFYUEsWSxFQUFNO0FBQ2hCLG1CQUFPLElBQVA7QUFDSCxTOztBQUVjQSxZLEVBQU07QUFDakIsbUJBQU8sS0FBS0UsWUFBTCxDQUFrQkYsS0FBS0csUUFBTCxDQUFjQyxNQUFoQyxFQUF3QyxDQUFDSixLQUFLTSxLQUFOLENBQXhDLENBQVA7QUFDSCxTOztBQUVpQk4sWSxFQUFNO0FBQ3BCLG1CQUFPQSxLQUFLVSxJQUFMLENBQVVOLE1BQWpCO0FBQ0gsUzs7QUFFWU0sWSxFQUFNQyxLLEVBQU87QUFDdEIsZ0JBQUlDLFVBQVUsTUFBTUYsSUFBcEI7QUFDQUMsa0JBQU1FLE9BQU4sQ0FBYyxVQUFDYixJQUFELEVBQVU7QUFDcEJZLDJCQUFXLEdBQVg7QUFDQUEsMkJBQVlaLEtBQUtDLE1BQUwsQ0FBWSxLQUFaLENBQVo7QUFDSCxhQUhEO0FBSUFXLHVCQUFXLEdBQVg7QUFDQSxtQkFBT0EsT0FBUDtBQUNILFMsNkNBdEVnQmIsVSIsImZpbGUiOiJhc3RQcmludGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXN0UHJpbnRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBwcmludChleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLmFjY2VwdCh0aGlzKTtcbiAgICB9XG5cbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRoZXNpemUoZXhwci5vcGVyYXRvci5sZXhlbWUsIFtleHByLmxlZnQsIGV4cHIucmlnaHRdKTtcbiAgICB9XG5cbiAgICB2aXNpdENhbGxFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmlzaXRHZXRFeHByKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRoZXNpemUoXCJncm91cFwiLCBbZXhwci5leHByZXNzaW9uXSk7XG4gICAgfVxuXG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByKSB7XG4gICAgICAgIGlmIChleHByLnZhbHVlID09IG51bGwpIHJldHVybiBcIm5pbFwiO1xuICAgICAgICByZXR1cm4gZXhwci52YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdE1zZ0V4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdFNldEV4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdFN1cGVyRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZpc2l0VGhpc0V4cHIoZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2aXNpdFVuYXJ5RXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudGhlc2l6ZShleHByLm9wZXJhdG9yLmxleGVtZSwgW2V4cHIucmlnaHRdKTtcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByKSB7XG4gICAgICAgIHJldHVybiBleHByLm5hbWUubGV4ZW1lO1xuICAgIH1cblxuICAgIHBhcmVudGhlc2l6ZShuYW1lLCBleHBycykge1xuICAgICAgICBsZXQgYnVpbGRlciA9IFwiKFwiICsgbmFtZTtcbiAgICAgICAgZXhwcnMuZm9yRWFjaCgoZXhwcikgPT4ge1xuICAgICAgICAgICAgYnVpbGRlciArPSBcIiBcIjtcbiAgICAgICAgICAgIGJ1aWxkZXIgKz0gKGV4cHIuYWNjZXB0KHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJ1aWxkZXIgKz0gXCIpXCI7XG4gICAgICAgIHJldHVybiBidWlsZGVyO1xuICAgIH1cbn0iXX0=