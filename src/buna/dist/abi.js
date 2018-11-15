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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9hYmkuanMiXSwibmFtZXMiOlsiU3RtdCIsImFiaSIsInN0bXQiLCJDbGFzcyIsIm1ldGhvZHMiLCJmb3JFYWNoIiwibWV0aG9kIiwibmFtZSIsImxleGVtZSIsImlucHV0cyIsInBhcmFtcyIsIm1hcCIsInBhcmFtIiwicHVzaCIsImNyZWF0ZSIsIkVudmlyb25tZW50IiwidmFsdWVzIiwidmFsdWUiLCJrZXkiLCJEZWZhdWx0QnVuYUZ1bmN0aW9uIiwidHlwZSJdLCJtYXBwaW5ncyI6IjZVQUFBLDhCLElBQVlBLEk7QUFDWiw0QztBQUNBLDhDOztBQUVlO0FBQ1gsbUJBQWM7QUFDVixhQUFLQyxHQUFMLEdBQVcsRUFBWDtBQUNILEtBSFU7O0FBS05DLFlBTE0sRUFLQTtBQUNQLGdCQUFJRCxZQUFKO0FBQ0EsZ0JBQUlDLGdCQUFnQkYsS0FBS0csS0FBekIsRUFBZ0M7QUFDNUJELHFCQUFLRSxPQUFMLENBQWFDLE9BQWIsQ0FBcUIsVUFBQ0MsTUFBRCxFQUFZO0FBQzdCLHdCQUFJQyxPQUFPRCxPQUFPQyxJQUFQLENBQVlDLE1BQXZCO0FBQ0Esd0JBQUlDLFNBQVNILE9BQU9JLE1BQVAsQ0FBY0MsR0FBZCxDQUFrQixVQUFDQyxLQUFELEVBQVU7QUFDckMsK0JBQU9BLE1BQU1KLE1BQWI7QUFDSCxxQkFGWSxDQUFiO0FBR0EsMEJBQUtQLEdBQUwsQ0FBU1ksSUFBVCxDQUFjLE1BQUtDLE1BQUwsQ0FBWVAsSUFBWixFQUFrQkUsTUFBbEIsRUFBMEIsUUFBMUIsQ0FBZDtBQUNILGlCQU5EO0FBT0gsYUFSRCxNQVFNLElBQUdQLGdCQUFnQmEscUJBQW5CLEVBQStCLENBQUM7QUFDbENiLHFCQUFLYyxNQUFMLENBQVlYLE9BQVosQ0FBb0IsVUFBQ1ksS0FBRCxFQUFRQyxHQUFSLEVBQWM7QUFDOUIsd0JBQUdELGlCQUFpQkUsaUNBQXBCLEVBQXdDO0FBQ3BDO0FBQ0gscUJBRkQsTUFFTTtBQUNGLDRCQUFJWixPQUFPVyxHQUFYO0FBQ0EsNEJBQUlULFNBQVMsRUFBYjtBQUNBLDhCQUFLUixHQUFMLENBQVNZLElBQVQsQ0FBYyxNQUFLQyxNQUFMLENBQVlQLElBQVosRUFBa0JFLE1BQWxCLEVBQTBCLE9BQTFCLENBQWQ7QUFDSDtBQUNKLGlCQVJEO0FBU0g7QUFDSjs7QUFFRDtBQTVCVywrQ0E2QkpGLElBN0JJLEVBNkJFRSxNQTdCRixFQTZCVVcsSUE3QlYsRUE2QmdCO0FBQ3ZCLG1CQUFPLElBQUksU0FBU25CLEdBQVQsR0FBYztBQUNyQixxQkFBS00sSUFBTCxHQUFZQSxJQUFaO0FBQ0EscUJBQUtFLE1BQUwsR0FBY0EsTUFBZDtBQUNBLHFCQUFLVyxJQUFMLEdBQVlBLElBQVo7QUFDSCxhQUpNLEVBQVA7QUFLSCxTQW5DVTs7QUFxQ0w7QUFDRixtQkFBTyxLQUFLbkIsR0FBWjtBQUNILFNBdkNVLHNCIiwiZmlsZSI6ImFiaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFN0bXQgZnJvbSBcIi4vc3RtdFwiO1xuaW1wb3J0IEVudmlyb25tZW50IGZyb20gXCIuL2Vudmlyb25tZW50XCI7XG5pbXBvcnQgeyBEZWZhdWx0QnVuYUZ1bmN0aW9uIH0gZnJvbSBcIi4vYnVuYUZ1bmN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBjbGFzcyBBYmkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmFiaSA9IFtdO1xuICAgIH1cblxuICAgIHB1c2goc3RtdCkge1xuICAgICAgICBsZXQgYWJpO1xuICAgICAgICBpZiAoc3RtdCBpbnN0YW5jZW9mIFN0bXQuQ2xhc3MpIHtcbiAgICAgICAgICAgIHN0bXQubWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IG1ldGhvZC5uYW1lLmxleGVtZTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gbWV0aG9kLnBhcmFtcy5tYXAoKHBhcmFtKSA9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtLmxleGVtZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdGhpcy5hYmkucHVzaCh0aGlzLmNyZWF0ZShuYW1lLCBpbnB1dHMsICdtZXRob2QnKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9ZWxzZSBpZihzdG10IGluc3RhbmNlb2YgRW52aXJvbm1lbnQpey8v546v5aKD5Y+Y6YePXG4gICAgICAgICAgICBzdG10LnZhbHVlcy5mb3JFYWNoKCh2YWx1ZSwga2V5KT0+e1xuICAgICAgICAgICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgRGVmYXVsdEJ1bmFGdW5jdGlvbil7XG4gICAgICAgICAgICAgICAgICAgIC8vcGFzcztcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWJpLnB1c2godGhpcy5jcmVhdGUobmFtZSwgaW5wdXRzLCAnY29uc3QnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgY3JlYXRlKG5hbWUsIGlucHV0cywgdHlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IGZ1bmN0aW9uIGFiaSgpe1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB9KCk7XG4gICAgfVxuXG4gICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hYmk7XG4gICAgfVxufSJdfQ==