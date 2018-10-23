"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _bunaInstance = require("./bunaInstance");var _bunaInstance2 = _interopRequireDefault(_bunaInstance);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

BunaClass = function () {
    function BunaClass(name, superclass, methods) {(0, _classCallCheck3.default)(this, BunaClass);
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
    }(0, _createClass3.default)(BunaClass, [{ key: "findMethod", value: function findMethod(

        instance, name) {
            if (this.methods.has(name)) {
                return this.methods.get(name).bind(instance);
            }

            if (this.superclass != null) {
                return this.superclass.findMethod(instance, name);
            }

            return null;
        } }, { key: "arity", value: function arity()

        {
            var initializer = this.methods.get("init");
            if (initializer == null) return 0;
            return initializer.arity();
        } }, { key: "call", value: function call(

        interpreter, args) {
            var instance = new _bunaInstance2.default(this);
            var initializer = this.methods.get("init");
            if (initializer != null) {
                initializer.bind(instance).call(interpreter, args);
            }
            return instance;
        } }, { key: "toString", value: function toString()

        {
            return this.name;
        } }]);return BunaClass;}();exports.default = BunaClass;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9idW5hQ2xhc3MuanMiXSwibmFtZXMiOlsiQnVuYUNsYXNzIiwibmFtZSIsInN1cGVyY2xhc3MiLCJtZXRob2RzIiwiaW5zdGFuY2UiLCJoYXMiLCJnZXQiLCJiaW5kIiwiZmluZE1ldGhvZCIsImluaXRpYWxpemVyIiwiYXJpdHkiLCJpbnRlcnByZXRlciIsImFyZ3MiLCJCdW5hSW5zdGFuY2UiLCJjYWxsIl0sIm1hcHBpbmdzIjoiNlVBQUEsOEM7O0FBRXFCQSxTO0FBQ2pCLHVCQUFZQyxJQUFaLEVBQWtCQyxVQUFsQixFQUE4QkMsT0FBOUIsRUFBdUM7QUFDbkMsYUFBS0YsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDSCxLOztBQUVVQyxnQixFQUFVSCxJLEVBQU07QUFDdkIsZ0JBQUksS0FBS0UsT0FBTCxDQUFhRSxHQUFiLENBQWlCSixJQUFqQixDQUFKLEVBQTRCO0FBQ3hCLHVCQUFPLEtBQUtFLE9BQUwsQ0FBYUcsR0FBYixDQUFpQkwsSUFBakIsRUFBdUJNLElBQXZCLENBQTRCSCxRQUE1QixDQUFQO0FBQ0g7O0FBRUQsZ0JBQUksS0FBS0YsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUN6Qix1QkFBTyxLQUFLQSxVQUFMLENBQWdCTSxVQUFoQixDQUEyQkosUUFBM0IsRUFBcUNILElBQXJDLENBQVA7QUFDSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0gsUzs7QUFFTztBQUNKLGdCQUFJUSxjQUFjLEtBQUtOLE9BQUwsQ0FBYUcsR0FBYixDQUFpQixNQUFqQixDQUFsQjtBQUNBLGdCQUFJRyxlQUFlLElBQW5CLEVBQXlCLE9BQU8sQ0FBUDtBQUN6QixtQkFBT0EsWUFBWUMsS0FBWixFQUFQO0FBQ0gsUzs7QUFFSUMsbUIsRUFBYUMsSSxFQUFNO0FBQ3BCLGdCQUFJUixXQUFXLElBQUlTLHNCQUFKLENBQWlCLElBQWpCLENBQWY7QUFDQSxnQkFBSUosY0FBYyxLQUFLTixPQUFMLENBQWFHLEdBQWIsQ0FBaUIsTUFBakIsQ0FBbEI7QUFDQSxnQkFBSUcsZUFBZSxJQUFuQixFQUF5QjtBQUNyQkEsNEJBQVlGLElBQVosQ0FBaUJILFFBQWpCLEVBQTJCVSxJQUEzQixDQUFnQ0gsV0FBaEMsRUFBNkNDLElBQTdDO0FBQ0g7QUFDRCxtQkFBT1IsUUFBUDtBQUNILFM7O0FBRVU7QUFDUCxtQkFBTyxLQUFLSCxJQUFaO0FBQ0gsUyw0Q0FwQ2dCRCxTIiwiZmlsZSI6ImJ1bmFDbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCdW5hSW5zdGFuY2UgZnJvbSAnLi9idW5hSW5zdGFuY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdW5hQ2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHN1cGVyY2xhc3MsIG1ldGhvZHMpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcztcbiAgICAgICAgdGhpcy5tZXRob2RzID0gbWV0aG9kcztcbiAgICB9XG5cbiAgICBmaW5kTWV0aG9kKGluc3RhbmNlLCBuYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZXRob2RzLmdldChuYW1lKS5iaW5kKGluc3RhbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VwZXJjbGFzcy5maW5kTWV0aG9kKGluc3RhbmNlLCBuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFyaXR5KCkge1xuICAgICAgICBsZXQgaW5pdGlhbGl6ZXIgPSB0aGlzLm1ldGhvZHMuZ2V0KFwiaW5pdFwiKTtcbiAgICAgICAgaWYgKGluaXRpYWxpemVyID09IG51bGwpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXIuYXJpdHkoKTtcbiAgICB9XG5cbiAgICBjYWxsKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIGxldCBpbnN0YW5jZSA9IG5ldyBCdW5hSW5zdGFuY2UodGhpcyk7XG4gICAgICAgIGxldCBpbml0aWFsaXplciA9IHRoaXMubWV0aG9kcy5nZXQoXCJpbml0XCIpO1xuICAgICAgICBpZiAoaW5pdGlhbGl6ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZXIuYmluZChpbnN0YW5jZSkuY2FsbChpbnRlcnByZXRlciwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgIH1cbn0iXX0=