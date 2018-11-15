"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _expr = require("./expr");var Expr = _interopRequireWildcard(_expr);
var _stmt = require("./stmt");var Stmt = _interopRequireWildcard(_stmt);
var _tokenType = require("./tokenType");var TokenType = _interopRequireWildcard(_tokenType);
var _error = require("./error");
var _token = require("./token");var _token2 = _interopRequireDefault(_token);
var _buna = require("./buna");var _buna2 = _interopRequireDefault(_buna);
var _hashmap = require("hashmap");var _hashmap2 = _interopRequireDefault(_hashmap);
var _bunaFunction = require("./bunaFunction");function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var FunctionType = {
    NONE: "NONE",
    FUNCTION: "FUNCTION",
    INITIALIZER: "INITIALIZER",
    METHOD: "METHOD" };


var ClassType = {
    NONE: "NONE",
    CLASS: "CLASS",
    SUBCLASS: "SUBCLASS" };var


Resolver = function () {
    function Resolver(interpreter) {(0, _classCallCheck3.default)(this, Resolver);
        this.interpreter = interpreter;
        this.scopes = [];
        this.currentFunction = FunctionType.NONE;
        this.currentClass = ClassType.NONE;
    }(0, _createClass3.default)(Resolver, [{ key: "resolve", value: function resolve(

        statements_or_statement_or_expression) {
            if (Array.isArray(statements_or_statement_or_expression)) {
                for (var i = 0; i < statements_or_statement_or_expression.length; i++) {
                    statements_or_statement_or_expression[i].accept(this);
                }
            } else {
                statements_or_statement_or_expression.accept(this);
            }
        } }, { key: "resolveFunction", value: function resolveFunction(

        function1, type) {
            var enclosingFunction = this.currentFunction;
            this.currentFunction = type;
            this.beginScope();
            if (function1.params) {
                for (var i = 0; i < function1.params.length; i++) {
                    this.declare(function1.params[i]);
                    this.define(function1.params[i]);
                }
            }
            this.resolve(function1.body);
            this.endScope();
            this.currentFunction = enclosingFunction;
        } }, { key: "beginScope", value: function beginScope()

        {
            this.scopes.push(new _hashmap2.default());
        } }, { key: "endScope", value: function endScope()

        {
            this.scopes.pop();
        } }, { key: "declare", value: function declare(

        name) {
            if (this.scopes.length == 0) return;

            var scope = this.scopes[this.scopes.length - 1];
            if (scope.has(name.lexeme)) {
                _buna2.default.getInstance().err(name,
                "Variable with this name already delcared in this scope.");
            }
            scope.set(name.lexeme, false);
        } }, { key: "define", value: function define(

        name) {
            if (this.scopes.length == 0) return;

            var scope = this.scopes[this.scopes.length - 1];
            scope.set(name.lexeme, true);
        } }, { key: "resolveLocal", value: function resolveLocal(

        expr, name) {
            for (var i = this.scopes.length - 1; i >= 0; i--) {
                if (!name) {
                    return;
                } else
                if (this.scopes[i].has(name.lexeme)) {
                    this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                    return;
                }
            }
            // Not found. Assume it is global.
        } }, { key: "visitAssignExpr", value: function visitAssignExpr(

        expr) {
            this.resolve(expr.value);
            this.resolveLocal(expr, expr.name);
        } }, { key: "visitBinaryExpr", value: function visitBinaryExpr(

        expr) {
            this.resolve(expr.left);
            this.resolve(expr.right);
        } }, { key: "visitCallExpr", value: function visitCallExpr(

        expr) {
            this.resolve(expr.callee);
            if (expr.args) {
                for (var i = 0; i < expr.args.length; i++) {
                    this.resolve(expr.args[i]);
                }
            }
        } }, { key: "visitGetExpr", value: function visitGetExpr(

        expr) {
            this.resolve(expr.object);
        } }, { key: "visitGroupingExpr", value: function visitGroupingExpr(

        expr) {
            this.resolve(expr.expression);
        } }, { key: "visitLiteralExpr", value: function visitLiteralExpr(

        expr) {

        } }, { key: "visitLogicalExpr", value: function visitLogicalExpr(

        expr) {
            this.resolve(expr.left);
            this.resolve(expr.right);
        } }, { key: "visitMsgExpr", value: function visitMsgExpr(

        expr) {
            this.resolveLocal(expr, expr.keyword);
        } }, { key: "visitSetExpr", value: function visitSetExpr(

        expr) {
            this.resolve(expr.object);
            this.resolve(expr.value);
        } }, { key: "visitSuperExpr", value: function visitSuperExpr(

        expr) {
            if (this.currentClass == ClassType.NONE) {
                _buna2.default.getInstance().err(expr.keyword,
                "Cannot use 'super' outside of a class.");
            } else if (this.currentClass != ClassType.SUBCLASS) {
                _buna2.default.getInstance().err(expr.keyword,
                "Cannot use 'super' in a class with no superclass.");
            }
            this.resolveLocal(expr, expr.keyword);
        } }, { key: "visitThisExpr", value: function visitThisExpr(

        expr) {
            if (this.currentClass == ClassType.NONE) {
                _buna2.default.getInstance().err(expr.keyword,
                "Cannot use 'this' outside of a class.");
            }
            this.resolveLocal(expr, expr.keyword);
        } }, { key: "visitUnaryExpr", value: function visitUnaryExpr(

        expr) {
            this.resolve(expr.right);
        } }, { key: "visitVariableExpr", value: function visitVariableExpr(

        expr) {
            if (!(this.scopes.length == 0) &&
            this.scopes[this.scopes.length - 1].get(expr.name.lexeme) == false) {
                _buna2.default.getInstance().err(expr.name,
                "Cannot read local variable in its own initializer.");
            }

            this.resolveLocal(expr, expr.name);
        } }, { key: "visitBlockStmt", value: function visitBlockStmt(

        stmt) {
            this.beginScope();
            this.resolve(stmt.statements);
            this.endScope();
        } }, { key: "visitClassStmt", value: function visitClassStmt(

        stmt) {
            var enclosingClass = this.currentClass;
            this.currentClass = ClassType.CLASS;
            this.declare(stmt.name);
            if (stmt.superclass != null) {
                this.currentClass = ClassType.SUBCLASS;
                this.resolve(stmt.superclass);
            }
            this.define(stmt.name);
            if (stmt.superclass != null) {
                this.beginScope();
                this.scopes[this.scopes.length - 1].set("super", true);
            }
            this.beginScope();
            this.scopes[this.scopes.length - 1].set("this", true);
            for (var i = 0; i < stmt.methods.length; i++) {
                var declaration = FunctionType.METHOD;
                if (stmt.methods[i].name.lexeme == "init") {
                    declaration = FunctionType.INITIALIZER;
                }
                this.resolveFunction(stmt.methods[i], declaration);
            }
            this.endScope();
            if (stmt.superclass != null) this.endScope();
            this.currentClass = enclosingClass;
        } }, { key: "visitExpressionStmt", value: function visitExpressionStmt(

        stmt) {
            this.resolve(stmt.expression);
        } }, { key: "visitFunctionStmt", value: function visitFunctionStmt(

        stmt) {
            this.declare(stmt.name);
            this.define(stmt.name);

            this.resolveFunction(stmt, FunctionType.FUNCTION);
        } }, { key: "visitIfStmt", value: function visitIfStmt(

        stmt) {
            this.resolve(stmt.condition);
            this.resolve(stmt.thenBranch);
            if (stmt.elseBranch != null) {
                this.resolve(stmt.elseBranch);
            }
        } }, { key: "visitPrintStmt", value: function visitPrintStmt(

        stmt) {
            this.resolve(stmt.expression);
        } }, { key: "visitReturnStmt", value: function visitReturnStmt(

        stmt) {
            if (this.currentFunction == FunctionType.NONE) {
                _buna2.default.getInstance().err(stmt.keyword, "Cannot return from top-level code.");
            }
            if (stmt.value != null) {
                if (this.currentFunction == FunctionType.INITIALIZER) {
                    _buna2.default.getInstance().err(stmt.keyword,
                    "Cannot return a value from an initializer.");
                }
                this.resolve(stmt.value);
            }
        } }, { key: "visitVarStmt", value: function visitVarStmt(

        stmt) {
            this.declare(stmt.name);
            if (stmt.initializer != null) {
                this.resolve(stmt.initializer);
            }
            this.define(stmt.name);
        } }, { key: "visitWhileStmt", value: function visitWhileStmt(

        stmt) {
            this.resolve(stmt.condition);
            this.resolve(stmt.body);
        } }]);return Resolver;}();exports.default = Resolver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9yZXNvbHZlci5qcyJdLCJuYW1lcyI6WyJFeHByIiwiU3RtdCIsIlRva2VuVHlwZSIsIkZ1bmN0aW9uVHlwZSIsIk5PTkUiLCJGVU5DVElPTiIsIklOSVRJQUxJWkVSIiwiTUVUSE9EIiwiQ2xhc3NUeXBlIiwiQ0xBU1MiLCJTVUJDTEFTUyIsIlJlc29sdmVyIiwiaW50ZXJwcmV0ZXIiLCJzY29wZXMiLCJjdXJyZW50RnVuY3Rpb24iLCJjdXJyZW50Q2xhc3MiLCJzdGF0ZW1lbnRzX29yX3N0YXRlbWVudF9vcl9leHByZXNzaW9uIiwiQXJyYXkiLCJpc0FycmF5IiwiaSIsImxlbmd0aCIsImFjY2VwdCIsImZ1bmN0aW9uMSIsInR5cGUiLCJlbmNsb3NpbmdGdW5jdGlvbiIsImJlZ2luU2NvcGUiLCJwYXJhbXMiLCJkZWNsYXJlIiwiZGVmaW5lIiwicmVzb2x2ZSIsImJvZHkiLCJlbmRTY29wZSIsInB1c2giLCJIYXNoTWFwIiwicG9wIiwibmFtZSIsInNjb3BlIiwiaGFzIiwibGV4ZW1lIiwiQnVuYSIsImdldEluc3RhbmNlIiwiZXJyIiwic2V0IiwiZXhwciIsInZhbHVlIiwicmVzb2x2ZUxvY2FsIiwibGVmdCIsInJpZ2h0IiwiY2FsbGVlIiwiYXJncyIsIm9iamVjdCIsImV4cHJlc3Npb24iLCJrZXl3b3JkIiwiZ2V0Iiwic3RtdCIsInN0YXRlbWVudHMiLCJlbmNsb3NpbmdDbGFzcyIsInN1cGVyY2xhc3MiLCJtZXRob2RzIiwiZGVjbGFyYXRpb24iLCJyZXNvbHZlRnVuY3Rpb24iLCJjb25kaXRpb24iLCJ0aGVuQnJhbmNoIiwiZWxzZUJyYW5jaCIsImluaXRpYWxpemVyIl0sIm1hcHBpbmdzIjoiNlVBQUEsOEIsSUFBWUEsSTtBQUNaLDhCLElBQVlDLEk7QUFDWix3QyxJQUFZQyxTO0FBQ1o7QUFDQSxnQztBQUNBLDhCO0FBQ0Esa0M7QUFDQSw4Qzs7QUFFQSxJQUFNQyxlQUFlO0FBQ2pCQyxVQUFNLE1BRFc7QUFFakJDLGNBQVUsVUFG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S0YsT0FBNUI7QUFDSSxnRUFESjtBQUVIO0FBQ0QscUJBQUt2QixPQUFMLENBQWF5QixLQUFLVixLQUFsQjtBQUNIO0FBQ0osUzs7QUFFWVUsWSxFQUFNO0FBQ2YsaUJBQUszQixPQUFMLENBQWEyQixLQUFLbkIsSUFBbEI7QUFDQSxnQkFBSW1CLEtBQUtVLFdBQUwsSUFBb0IsSUFBeEIsRUFBOEI7QUFDMUIscUJBQUtuQyxPQUFMLENBQWF5QixLQUFLVSxXQUFsQjtBQUNIO0FBQ0QsaUJBQUtwQyxNQUFMLENBQVkwQixLQUFLbkIsSUFBakI7QUFDSCxTOztBQUVjbUIsWSxFQUFNO0FBQ2pCLGlCQUFLekIsT0FBTCxDQUFheUIsS0FBS08sU0FBbEI7QUFDQSxpQkFBS2hDLE9BQUwsQ0FBYXlCLEtBQUt4QixJQUFsQjtBQUNILFMsMkNBdE9nQm5CLFEiLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL2V4cHJcIjtcbmltcG9ydCAqIGFzIFN0bXQgZnJvbSBcIi4vc3RtdFwiO1xuaW1wb3J0ICogYXMgVG9rZW5UeXBlIGZyb20gJy4vdG9rZW5UeXBlJztcbmltcG9ydCB7UGFyc2VFcnJvciwgUmV0dXJucywgUnVudGltZUVycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCBUb2tlbiBmcm9tICcuL3Rva2VuJztcbmltcG9ydCBCdW5hIGZyb20gJy4vYnVuYSc7XG5pbXBvcnQgSGFzaE1hcCBmcm9tICdoYXNobWFwJztcbmltcG9ydCB7QnVuYUZ1bmN0aW9uLCBEZWZhdWx0QnVuYUZ1bmN0aW9ufSBmcm9tICcuL2J1bmFGdW5jdGlvbic7XG5cbmNvbnN0IEZ1bmN0aW9uVHlwZSA9IHtcbiAgICBOT05FOiBcIk5PTkVcIixcbiAgICBGVU5DVElPTjogXCJGVU5DVElPTlwiLFxuICAgIElOSVRJQUxJWkVSOiBcIklOSVRJQUxJWkVSXCIsXG4gICAgTUVUSE9EOiBcIk1FVEhPRFwiXG59O1xuXG5jb25zdCBDbGFzc1R5cGUgPSB7XG4gICAgTk9ORTogXCJOT05FXCIsXG4gICAgQ0xBU1M6IFwiQ0xBU1NcIixcbiAgICBTVUJDTEFTUzogXCJTVUJDTEFTU1wiXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvbHZlciB7XG4gICAgY29uc3RydWN0b3IoaW50ZXJwcmV0ZXIpIHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlciA9IGludGVycHJldGVyO1xuICAgICAgICB0aGlzLnNjb3BlcyA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRGdW5jdGlvbiA9IEZ1bmN0aW9uVHlwZS5OT05FO1xuICAgICAgICB0aGlzLmN1cnJlbnRDbGFzcyA9IENsYXNzVHlwZS5OT05FO1xuICAgIH1cblxuICAgIHJlc29sdmUoc3RhdGVtZW50c19vcl9zdGF0ZW1lbnRfb3JfZXhwcmVzc2lvbikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzdGF0ZW1lbnRzX29yX3N0YXRlbWVudF9vcl9leHByZXNzaW9uKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZW1lbnRzX29yX3N0YXRlbWVudF9vcl9leHByZXNzaW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50c19vcl9zdGF0ZW1lbnRfb3JfZXhwcmVzc2lvbltpXS5hY2NlcHQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnRzX29yX3N0YXRlbWVudF9vcl9leHByZXNzaW9uLmFjY2VwdCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc29sdmVGdW5jdGlvbihmdW5jdGlvbjEsIHR5cGUpIHtcbiAgICAgICAgbGV0IGVuY2xvc2luZ0Z1bmN0aW9uID0gdGhpcy5jdXJyZW50RnVuY3Rpb247XG4gICAgICAgIHRoaXMuY3VycmVudEZ1bmN0aW9uID0gdHlwZTtcbiAgICAgICAgdGhpcy5iZWdpblNjb3BlKCk7XG4gICAgICAgIGlmIChmdW5jdGlvbjEucGFyYW1zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZ1bmN0aW9uMS5wYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmUoZnVuY3Rpb24xLnBhcmFtc1tpXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZpbmUoZnVuY3Rpb24xLnBhcmFtc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNvbHZlKGZ1bmN0aW9uMS5ib2R5KTtcbiAgICAgICAgdGhpcy5lbmRTY29wZSgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRGdW5jdGlvbiA9IGVuY2xvc2luZ0Z1bmN0aW9uO1xuICAgIH1cblxuICAgIGJlZ2luU2NvcGUoKSB7XG4gICAgICAgIHRoaXMuc2NvcGVzLnB1c2gobmV3IEhhc2hNYXAoKSk7XG4gICAgfVxuXG4gICAgZW5kU2NvcGUoKSB7XG4gICAgICAgIHRoaXMuc2NvcGVzLnBvcCgpO1xuICAgIH1cblxuICAgIGRlY2xhcmUobmFtZSkge1xuICAgICAgICBpZiAodGhpcy5zY29wZXMubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgICAgICBsZXQgc2NvcGUgPSB0aGlzLnNjb3Blc1t0aGlzLnNjb3Blcy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKHNjb3BlLmhhcyhuYW1lLmxleGVtZSkpIHtcbiAgICAgICAgICAgIEJ1bmEuZ2V0SW5zdGFuY2UoKS5lcnIobmFtZSxcbiAgICAgICAgICAgICAgICBcIlZhcmlhYmxlIHdpdGggdGhpcyBuYW1lIGFscmVhZHkgZGVsY2FyZWQgaW4gdGhpcyBzY29wZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgc2NvcGUuc2V0KG5hbWUubGV4ZW1lLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZGVmaW5lKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNjb3BlID0gdGhpcy5zY29wZXNbdGhpcy5zY29wZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHNjb3BlLnNldChuYW1lLmxleGVtZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZUxvY2FsKGV4cHIsIG5hbWUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuc2NvcGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoIW5hbWUpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc2NvcGVzW2ldLmhhcyhuYW1lLmxleGVtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVycHJldGVyLnJlc29sdmUoZXhwciwgdGhpcy5zY29wZXMubGVuZ3RoIC0gMSAtIGkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBOb3QgZm91bmQuIEFzc3VtZSBpdCBpcyBnbG9iYWwuXG4gICAgfVxuXG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHIpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKGV4cHIudmFsdWUpO1xuICAgICAgICB0aGlzLnJlc29sdmVMb2NhbChleHByLCBleHByLm5hbWUpO1xuICAgIH1cblxuICAgIHZpc2l0QmluYXJ5RXhwcihleHByKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZShleHByLmxlZnQpO1xuICAgICAgICB0aGlzLnJlc29sdmUoZXhwci5yaWdodCk7XG4gICAgfVxuXG4gICAgdmlzaXRDYWxsRXhwcihleHByKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZShleHByLmNhbGxlZSk7XG4gICAgICAgIGlmIChleHByLmFyZ3MpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwci5hcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlKGV4cHIuYXJnc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdEdldEV4cHIoZXhwcikge1xuICAgICAgICB0aGlzLnJlc29sdmUoZXhwci5vYmplY3QpO1xuICAgIH1cblxuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHIpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKGV4cHIuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcikge1xuICAgICAgICB0aGlzLnJlc29sdmUoZXhwci5sZWZ0KTtcbiAgICAgICAgdGhpcy5yZXNvbHZlKGV4cHIucmlnaHQpO1xuICAgIH1cblxuICAgIHZpc2l0TXNnRXhwcihleHByKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZUxvY2FsKGV4cHIsIGV4cHIua2V5d29yZCk7XG4gICAgfVxuXG4gICAgdmlzaXRTZXRFeHByKGV4cHIpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKGV4cHIub2JqZWN0KTtcbiAgICAgICAgdGhpcy5yZXNvbHZlKGV4cHIudmFsdWUpO1xuICAgIH1cblxuICAgIHZpc2l0U3VwZXJFeHByKGV4cHIpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENsYXNzID09IENsYXNzVHlwZS5OT05FKSB7XG4gICAgICAgICAgICBCdW5hLmdldEluc3RhbmNlKCkuZXJyKGV4cHIua2V5d29yZCxcbiAgICAgICAgICAgICAgICBcIkNhbm5vdCB1c2UgJ3N1cGVyJyBvdXRzaWRlIG9mIGEgY2xhc3MuXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudENsYXNzICE9IENsYXNzVHlwZS5TVUJDTEFTUykge1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLmVycihleHByLmtleXdvcmQsXG4gICAgICAgICAgICAgICAgXCJDYW5ub3QgdXNlICdzdXBlcicgaW4gYSBjbGFzcyB3aXRoIG5vIHN1cGVyY2xhc3MuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzb2x2ZUxvY2FsKGV4cHIsIGV4cHIua2V5d29yZCk7XG4gICAgfVxuXG4gICAgdmlzaXRUaGlzRXhwcihleHByKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDbGFzcyA9PSBDbGFzc1R5cGUuTk9ORSkge1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLmVycihleHByLmtleXdvcmQsXG4gICAgICAgICAgICAgICAgXCJDYW5ub3QgdXNlICd0aGlzJyBvdXRzaWRlIG9mIGEgY2xhc3MuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzb2x2ZUxvY2FsKGV4cHIsIGV4cHIua2V5d29yZCk7XG4gICAgfVxuXG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcikge1xuICAgICAgICB0aGlzLnJlc29sdmUoZXhwci5yaWdodCk7XG4gICAgfVxuXG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcikge1xuICAgICAgICBpZiAoISh0aGlzLnNjb3Blcy5sZW5ndGggPT0gMCkgJiZcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW3RoaXMuc2NvcGVzLmxlbmd0aCAtIDFdLmdldChleHByLm5hbWUubGV4ZW1lKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLmVycihleHByLm5hbWUsXG4gICAgICAgICAgICAgICAgXCJDYW5ub3QgcmVhZCBsb2NhbCB2YXJpYWJsZSBpbiBpdHMgb3duIGluaXRpYWxpemVyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzb2x2ZUxvY2FsKGV4cHIsIGV4cHIubmFtZSk7XG4gICAgfVxuXG4gICAgdmlzaXRCbG9ja1N0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmJlZ2luU2NvcGUoKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQuc3RhdGVtZW50cyk7XG4gICAgICAgIHRoaXMuZW5kU2NvcGUoKTtcbiAgICB9XG5cbiAgICB2aXNpdENsYXNzU3RtdChzdG10KSB7XG4gICAgICAgIGxldCBlbmNsb3NpbmdDbGFzcyA9IHRoaXMuY3VycmVudENsYXNzO1xuICAgICAgICB0aGlzLmN1cnJlbnRDbGFzcyA9IENsYXNzVHlwZS5DTEFTUztcbiAgICAgICAgdGhpcy5kZWNsYXJlKHN0bXQubmFtZSk7XG4gICAgICAgIGlmIChzdG10LnN1cGVyY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2xhc3MgPSBDbGFzc1R5cGUuU1VCQ0xBU1M7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUoc3RtdC5zdXBlcmNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlZmluZShzdG10Lm5hbWUpO1xuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYmVnaW5TY29wZSgpO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNbdGhpcy5zY29wZXMubGVuZ3RoIC0gMV0uc2V0KFwic3VwZXJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iZWdpblNjb3BlKCk7XG4gICAgICAgIHRoaXMuc2NvcGVzW3RoaXMuc2NvcGVzLmxlbmd0aCAtIDFdLnNldChcInRoaXNcIiwgdHJ1ZSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RtdC5tZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGVjbGFyYXRpb24gPSBGdW5jdGlvblR5cGUuTUVUSE9EO1xuICAgICAgICAgICAgaWYgKHN0bXQubWV0aG9kc1tpXS5uYW1lLmxleGVtZSA9PSBcImluaXRcIikge1xuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uID0gRnVuY3Rpb25UeXBlLklOSVRJQUxJWkVSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlRnVuY3Rpb24oc3RtdC5tZXRob2RzW2ldLCBkZWNsYXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmRTY29wZSgpO1xuICAgICAgICBpZiAoc3RtdC5zdXBlcmNsYXNzICE9IG51bGwpIHRoaXMuZW5kU2NvcGUoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q2xhc3MgPSBlbmNsb3NpbmdDbGFzcztcbiAgICB9XG5cbiAgICB2aXNpdEV4cHJlc3Npb25TdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQuZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgdmlzaXRGdW5jdGlvblN0bXQoc3RtdCkge1xuICAgICAgICB0aGlzLmRlY2xhcmUoc3RtdC5uYW1lKTtcbiAgICAgICAgdGhpcy5kZWZpbmUoc3RtdC5uYW1lKTtcblxuICAgICAgICB0aGlzLnJlc29sdmVGdW5jdGlvbihzdG10LCBGdW5jdGlvblR5cGUuRlVOQ1RJT04pO1xuICAgIH1cblxuICAgIHZpc2l0SWZTdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQuY29uZGl0aW9uKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQudGhlbkJyYW5jaCk7XG4gICAgICAgIGlmIChzdG10LmVsc2VCcmFuY2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQuZWxzZUJyYW5jaCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdFByaW50U3RtdChzdG10KSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZShzdG10LmV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIHZpc2l0UmV0dXJuU3RtdChzdG10KSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRGdW5jdGlvbiA9PSBGdW5jdGlvblR5cGUuTk9ORSkge1xuICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLmVycihzdG10LmtleXdvcmQsIFwiQ2Fubm90IHJldHVybiBmcm9tIHRvcC1sZXZlbCBjb2RlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RtdC52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RnVuY3Rpb24gPT0gRnVuY3Rpb25UeXBlLklOSVRJQUxJWkVSKSB7XG4gICAgICAgICAgICAgICAgQnVuYS5nZXRJbnN0YW5jZSgpLmVycihzdG10LmtleXdvcmQsXG4gICAgICAgICAgICAgICAgICAgIFwiQ2Fubm90IHJldHVybiBhIHZhbHVlIGZyb20gYW4gaW5pdGlhbGl6ZXIuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRWYXJTdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5kZWNsYXJlKHN0bXQubmFtZSk7XG4gICAgICAgIGlmIChzdG10LmluaXRpYWxpemVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZShzdG10LmluaXRpYWxpemVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlZmluZShzdG10Lm5hbWUpO1xuICAgIH1cblxuICAgIHZpc2l0V2hpbGVTdG10KHN0bXQpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQuY29uZGl0aW9uKTtcbiAgICAgICAgdGhpcy5yZXNvbHZlKHN0bXQuYm9keSk7XG4gICAgfVxufSJdfQ==