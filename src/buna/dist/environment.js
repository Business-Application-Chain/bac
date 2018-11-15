'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _hashmap = require('hashmap');var _hashmap2 = _interopRequireDefault(_hashmap);
var _error = require('./error');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var


Environment = function () {
    function Environment() {var enclosing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;(0, _classCallCheck3.default)(this, Environment);
        this.enclosing = enclosing;
        this.values = new _hashmap2.default();
    }(0, _createClass3.default)(Environment, [{ key: 'define', value: function define(

        name, value) {
            this.values.set(name, value);
        } }, { key: 'get', value: function get(

        name) {
            if (this.values.has(name.lexeme)) {
                return this.values.get(name.lexeme);
            }

            if (this.enclosing != null) {
                return this.enclosing.get(name);
            }

            throw new _error.RuntimeError(name,
            "Undefined variable '" + name.lexeme + "'.");
        } }, { key: 'assign', value: function assign(

        name, value) {
            if (this.values.has(name.lexeme)) {
                this.values.set(name.lexeme, value);
                return;
            }

            if (this.enclosing != null) {
                this.enclosing.assign(name, value);
                return;
            }

            throw new _error.RuntimeError(name,
            "Undefined variable qaaa'" + name.lexeme + "'.");
        } }, { key: 'ancestor', value: function ancestor(

        distance) {
            var environment = this;
            for (var i = 0; i < distance; i++) {
                environment = environment.enclosing;
            }

            return environment;
        } }, { key: 'getAt', value: function getAt(

        distance, name) {
            return this.ancestor(distance).values.get(name);
        } }, { key: 'assignAt', value: function assignAt(

        distance, name, value) {
            this.ancestor(distance).values.set(name.lexeme, value);
        } }]);return Environment;}();exports.default = Environment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9lbnZpcm9ubWVudC5qcyJdLCJuYW1lcyI6WyJFbnZpcm9ubWVudCIsImVuY2xvc2luZyIsInZhbHVlcyIsIkhhc2hNYXAiLCJuYW1lIiwidmFsdWUiLCJzZXQiLCJoYXMiLCJsZXhlbWUiLCJnZXQiLCJSdW50aW1lRXJyb3IiLCJhc3NpZ24iLCJkaXN0YW5jZSIsImVudmlyb25tZW50IiwiaSIsImFuY2VzdG9yIl0sIm1hcHBpbmdzIjoiNlVBQUEsa0M7QUFDQSxnQzs7O0FBR3FCQSxXO0FBQ2pCLDJCQUE4QixLQUFsQkMsU0FBa0IsdUVBQU4sSUFBTTtBQUMxQixhQUFLQSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLGFBQUtDLE1BQUwsR0FBYyxJQUFJQyxpQkFBSixFQUFkO0FBQ0gsSzs7QUFFTUMsWSxFQUFNQyxLLEVBQU87QUFDaEIsaUJBQUtILE1BQUwsQ0FBWUksR0FBWixDQUFnQkYsSUFBaEIsRUFBc0JDLEtBQXRCO0FBQ0gsUzs7QUFFR0QsWSxFQUFNO0FBQ04sZ0JBQUksS0FBS0YsTUFBTCxDQUFZSyxHQUFaLENBQWdCSCxLQUFLSSxNQUFyQixDQUFKLEVBQWtDO0FBQzlCLHVCQUFPLEtBQUtOLE1BQUwsQ0FBWU8sR0FBWixDQUFnQkwsS0FBS0ksTUFBckIsQ0FBUDtBQUNIOztBQUVELGdCQUFJLEtBQUtQLFNBQUwsSUFBa0IsSUFBdEIsRUFBNEI7QUFDeEIsdUJBQU8sS0FBS0EsU0FBTCxDQUFlUSxHQUFmLENBQW1CTCxJQUFuQixDQUFQO0FBQ0g7O0FBRUQsa0JBQU0sSUFBSU0sbUJBQUosQ0FBaUJOLElBQWpCO0FBQ0YscUNBQXlCQSxLQUFLSSxNQUE5QixHQUF1QyxJQURyQyxDQUFOO0FBRUgsUzs7QUFFTUosWSxFQUFNQyxLLEVBQU87QUFDaEIsZ0JBQUksS0FBS0gsTUFBTCxDQUFZSyxHQUFaLENBQWdCSCxLQUFLSSxNQUFyQixDQUFKLEVBQWtDO0FBQzlCLHFCQUFLTixNQUFMLENBQVlJLEdBQVosQ0FBZ0JGLEtBQUtJLE1BQXJCLEVBQTZCSCxLQUE3QjtBQUNBO0FBQ0g7O0FBRUQsZ0JBQUksS0FBS0osU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUN4QixxQkFBS0EsU0FBTCxDQUFlVSxNQUFmLENBQXNCUCxJQUF0QixFQUE0QkMsS0FBNUI7QUFDQTtBQUNIOztBQUVELGtCQUFNLElBQUlLLG1CQUFKLENBQWlCTixJQUFqQjtBQUNGLHlDQUE2QkEsS0FBS0ksTUFBbEMsR0FBMkMsSUFEekMsQ0FBTjtBQUVILFM7O0FBRVFJLGdCLEVBQVU7QUFDZixnQkFBSUMsY0FBYyxJQUFsQjtBQUNBLGlCQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsUUFBcEIsRUFBOEJFLEdBQTlCLEVBQW1DO0FBQy9CRCw4QkFBY0EsWUFBWVosU0FBMUI7QUFDSDs7QUFFRCxtQkFBT1ksV0FBUDtBQUNILFM7O0FBRUtELGdCLEVBQVVSLEksRUFBTTtBQUNsQixtQkFBTyxLQUFLVyxRQUFMLENBQWNILFFBQWQsRUFBd0JWLE1BQXhCLENBQStCTyxHQUEvQixDQUFtQ0wsSUFBbkMsQ0FBUDtBQUNILFM7O0FBRVFRLGdCLEVBQVVSLEksRUFBTUMsSyxFQUFPO0FBQzVCLGlCQUFLVSxRQUFMLENBQWNILFFBQWQsRUFBd0JWLE1BQXhCLENBQStCSSxHQUEvQixDQUFtQ0YsS0FBS0ksTUFBeEMsRUFBZ0RILEtBQWhEO0FBQ0gsUyw4Q0FyRGdCTCxXIiwiZmlsZSI6ImVudmlyb25tZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhhc2hNYXAgZnJvbSAnaGFzaG1hcCc7XG5pbXBvcnQge1J1bnRpbWVFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW52aXJvbm1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGVuY2xvc2luZyA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5lbmNsb3NpbmcgPSBlbmNsb3Npbmc7XG4gICAgICAgIHRoaXMudmFsdWVzID0gbmV3IEhhc2hNYXAoKTtcbiAgICB9XG5cbiAgICBkZWZpbmUobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXQobmFtZSkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZXMuaGFzKG5hbWUubGV4ZW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmdldChuYW1lLmxleGVtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5lbmNsb3NpbmcgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5jbG9zaW5nLmdldChuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IobmFtZSxcbiAgICAgICAgICAgIFwiVW5kZWZpbmVkIHZhcmlhYmxlICdcIiArIG5hbWUubGV4ZW1lICsgXCInLlwiKTtcbiAgICB9XG5cbiAgICBhc3NpZ24obmFtZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWVzLmhhcyhuYW1lLmxleGVtZSkpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnNldChuYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZW5jbG9zaW5nICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW5jbG9zaW5nLmFzc2lnbihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKG5hbWUsXG4gICAgICAgICAgICBcIlVuZGVmaW5lZCB2YXJpYWJsZSBxYWFhJ1wiICsgbmFtZS5sZXhlbWUgKyBcIicuXCIpO1xuICAgIH1cblxuICAgIGFuY2VzdG9yKGRpc3RhbmNlKSB7XG4gICAgICAgIGxldCBlbnZpcm9ubWVudCA9IHRoaXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlzdGFuY2U7IGkrKykge1xuICAgICAgICAgICAgZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudC5lbmNsb3Npbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW52aXJvbm1lbnQ7XG4gICAgfVxuXG4gICAgZ2V0QXQoZGlzdGFuY2UsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5jZXN0b3IoZGlzdGFuY2UpLnZhbHVlcy5nZXQobmFtZSk7XG4gICAgfVxuXG4gICAgYXNzaWduQXQoZGlzdGFuY2UsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuYW5jZXN0b3IoZGlzdGFuY2UpLnZhbHVlcy5zZXQobmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICB9XG59Il19