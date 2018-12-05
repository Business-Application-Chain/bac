"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _stmt = require("./stmt");var Stmt = _interopRequireWildcard(_stmt);
var _environment = require("./environment");var _environment2 = _interopRequireDefault(_environment);
var _bunaFunction = require("./bunaFunction");function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default =

new (function () {
    function Abi() {(0, _classCallCheck3.default)(this, Abi);
        this.abi = [];
    }(0, _createClass3.default)(Abi, [{ key: "push", value: function push(

        stmt) {var _this = this;
            var abi = void 0;
            if (stmt instanceof Stmt.Class) {
                stmt.methods.forEach(function (method) {
                    var name = method.name.lexeme;
                    var inputs = method.params.map(function (param) {
                        return param.lexeme;
                    });
                    _this.abi.push(_this.create(name, inputs, 'method'));
                });
            } else if (stmt instanceof _environment2.default) {//环境变量
                stmt.values.forEach(function (value, key) {
                    if (value instanceof _bunaFunction.DefaultBunaFunction) {
                        //pass;
                    } else {
                        var name = key;
                        var inputs = [];
                        _this.abi.push(_this.create(name, inputs, 'const'));
                    }
                });
            }
        }
        //
    }, { key: "create", value: function create(name, inputs, type) {
            return new function abi() {
                this.name = name;
                this.inputs = inputs;
                this.type = type;
            }();
        } }, { key: "get", value: function get()

        {
            return this.abi;
        } }]);return Abi;}())();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9hYmkuanMiXSwibmFtZXMiOlsiU3RtdCIsImFiaSIsInN0bXQiLCJDbGFzcyIsIm1ldGhvZHMiLCJmb3JFYWNoIiwibWV0aG9kIiwibmFtZSIsImxleGVtZSIsImlucHV0cyIsInBhcmFtcyIsIm1hcCIsInBhcmFtIiwicHVzaCIsImNyZWF0ZSIsIkVudmlyb25tZW50IiwidmFsdWVzIiwidmFsdWUiLCJrZXkiLCJEZWZhdWx0QnVuYUZ1bmN0aW9uIiwidHlwZSJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw0QztBQUNBLDhDOztBQUVlO0FBQ1gsbUJBQWM7QUFDVixhQUFLQyxHQUFMLEdBQVcsRUFBWDtBQUNILEtBSFU7O0FBS05DLFlBTE0sRUFLQTtBQUNQLGdCQUFJRCxZQUFKO0FBQ0EsZ0JBQUlDLGdCQUFnQkYsS0FBS0csS0FBekIsRUFBZ0M7QUFDNUJELHFCQUFLRSxPQUFMLENBQWFDLE9BQWIsQ0FBcUIsVUFBQ0MsTUFBRCxFQUFZO0FBQzdCLHdCQUFJQyxPQUFPRCxPQUFPQyxJQUFQLENBQVlDLE1BQXZCO0FBQ0Esd0JBQUlDLFNBQVNILE9BQU9JLE1BQVAsQ0FBY0MsR0FBZCxDQUFrQixVQUFDQyxLQUFELEVBQVU7QUFDckMsK0JBQU9BLE1BQU1KLE1BQWI7QUFDSCxxQkFGWSxDQUFiO0FBR0EsMEJBQUtQLEdBQUwsQ0FBU1ksSUFBVCxDQUFjLE1BQUtDLE1BQUwsQ0FBWVAsSUFBWixFQUFrQkUsTUFBbEIsRUFBMEIsUUFBMUIsQ0FBZDtBQUNILGlCQU5EO0FBT0gsYUFSRCxNQVFNLElBQUdQLGdCQUFnQmEscUJBQW5CLEVBQStCLENBQUM7QUFDbENiLHFCQUFLYyxNQUFMLENBQVlYLE9BQVosQ0FBb0IsVUFBQ1ksS0FBRCxFQUFRQyxHQUFSLEVBQWM7QUFDOUIsd0JBQUdELGlCQUFpQkUsaUNBQXBCLEVBQXdDO0FBQ3BDO0FBQ0gscUJBRkQsTUFFTTtBQUNGLDRCQUFJWixPQUFPVyxHQUFYO0FBQ0EsNEJBQUlULFNBQVMsRUFBYjtBQUNBLDhCQUFLUixHQUFMLENBQVNZLElBQVQsQ0FBYyxNQUFLQyxNQUFMLENBQVlQLElBQVosRUFBa0JFLE1BQWxCLEVBQTBCLE9BQTFCLENBQWQ7QUFDSDtBQUNKLGlCQVJEO0FBU0g7QUFDSjtBQUNEO0FBM0JXLCtDQTRCSkYsSUE1QkksRUE0QkVFLE1BNUJGLEVBNEJVVyxJQTVCVixFQTRCZ0I7QUFDdkIsbUJBQU8sSUFBSSxTQUFTbkIsR0FBVCxHQUFjO0FBQ3JCLHFCQUFLTSxJQUFMLEdBQVlBLElBQVo7QUFDQSxxQkFBS0UsTUFBTCxHQUFjQSxNQUFkO0FBQ0EscUJBQUtXLElBQUwsR0FBWUEsSUFBWjtBQUNILGFBSk0sRUFBUDtBQUtILFNBbENVOztBQW9DTDtBQUNGLG1CQUFPLEtBQUtuQixHQUFaO0FBQ0gsU0F0Q1Usc0IiLCJmaWxlIjoiYWJpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgU3RtdCBmcm9tIFwiLi9zdG10XCI7XG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSBcIi4vZW52aXJvbm1lbnRcIjtcbmltcG9ydCB7IERlZmF1bHRCdW5hRnVuY3Rpb24gfSBmcm9tIFwiLi9idW5hRnVuY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IGNsYXNzIEFiaSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYWJpID0gW107XG4gICAgfVxuXG4gICAgcHVzaChzdG10KSB7XG4gICAgICAgIGxldCBhYmk7XG4gICAgICAgIGlmIChzdG10IGluc3RhbmNlb2YgU3RtdC5DbGFzcykge1xuICAgICAgICAgICAgc3RtdC5tZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gbWV0aG9kLm5hbWUubGV4ZW1lO1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dHMgPSBtZXRob2QucGFyYW1zLm1hcCgocGFyYW0pID0+e1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW0ubGV4ZW1lXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB0aGlzLmFiaS5wdXNoKHRoaXMuY3JlYXRlKG5hbWUsIGlucHV0cywgJ21ldGhvZCcpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNlIGlmKHN0bXQgaW5zdGFuY2VvZiBFbnZpcm9ubWVudCl7Ly/njq/looPlj5jph49cbiAgICAgICAgICAgIHN0bXQudmFsdWVzLmZvckVhY2goKHZhbHVlLCBrZXkpPT57XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBEZWZhdWx0QnVuYUZ1bmN0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgLy9wYXNzO1xuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnB1dHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hYmkucHVzaCh0aGlzLmNyZWF0ZShuYW1lLCBpbnB1dHMsICdjb25zdCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vXG4gICAgY3JlYXRlKG5hbWUsIGlucHV0cywgdHlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IGZ1bmN0aW9uIGFiaSgpe1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB9KCk7XG4gICAgfVxuXG4gICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hYmk7XG4gICAgfVxufSJdfQ==