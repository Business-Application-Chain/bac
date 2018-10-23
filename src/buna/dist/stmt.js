"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.While = exports.Var = exports.Return = exports.Print = exports.If = exports.Function = exports.Expression = exports.Class = exports.Block = undefined;var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var
Block = function () {
    function Block(statements) {(0, _classCallCheck3.default)(this, Block);
        this.statements = statements;
    }(0, _createClass3.default)(Block, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitBlockStmt(this);
        } }]);return Block;}();var


Class = function () {
    function Class(name, superclass, methods) {(0, _classCallCheck3.default)(this, Class);
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
    }(0, _createClass3.default)(Class, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitClassStmt(this);
        } }]);return Class;}();var


Expression = function () {
    function Expression(expression) {(0, _classCallCheck3.default)(this, Expression);
        this.expression = expression;
    }(0, _createClass3.default)(Expression, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitExpressionStmt(this);
        } }]);return Expression;}();var


Function = function () {
    function Function(name, params, body) {(0, _classCallCheck3.default)(this, Function);
        this.name = name;
        this.params = params;
        this.body = body;
    }(0, _createClass3.default)(Function, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitFunctionStmt(this);
        } }]);return Function;}();var


If = function () {
    function If(condition, thenBranch, elseBranch) {(0, _classCallCheck3.default)(this, If);
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }(0, _createClass3.default)(If, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitIfStmt(this);
        } }]);return If;}();var


Print = function () {
    function Print(expression) {(0, _classCallCheck3.default)(this, Print);
        this.expression = expression;
    }(0, _createClass3.default)(Print, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitPrintStmt(this);
        } }]);return Print;}();var


Return = function () {
    function Return(keyword, value) {(0, _classCallCheck3.default)(this, Return);
        this.keyword = keyword;
        this.value = value;
    }(0, _createClass3.default)(Return, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitReturnStmt(this);
        } }]);return Return;}();var


Var = function () {
    function Var(name, initializer) {(0, _classCallCheck3.default)(this, Var);
        this.name = name;
        this.initializer = initializer;
    }(0, _createClass3.default)(Var, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitVarStmt(this);
        } }]);return Var;}();var


While = function () {
    function While(condition, body) {(0, _classCallCheck3.default)(this, While);
        this.condition = condition;
        this.body = body;
    }(0, _createClass3.default)(While, [{ key: "accept", value: function accept(
        visitor) {
            return visitor.visitWhileStmt(this);
        } }]);return While;}();exports.


Block = Block;exports.Class = Class;exports.Expression = Expression;exports.Function = Function;exports.If = If;exports.Print = Print;exports.Return = Return;exports.Var = Var;exports.While = While;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9zdG10LmpzIl0sIm5hbWVzIjpbIkJsb2NrIiwic3RhdGVtZW50cyIsInZpc2l0b3IiLCJ2aXNpdEJsb2NrU3RtdCIsIkNsYXNzIiwibmFtZSIsInN1cGVyY2xhc3MiLCJtZXRob2RzIiwidmlzaXRDbGFzc1N0bXQiLCJFeHByZXNzaW9uIiwiZXhwcmVzc2lvbiIsInZpc2l0RXhwcmVzc2lvblN0bXQiLCJGdW5jdGlvbiIsInBhcmFtcyIsImJvZHkiLCJ2aXNpdEZ1bmN0aW9uU3RtdCIsIklmIiwiY29uZGl0aW9uIiwidGhlbkJyYW5jaCIsImVsc2VCcmFuY2giLCJ2aXNpdElmU3RtdCIsIlByaW50IiwidmlzaXRQcmludFN0bXQiLCJSZXR1cm4iLCJrZXl3b3JkIiwidmFsdWUiLCJ2aXNpdFJldHVyblN0bXQiLCJWYXIiLCJpbml0aWFsaXplciIsInZpc2l0VmFyU3RtdCIsIldoaWxlIiwidmlzaXRXaGlsZVN0bXQiXSwibWFwcGluZ3MiOiI7QUFDTUEsSztBQUNGLG1CQUFZQyxVQUFaLEVBQXdCO0FBQ3BCLGFBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0gsSztBQUNNQyxlLEVBQVM7QUFDWixtQkFBT0EsUUFBUUMsY0FBUixDQUF1QixJQUF2QixDQUFQO0FBQ0gsUzs7O0FBR0NDLEs7QUFDRixtQkFBWUMsSUFBWixFQUFrQkMsVUFBbEIsRUFBOEJDLE9BQTlCLEVBQXVDO0FBQ25DLGFBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsYUFBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0gsSztBQUNNTCxlLEVBQVM7QUFDWixtQkFBT0EsUUFBUU0sY0FBUixDQUF1QixJQUF2QixDQUFQO0FBQ0gsUzs7O0FBR0NDLFU7QUFDRix3QkFBWUMsVUFBWixFQUF3QjtBQUNwQixhQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjtBQUNILEs7QUFDTVIsZSxFQUFTO0FBQ1osbUJBQU9BLFFBQVFTLG1CQUFSLENBQTRCLElBQTVCLENBQVA7QUFDSCxTOzs7QUFHQ0MsUTtBQUNGLHNCQUFZUCxJQUFaLEVBQWtCUSxNQUFsQixFQUEwQkMsSUFBMUIsRUFBZ0M7QUFDNUIsYUFBS1QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS1EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0gsSztBQUNNWixlLEVBQVM7QUFDWixtQkFBT0EsUUFBUWEsaUJBQVIsQ0FBMEIsSUFBMUIsQ0FBUDtBQUNILFM7OztBQUdDQyxFO0FBQ0YsZ0JBQVlDLFNBQVosRUFBdUJDLFVBQXZCLEVBQW1DQyxVQUFuQyxFQUErQztBQUMzQyxhQUFLRixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDSCxLO0FBQ01qQixlLEVBQVM7QUFDWixtQkFBT0EsUUFBUWtCLFdBQVIsQ0FBb0IsSUFBcEIsQ0FBUDtBQUNILFM7OztBQUdDQyxLO0FBQ0YsbUJBQVlYLFVBQVosRUFBd0I7QUFDcEIsYUFBS0EsVUFBTCxHQUFrQkEsVUFBbEI7QUFDSCxLO0FBQ01SLGUsRUFBUztBQUNaLG1CQUFPQSxRQUFRb0IsY0FBUixDQUF1QixJQUF2QixDQUFQO0FBQ0gsUzs7O0FBR0NDLE07QUFDRixvQkFBWUMsT0FBWixFQUFxQkMsS0FBckIsRUFBNEI7QUFDeEIsYUFBS0QsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsYUFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0gsSztBQUNNdkIsZSxFQUFTO0FBQ1osbUJBQU9BLFFBQVF3QixlQUFSLENBQXdCLElBQXhCLENBQVA7QUFDSCxTOzs7QUFHQ0MsRztBQUNGLGlCQUFZdEIsSUFBWixFQUFrQnVCLFdBQWxCLEVBQStCO0FBQzNCLGFBQUt2QixJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLdUIsV0FBTCxHQUFtQkEsV0FBbkI7QUFDSCxLO0FBQ00xQixlLEVBQVM7QUFDWixtQkFBT0EsUUFBUTJCLFlBQVIsQ0FBcUIsSUFBckIsQ0FBUDtBQUNILFM7OztBQUdDQyxLO0FBQ0YsbUJBQVliLFNBQVosRUFBdUJILElBQXZCLEVBQTZCO0FBQ3pCLGFBQUtHLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsYUFBS0gsSUFBTCxHQUFZQSxJQUFaO0FBQ0gsSztBQUNNWixlLEVBQVM7QUFDWixtQkFBT0EsUUFBUTZCLGNBQVIsQ0FBdUIsSUFBdkIsQ0FBUDtBQUNILFM7OztBQUdJL0IsSyxHQUFBQSxLLFNBQU9JLEssR0FBQUEsSyxTQUFPSyxVLEdBQUFBLFUsU0FBWUcsUSxHQUFBQSxRLFNBQVVJLEUsR0FBQUEsRSxTQUFJSyxLLEdBQUFBLEssU0FBT0UsTSxHQUFBQSxNLFNBQVFJLEcsR0FBQUEsRyxTQUFLRyxLLEdBQUFBLEsiLCJmaWxlIjoic3RtdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuY2xhc3MgQmxvY2sge1xuICAgIGNvbnN0cnVjdG9yKHN0YXRlbWVudHMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZW1lbnRzID0gc3RhdGVtZW50cztcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCbG9ja1N0bXQodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBDbGFzcyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgc3VwZXJjbGFzcywgbWV0aG9kcykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzO1xuICAgICAgICB0aGlzLm1ldGhvZHMgPSBtZXRob2RzO1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENsYXNzU3RtdCh0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIEV4cHJlc3Npb24ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFeHByZXNzaW9uU3RtdCh0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIEZ1bmN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBwYXJhbXMsIGJvZHkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxuICAgIGFjY2VwdCh2aXNpdG9yKSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RnVuY3Rpb25TdG10KHRoaXMpO1xuICAgIH1cbn1cblxuY2xhc3MgSWYge1xuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbiwgdGhlbkJyYW5jaCwgZWxzZUJyYW5jaCkge1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuQnJhbmNoID0gdGhlbkJyYW5jaDtcbiAgICAgICAgdGhpcy5lbHNlQnJhbmNoID0gZWxzZUJyYW5jaDtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRJZlN0bXQodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBQcmludCB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFByaW50U3RtdCh0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIFJldHVybiB7XG4gICAgY29uc3RydWN0b3Ioa2V5d29yZCwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5rZXl3b3JkID0ga2V5d29yZDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBhY2NlcHQodmlzaXRvcikge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFJldHVyblN0bXQodGhpcyk7XG4gICAgfVxufVxuXG5jbGFzcyBWYXIge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGluaXRpYWxpemVyKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZXIgPSBpbml0aWFsaXplcjtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJTdG10KHRoaXMpO1xuICAgIH1cbn1cblxuY2xhc3MgV2hpbGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbiwgYm9keSkge1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG4gICAgYWNjZXB0KHZpc2l0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRXaGlsZVN0bXQodGhpcyk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBCbG9jaywgQ2xhc3MsIEV4cHJlc3Npb24sIEZ1bmN0aW9uLCBJZiwgUHJpbnQsIFJldHVybiwgVmFyLCBXaGlsZSB9Il19