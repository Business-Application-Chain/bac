"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _gasConfig = require("./gasConfig");var _gasConfig2 = _interopRequireDefault(_gasConfig);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

//计算gas
var Gas = function () {

    function Gas(gas) {(0, _classCallCheck3.default)(this, Gas);
        this.Error = 0;
        if (isNaN(gas)) {
            throw { msg: "gas must numbers." };
        }
        this.gasInit = Number(gas);
        this.gasLimit = Number(gas);
        this.gasUsed = 0;
    }(0, _createClass3.default)(Gas, [{ key: "visitLiteralExpr", value: function visitLiteralExpr(











        instance) {
            this.gasReduce = _gasConfig2.default.exprLiteral;
        } }, { key: "visitVariableExpr", value: function visitVariableExpr(

        instance) {
            this.gasReduce = _gasConfig2.default.exprVariable;
        } }, { key: "visitUnaryExpr", value: function visitUnaryExpr()

        {
            this.gasReduce = _gasConfig2.default.exprUnary;
        } }, { key: "visitAssignExpr", value: function visitAssignExpr()

        {
            this.gasReduce = _gasConfig2.default.exprAssign;
        } }, { key: "visitBinaryExpr", value: function visitBinaryExpr()

        {
            this.gasReduce = _gasConfig2.default.exprBinary;
        } }, { key: "visitCallExpr", value: function visitCallExpr()

        {
            this.gasReduce = _gasConfig2.default.exprCall;
        } }, { key: "visitLogicalExpr", value: function visitLogicalExpr()

        {
            this.gasReduce = _gasConfig2.default.exprLogical;
        } }, { key: "visitBlockStmt", value: function visitBlockStmt(

        instance) {
            this.gasReduce = _gasConfig2.default.stmtBlock;
        } }, { key: "visitVarStmt", value: function visitVarStmt(

        instance) {
            this.gasReduce = _gasConfig2.default.stmtVar;
        }

        //default function
    }, { key: "clock", value: function clock()
        {
            this.gasReduce = _gasConfig2.default.clock;
        } }, { key: "visit", value: function visit(

        gas, instance) {
            var exprName = 'visit' + instance.constructor.name + 'Expr';
            var stmtName = 'visit' + instance.constructor.name + 'Stmt';
            if (typeof this[exprName] === 'function' || typeof this[stmtName] === 'function') {
                if (instance.constructor.name === 'Call') {
                    if (typeof this[instance.callee.name.lexeme] === 'function') {
                        this[instance.callee.name.lexeme]();
                    }
                }
                instance.accept(this);
            }
        } }, { key: "gasReduce", set: function set(consume) {this.gasLimit = this.gasLimit - consume;this.gasUsed = this.gasInit - this.gasLimit;if (this.gasLimit < 0) {this.gasUsed = -1;throw { msg: "gas limit is over." };}} }]);return Gas;}();exports.default = Gas;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9nYXMuanMiXSwibmFtZXMiOlsiR2FzIiwiZ2FzIiwiRXJyb3IiLCJpc05hTiIsIm1zZyIsImdhc0luaXQiLCJOdW1iZXIiLCJnYXNMaW1pdCIsImdhc1VzZWQiLCJpbnN0YW5jZSIsImdhc1JlZHVjZSIsImdhc0NvbmZpZyIsImV4cHJMaXRlcmFsIiwiZXhwclZhcmlhYmxlIiwiZXhwclVuYXJ5IiwiZXhwckFzc2lnbiIsImV4cHJCaW5hcnkiLCJleHByQ2FsbCIsImV4cHJMb2dpY2FsIiwic3RtdEJsb2NrIiwic3RtdFZhciIsImNsb2NrIiwiZXhwck5hbWUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJzdG10TmFtZSIsImNhbGxlZSIsImxleGVtZSIsImFjY2VwdCIsImNvbnN1bWUiXSwibWFwcGluZ3MiOiI2VUFBQSx3Qzs7QUFFQTtJQUNxQkEsRzs7QUFFakIsaUJBQVlDLEdBQVosRUFBaUI7QUFDYixhQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFlBQUlDLE1BQU1GLEdBQU4sQ0FBSixFQUFnQjtBQUNaLGtCQUFNLEVBQUVHLEtBQUssbUJBQVAsRUFBTjtBQUNIO0FBQ0QsYUFBS0MsT0FBTCxHQUFlQyxPQUFPTCxHQUFQLENBQWY7QUFDQSxhQUFLTSxRQUFMLEdBQWdCRCxPQUFPTCxHQUFQLENBQWhCO0FBQ0EsYUFBS08sT0FBTCxHQUFlLENBQWY7QUFDSCxLOzs7Ozs7Ozs7Ozs7QUFZZ0JDLGdCLEVBQVU7QUFDdkIsaUJBQUtDLFNBQUwsR0FBaUJDLG9CQUFVQyxXQUEzQjtBQUNILFM7O0FBRWlCSCxnQixFQUFVO0FBQ3hCLGlCQUFLQyxTQUFMLEdBQWlCQyxvQkFBVUUsWUFBM0I7QUFDSCxTOztBQUVlO0FBQ1osaUJBQUtILFNBQUwsR0FBaUJDLG9CQUFVRyxTQUEzQjtBQUNILFM7O0FBRWdCO0FBQ2IsaUJBQUtKLFNBQUwsR0FBaUJDLG9CQUFVSSxVQUEzQjtBQUNILFM7O0FBRWdCO0FBQ2IsaUJBQUtMLFNBQUwsR0FBaUJDLG9CQUFVSyxVQUEzQjtBQUNILFM7O0FBRWM7QUFDWCxpQkFBS04sU0FBTCxHQUFpQkMsb0JBQVVNLFFBQTNCO0FBQ0gsUzs7QUFFaUI7QUFDZCxpQkFBS1AsU0FBTCxHQUFpQkMsb0JBQVVPLFdBQTNCO0FBQ0gsUzs7QUFFY1QsZ0IsRUFBVTtBQUNyQixpQkFBS0MsU0FBTCxHQUFpQkMsb0JBQVVRLFNBQTNCO0FBQ0gsUzs7QUFFWVYsZ0IsRUFBVTtBQUNuQixpQkFBS0MsU0FBTCxHQUFpQkMsb0JBQVVTLE9BQTNCO0FBQ0g7O0FBRUQ7O0FBRU87QUFDSCxpQkFBS1YsU0FBTCxHQUFpQkMsb0JBQVVVLEtBQTNCO0FBQ0gsUzs7QUFFS3BCLFcsRUFBS1EsUSxFQUFVO0FBQ2pCLGdCQUFJYSxXQUFXLFVBQVViLFNBQVNjLFdBQVQsQ0FBcUJDLElBQS9CLEdBQXNDLE1BQXJEO0FBQ0EsZ0JBQUlDLFdBQVcsVUFBVWhCLFNBQVNjLFdBQVQsQ0FBcUJDLElBQS9CLEdBQXNDLE1BQXJEO0FBQ0EsZ0JBQUksT0FBTyxLQUFLRixRQUFMLENBQVAsS0FBMEIsVUFBMUIsSUFBd0MsT0FBTyxLQUFLRyxRQUFMLENBQVAsS0FBMEIsVUFBdEUsRUFBa0Y7QUFDOUUsb0JBQUloQixTQUFTYyxXQUFULENBQXFCQyxJQUFyQixLQUE4QixNQUFsQyxFQUF5QztBQUNyQyx3QkFBSSxPQUFPLEtBQUtmLFNBQVNpQixNQUFULENBQWdCRixJQUFoQixDQUFxQkcsTUFBMUIsQ0FBUCxLQUE2QyxVQUFqRCxFQUE0RDtBQUN4RCw2QkFBS2xCLFNBQVNpQixNQUFULENBQWdCRixJQUFoQixDQUFxQkcsTUFBMUI7QUFDSDtBQUNKO0FBQ0RsQix5QkFBU21CLE1BQVQsQ0FBZ0IsSUFBaEI7QUFDSDtBQUNKLFMsMENBL0RhQyxPLEVBQVMsQ0FDbkIsS0FBS3RCLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxHQUFnQnNCLE9BQWhDLENBQ0EsS0FBS3JCLE9BQUwsR0FBZSxLQUFLSCxPQUFMLEdBQWUsS0FBS0UsUUFBbkMsQ0FDQSxJQUFJLEtBQUtBLFFBQUwsR0FBZ0IsQ0FBcEIsRUFBdUIsQ0FDbkIsS0FBS0MsT0FBTCxHQUFlLENBQUMsQ0FBaEIsQ0FDQSxNQUFNLEVBQUVKLEtBQUssb0JBQVAsRUFBTixDQUNILENBRUosQyxzQ0FwQmdCSixHIiwiZmlsZSI6Imdhcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYXNDb25maWcgZnJvbSBcIi4vZ2FzQ29uZmlnXCI7XG5cbi8v6K6h566XZ2FzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYXMge1xuXG4gICAgY29uc3RydWN0b3IoZ2FzKSB7XG4gICAgICAgIHRoaXMuRXJyb3IgPSAwO1xuICAgICAgICBpZiAoaXNOYU4oZ2FzKSkge1xuICAgICAgICAgICAgdGhyb3cgeyBtc2c6IFwiZ2FzIG11c3QgbnVtYmVycy5cIiB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FzSW5pdCA9IE51bWJlcihnYXMpO1xuICAgICAgICB0aGlzLmdhc0xpbWl0ID0gTnVtYmVyKGdhcyk7XG4gICAgICAgIHRoaXMuZ2FzVXNlZCA9IDA7XG4gICAgfVxuXG4gICAgc2V0IGdhc1JlZHVjZShjb25zdW1lKSB7XG4gICAgICAgIHRoaXMuZ2FzTGltaXQgPSB0aGlzLmdhc0xpbWl0IC0gY29uc3VtZTtcbiAgICAgICAgdGhpcy5nYXNVc2VkID0gdGhpcy5nYXNJbml0IC0gdGhpcy5nYXNMaW1pdDtcbiAgICAgICAgaWYgKHRoaXMuZ2FzTGltaXQgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmdhc1VzZWQgPSAtMTtcbiAgICAgICAgICAgIHRocm93IHsgbXNnOiBcImdhcyBsaW1pdCBpcyBvdmVyLlwiIH07XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHZpc2l0TGl0ZXJhbEV4cHIoaW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy5nYXNSZWR1Y2UgPSBnYXNDb25maWcuZXhwckxpdGVyYWxcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlRXhwcihpbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmdhc1JlZHVjZSA9IGdhc0NvbmZpZy5leHByVmFyaWFibGVcbiAgICB9XG5cbiAgICB2aXNpdFVuYXJ5RXhwcigpe1xuICAgICAgICB0aGlzLmdhc1JlZHVjZSA9IGdhc0NvbmZpZy5leHByVW5hcnlcbiAgICB9XG5cbiAgICB2aXNpdEFzc2lnbkV4cHIoKXtcbiAgICAgICAgdGhpcy5nYXNSZWR1Y2UgPSBnYXNDb25maWcuZXhwckFzc2lnblxuICAgIH1cblxuICAgIHZpc2l0QmluYXJ5RXhwcigpe1xuICAgICAgICB0aGlzLmdhc1JlZHVjZSA9IGdhc0NvbmZpZy5leHByQmluYXJ5XG4gICAgfVxuXG4gICAgdmlzaXRDYWxsRXhwcigpe1xuICAgICAgICB0aGlzLmdhc1JlZHVjZSA9IGdhc0NvbmZpZy5leHByQ2FsbFxuICAgIH1cblxuICAgIHZpc2l0TG9naWNhbEV4cHIoKXtcbiAgICAgICAgdGhpcy5nYXNSZWR1Y2UgPSBnYXNDb25maWcuZXhwckxvZ2ljYWxcbiAgICB9XG5cbiAgICB2aXNpdEJsb2NrU3RtdChpbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmdhc1JlZHVjZSA9IGdhc0NvbmZpZy5zdG10QmxvY2tcbiAgICB9XG5cbiAgICB2aXNpdFZhclN0bXQoaW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy5nYXNSZWR1Y2UgPSBnYXNDb25maWcuc3RtdFZhclxuICAgIH1cblxuICAgIC8vZGVmYXVsdCBmdW5jdGlvblxuXG4gICAgY2xvY2soKXtcbiAgICAgICAgdGhpcy5nYXNSZWR1Y2UgPSBnYXNDb25maWcuY2xvY2tcbiAgICB9XG5cbiAgICB2aXNpdChnYXMsIGluc3RhbmNlKSB7XG4gICAgICAgIGxldCBleHByTmFtZSA9ICd2aXNpdCcgKyBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lICsgJ0V4cHInO1xuICAgICAgICBsZXQgc3RtdE5hbWUgPSAndmlzaXQnICsgaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZSArICdTdG10JztcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzW2V4cHJOYW1lXSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgdGhpc1tzdG10TmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQ2FsbCcpe1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1tpbnN0YW5jZS5jYWxsZWUubmFtZS5sZXhlbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tpbnN0YW5jZS5jYWxsZWUubmFtZS5sZXhlbWVdKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZS5hY2NlcHQodGhpcylcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=