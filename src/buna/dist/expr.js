"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.Variable = exports.Unary = exports.This = exports.Super = exports.Set = exports.Logical = exports.Literal = exports.Grouping = exports.Get = exports.Call = exports.Binary = exports.Assign = undefined;var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var
Assign = function () {
    function Assign(name, value) {(0, _classCallCheck3.default)(this, Assign);
        this.name = name;
        this.value = value;
    }(0, _createClass3.default)(Assign, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitAssignExpr(this);
        } }]);return Assign;}();var


Binary = function () {
    function Binary(left, operator, right) {(0, _classCallCheck3.default)(this, Binary);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }(0, _createClass3.default)(Binary, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitBinaryExpr(this);
        } }]);return Binary;}();var


Call = function () {
    function Call(callee, paren, args) {(0, _classCallCheck3.default)(this, Call);
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }(0, _createClass3.default)(Call, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitCallExpr(this);
        } }]);return Call;}();var


Get = function () {
    function Get(object, name) {(0, _classCallCheck3.default)(this, Get);
        this.object = object;
        this.name = name;
    }(0, _createClass3.default)(Get, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitGetExpr(this);
        } }]);return Get;}();var


Grouping = function () {
    function Grouping(expression) {(0, _classCallCheck3.default)(this, Grouping);
        this.expression = expression;
    }(0, _createClass3.default)(Grouping, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitGroupingExpr(this);
        } }]);return Grouping;}();var


Literal = function () {
    function Literal(value) {(0, _classCallCheck3.default)(this, Literal);
        this.value = value;
    }(0, _createClass3.default)(Literal, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitLiteralExpr(this);
        } }]);return Literal;}();var


Logical = function () {
    function Logical(left, operator, right) {(0, _classCallCheck3.default)(this, Logical);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }(0, _createClass3.default)(Logical, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitLogicalExpr(this);
        } }]);return Logical;}();var


Msg = function () {
    function Msg(keyword, method) {(0, _classCallCheck3.default)(this, Msg);
        this.keyword = keyword;
        this.method = method;
    }(0, _createClass3.default)(Msg, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitMsgExpr(this);
        } }]);return Msg;}();var


Set = function () {
    function Set(object, name, value) {(0, _classCallCheck3.default)(this, Set);
        this.object = object;
        this.name = name;
        this.value = value;
    }(0, _createClass3.default)(Set, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitSetExpr(this);
        } }]);return Set;}();var


Super = function () {
    function Super(keyword, method) {(0, _classCallCheck3.default)(this, Super);
        this.keyword = keyword;
        this.method = method;
    }(0, _createClass3.default)(Super, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitSuperExpr(this);
        } }]);return Super;}();var


This = function () {
    function This(keyword) {(0, _classCallCheck3.default)(this, This);
        this.keyword = keyword;
    }(0, _createClass3.default)(This, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitThisExpr(this);
        } }]);return This;}();var


Unary = function () {
    function Unary(operator, right) {(0, _classCallCheck3.default)(this, Unary);
        this.operator = operator;
        this.right = right;
    }(0, _createClass3.default)(Unary, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitUnaryExpr(this);
        } }]);return Unary;}();var


Variable = function () {
    function Variable(name) {(0, _classCallCheck3.default)(this, Variable);
        this.name = name;
    }(0, _createClass3.default)(Variable, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitVariableExpr(this);
        } }]);return Variable;}();exports.


Assign = Assign;exports.Binary = Binary;exports.Call = Call;exports.Get = Get;exports.Grouping = Grouping;exports.Literal = Literal;exports.Logical = Logical;exports.Set = Set;exports.Super = Super;exports.This = This;exports.Unary = Unary;exports.Variable = Variable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9leHByLmpzIl0sIm5hbWVzIjpbIkFzc2lnbiIsIm5hbWUiLCJ2YWx1ZSIsInZpc2l0b3IiLCJ2aXNpdEFzc2lnbkV4cHIiLCJCaW5hcnkiLCJsZWZ0Iiwib3BlcmF0b3IiLCJyaWdodCIsInZpc2l0QmluYXJ5RXhwciIsIkNhbGwiLCJjYWxsZWUiLCJwYXJlbiIsImFyZ3MiLCJ2aXNpdENhbGxFeHByIiwiR2V0Iiwib2JqZWN0IiwidmlzaXRHZXRFeHByIiwiR3JvdXBpbmciLCJleHByZXNzaW9uIiwidmlzaXRHcm91cGluZ0V4cHIiLCJMaXRlcmFsIiwidmlzaXRMaXRlcmFsRXhwciIsIkxvZ2ljYWwiLCJ2aXNpdExvZ2ljYWxFeHByIiwiTXNnIiwia2V5d29yZCIsIm1ldGhvZCIsInZpc2l0TXNnRXhwciIsIlNldCIsInZpc2l0U2V0RXhwciIsIlN1cGVyIiwidmlzaXRTdXBlckV4cHIiLCJUaGlzIiwidmlzaXRUaGlzRXhwciIsIlVuYXJ5IiwidmlzaXRVbmFyeUV4cHIiLCJWYXJpYWJsZSIsInZpc2l0VmFyaWFibGVFeHByIl0sIm1hcHBpbmdzIjoiO0FBQ01BLE07QUFDRixvQkFBWUMsSUFBWixFQUFrQkMsS0FBbEIsRUFBeUI7QUFDckIsYUFBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0gsSztBQUNNQyxlLEVBQVM7QUFDWixtQkFBT0EsUUFBUUMsZUFBUixDQUF3QixJQUF4QixDQUFQO0FBQ0gsUzs7O0FBR0NDLE07QUFDRixvQkFBWUMsSUFBWixFQUFrQkMsUUFBbEIsRUFBNEJDLEtBQTVCLEVBQW1DO0FBQy9CLGFBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsYUFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0gsSztBQUNNTCxlLEVBQVM7QUFDWixtQkFBT0EsUUFBUU0sZUFBUixDQUF3QixJQUF4QixDQUFQO0FBQ0gsUzs7O0FBR0NDLEk7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QUEwQixJQUExQixDQUFQO0FBQ0gsUzs7O0FBR0l0QyxNLEdBQUFBLE0sU0FBUUssTSxHQUFBQSxNLFNBQVFLLEksR0FBQUEsSSxTQUFNSyxHLEdBQUFBLEcsU0FBS0csUSxHQUFBQSxRLFNBQVVHLE8sR0FBQUEsTyxTQUFTRSxPLEdBQUFBLE8sU0FBU00sRyxHQUFBQSxHLFNBQUtFLEssR0FBQUEsSyxTQUFPRSxJLEdBQUFBLEksU0FBTUUsSyxHQUFBQSxLLFNBQU9FLFEsR0FBQUEsUSIsImZpbGUiOiJleHByLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBBc3NpZ24ge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICAgIH1cbn1cblxuY2xhc3MgQmluYXJ5IHtcbiAgICBjb25zdHJ1Y3RvcihsZWZ0LCBvcGVyYXRvciwgcmlnaHQpIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgfVxuICAgIGFjY2VwdCh2aXNpdG9yKSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIENhbGwge1xuICAgIGNvbnN0cnVjdG9yKGNhbGxlZSwgcGFyZW4sIGFyZ3MpIHtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIEdldCB7XG4gICAgY29uc3RydWN0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdldEV4cHIodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBHcm91cGluZyB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIExpdGVyYWwge1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIExvZ2ljYWwge1xuICAgIGNvbnN0cnVjdG9yKGxlZnQsIG9wZXJhdG9yLCByaWdodCkge1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMb2dpY2FsRXhwcih0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIE1zZyB7XG4gICAgY29uc3RydWN0b3Ioa2V5d29yZCwgbWV0aG9kKSB7XG4gICAgICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdE1zZ0V4cHIodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBTZXQge1xuICAgIGNvbnN0cnVjdG9yKG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICAgIH1cbn1cblxuY2xhc3MgU3VwZXIge1xuICAgIGNvbnN0cnVjdG9yKGtleXdvcmQsIG1ldGhvZCkge1xuICAgICAgICB0aGlzLmtleXdvcmQgPSBrZXl3b3JkO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTdXBlckV4cHIodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBUaGlzIHtcbiAgICBjb25zdHJ1Y3RvcihrZXl3b3JkKSB7XG4gICAgICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XG4gICAgfVxuICAgIGFjY2VwdCh2aXNpdG9yKSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGhpc0V4cHIodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBVbmFyeSB7XG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3IsIHJpZ2h0KSB7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5RXhwcih0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIFZhcmlhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIGFjY2VwdCh2aXNpdG9yKSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VmFyaWFibGVFeHByKHRoaXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQXNzaWduLCBCaW5hcnksIENhbGwsIEdldCwgR3JvdXBpbmcsIExpdGVyYWwsIExvZ2ljYWwsIFNldCwgU3VwZXIsIFRoaXMsIFVuYXJ5LCBWYXJpYWJsZSB9Il19