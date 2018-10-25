'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _hashmap = require('hashmap');var _hashmap2 = _interopRequireDefault(_hashmap);
var _error = require('./error');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

BunaInstance = function () {
    function BunaInstance(klass) {(0, _classCallCheck3.default)(this, BunaInstance);
        this.klass = klass;
        this.fields = new _hashmap2.default();
    }(0, _createClass3.default)(BunaInstance, [{ key: 'get', value: function get(

        name) {
            if (this.fields.has(name.lexeme)) {
                return this.fields.get(name.lexeme);
            }

            var method = this.klass.findMethod(this, name.lexeme);
            if (method != null) return method;

            throw new _error.RuntimeError(name,
            "Undefined property '" + name.lexeme + "'.");
        } }, { key: 'set', value: function set(

        name, value) {
            this.fields.set(name.lexeme, value);
        } }, { key: 'toString', value: function toString()

        {
            return this.klass.name + " instance";
        } }]);return BunaInstance;}();exports.default = BunaInstance;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hSW5zdGFuY2UuanMiXSwibmFtZXMiOlsiQnVuYUluc3RhbmNlIiwia2xhc3MiLCJmaWVsZHMiLCJIYXNoTWFwIiwibmFtZSIsImhhcyIsImxleGVtZSIsImdldCIsIm1ldGhvZCIsImZpbmRNZXRob2QiLCJSdW50aW1lRXJyb3IiLCJ2YWx1ZSIsInNldCJdLCJtYXBwaW5ncyI6IjZVQUFBLGtDO0FBQ0EsZ0M7O0FBRXFCQSxZO0FBQ2pCLDBCQUFZQyxLQUFaLEVBQW1CO0FBQ2YsYUFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsYUFBS0MsTUFBTCxHQUFjLElBQUlDLGlCQUFKLEVBQWQ7QUFDSCxLOztBQUVHQyxZLEVBQU07QUFDTixnQkFBSSxLQUFLRixNQUFMLENBQVlHLEdBQVosQ0FBZ0JELEtBQUtFLE1BQXJCLENBQUosRUFBa0M7QUFDOUIsdUJBQU8sS0FBS0osTUFBTCxDQUFZSyxHQUFaLENBQWdCSCxLQUFLRSxNQUFyQixDQUFQO0FBQ0g7O0FBRUQsZ0JBQUlFLFNBQVMsS0FBS1AsS0FBTCxDQUFXUSxVQUFYLENBQXNCLElBQXRCLEVBQTRCTCxLQUFLRSxNQUFqQyxDQUFiO0FBQ0EsZ0JBQUlFLFVBQVUsSUFBZCxFQUFvQixPQUFPQSxNQUFQOztBQUVwQixrQkFBTSxJQUFJRSxtQkFBSixDQUFpQk4sSUFBakI7QUFDRixxQ0FBeUJBLEtBQUtFLE1BQTlCLEdBQXVDLElBRHJDLENBQU47QUFFSCxTOztBQUVHRixZLEVBQU1PLEssRUFBTztBQUNiLGlCQUFLVCxNQUFMLENBQVlVLEdBQVosQ0FBZ0JSLEtBQUtFLE1BQXJCLEVBQTZCSyxLQUE3QjtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxLQUFLVixLQUFMLENBQVdHLElBQVgsR0FBa0IsV0FBekI7QUFDSCxTLCtDQXhCZ0JKLFkiLCJmaWxlIjoiYnVuYUluc3RhbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhhc2hNYXAgZnJvbSAnaGFzaG1hcCc7XG5pbXBvcnQge1J1bnRpbWVFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1bmFJbnN0YW5jZSB7XG4gICAgY29uc3RydWN0b3Ioa2xhc3MpIHtcbiAgICAgICAgdGhpcy5rbGFzcyA9IGtsYXNzO1xuICAgICAgICB0aGlzLmZpZWxkcyA9IG5ldyBIYXNoTWFwKCk7XG4gICAgfVxuXG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZmllbGRzLmhhcyhuYW1lLmxleGVtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpZWxkcy5nZXQobmFtZS5sZXhlbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1ldGhvZCA9IHRoaXMua2xhc3MuZmluZE1ldGhvZCh0aGlzLCBuYW1lLmxleGVtZSk7XG4gICAgICAgIGlmIChtZXRob2QgIT0gbnVsbCkgcmV0dXJuIG1ldGhvZDtcblxuICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKG5hbWUsXG4gICAgICAgICAgICBcIlVuZGVmaW5lZCBwcm9wZXJ0eSAnXCIgKyBuYW1lLmxleGVtZSArIFwiJy5cIik7XG4gICAgfVxuXG4gICAgc2V0KG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZmllbGRzLnNldChuYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5rbGFzcy5uYW1lICsgXCIgaW5zdGFuY2VcIjtcbiAgICB9XG59Il19