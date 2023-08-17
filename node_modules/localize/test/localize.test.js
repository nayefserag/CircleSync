var Localize = require('../lib/localize');

module.exports = {
    'test empty initialization error': function(assert) {
        assert.expect(1);
        assert.throws(function() {
            var badLocalize = new Localize();
            badLocalize.will.never.be.run.here();
        }, function(err) {
            if(err instanceof Error &&
                err.message === "Must provide a valid set of translations.") {
                return true;
            }
            return false;
        });
        assert.done();
    },
    'test bad translations var error': function(assert) {
        assert.expect(1);
        assert.throws(function() {
            var badLocalize = new Localize([1,2,3]);
            badLocalize.will.never.be.run.here();
        }, function(err) {
            if(err instanceof Error &&
                err.message === "Must provide a valid set of translations.") {
                return true;
            }
            return false;
        });
        assert.done();
    },
    'test bad translations path error': function(assert) {
        assert.expect(1);
        assert.throws(function() {
            var badLocalize = new Localize("/nowheresville");
            badLocalize.will.never.be.run.here();
        }, function(err) {
            if(err instanceof Error &&
                err.message === "Translation Path Invalid") {
                return true;
            }
            return false;
        });
        assert.done();
    },
    'test good translations var': function(assert) {
        assert.expect(1);
        assert.doesNotThrow(function() {
            var goodLocalize = new Localize({
                "Testing...": {
                    "es": "Pruebas..."
                }
            });
            return goodLocalize;
        });
        assert.done();
    },
    'test good translations path': function(assert) {
        assert.expect(1);
        assert.doesNotThrow(function() {
            var goodLocalize = new Localize("./test/translations");
            return goodLocalize;
        });
        assert.done();
    },
    'test bad setLocale var': function(assert) {
        assert.expect(1);
        assert.throws(function() {
            var goodLocalize = new Localize("./test/translations");
            goodLocalize.setLocale(23);
        }, function(err) {
            if(err instanceof Error &&
                err.message === "Locale must be a string") {
                return true;
            }
            return false;
        });
        assert.done();
    },
    'test good setLocale var': function(assert) {
        assert.expect(1);
        assert.doesNotThrow(function() {
            var goodLocalize = new Localize("./test/translations");
            goodLocalize.setLocale("es");
        });
        assert.done();
    },
    'test bad translate string': function(assert) {
        assert.expect(1);
        assert.throws(function() {
            var goodLocalize = new Localize("./test/translations");
            goodLocalize.setLocale("es");
            goodLocalize.translate("Test2");
        }, function(err) {
            if(err instanceof Error &&
                err.message === "Could not find translation for 'Test2' in the es locale") {
                return true;
            }
            return false;
        });
        assert.done();
    },
    'test good translate string': function(assert) {
        assert.expect(2);
        assert.doesNotThrow(function() {
            var goodLocalize = new Localize("./test/translations");
            goodLocalize.setLocale("es");
            assert.strictEqual(goodLocalize.translate("Testing..."), "Pruebas...");
        });
        assert.done();
    },
    'test good translate nop': function(assert) {
        assert.expect(1);
        var goodLocalize = new Localize("./test/translations");
        assert.strictEqual(goodLocalize.translate("Testing..."), "Testing...");
        assert.done();
    },
    'test good translate substitution': function(assert) {
        assert.expect(2);
        var goodLocalize = new Localize("./test/translations");
        assert.strictEqual(goodLocalize.translate("Substitution: $[1]", 5), "Substitution: 5");
        goodLocalize.setLocale("es");
        assert.strictEqual(goodLocalize.translate("Substitution: $[1]", 5), "Sustitución: 5");
        assert.done();
    },
    'test good translate multiple substitution': function(assert) {
        assert.expect(2);
        var goodLocalize = new Localize("./test/translations");
        assert.strictEqual(goodLocalize.translate("Multiple substitution: $[1], $[2]", 5, 25), "Multiple substitution: 5, 25");
        goodLocalize.setLocale("es");
        assert.strictEqual(goodLocalize.translate("Multiple substitution: $[1], $[2]", 5, 25), "Sustitución múltiple: 5, 25");
        assert.done();
    },
    'test bad dateFormat var initialization': function(assert) {
        assert.expect(1);
        assert.doesNotThrow(function() {
            var goodLocalize = new Localize("./test/translations", 25);
            return goodLocalize;
        });
        assert.done();
    },
    'test bad dateFormat var post-initialization': function(assert) {
        assert.expect(1);
        assert.throws(function() {
            var badLocalize = new Localize("./test/translations", 25);
            badLocalize.loadDateFormats(25);
        }, function(err) {
            if(err instanceof Error &&
                err.message === "Invalid Date Format provided") {
                return true;
            }
            return false;
        });
        assert.done();
    },
    'test good dateFormat var post-initialization': function(assert) {
        assert.expect(1);
        assert.doesNotThrow(function() {
            var goodLocalize = new Localize("./test/translations");
            goodLocalize.loadDateFormats({
                "es": {
                    dayNames: [
                        'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb',
                        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
                    ],
                    monthNames: [
                        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
                        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ],
                    masks: {
                        "default": "dddd, d 'de' mmmm yyyy"
                    }
                }
            });
        });
        assert.done();
    },
    'test good localDate': function(assert) {
        assert.expect(4);
        var theDate = new Date("4-Jul-1776");
        var goodLocalize = new Localize("./test/translations");
        goodLocalize.loadDateFormats({
            "es": {
                dayNames: [
                    'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb',
                    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
                ],
                monthNames: [
                    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ],
                masks: {
                    "default": "dddd, d 'de' mmmm yyyy"
                }
            }
        });
        assert.strictEqual(goodLocalize.localDate(theDate), "Thu Jul 04 1776 00:00:00");
        assert.strictEqual(goodLocalize.localDate(theDate, "fullDate"), "Thursday, July 4, 1776");
        assert.strictEqual(goodLocalize.localDate(theDate, "mm/dd/yyyy"), "07/04/1776");
        goodLocalize.setLocale("es");
        assert.strictEqual(goodLocalize.localDate(theDate), "Jueves, 4 de Julio 1776");
        assert.done();
    },
    'test good missing translation ignore': function(assert) {
        assert.expect(1);
        var goodLocalize = new Localize("./test/translations");
        goodLocalize.throwOnMissingTranslation(false);
        goodLocalize.setLocale("es");
        assert.strictEqual(goodLocalize.translate("Not found"), "Not found");
        assert.done();
    },
    'test translations dir': function(assert) {
        assert.expect(2);
        var goodLocalize = new Localize('./test/translations');
        assert.strictEqual(goodLocalize.translate(goodLocalize.strings.helloWorld), "Hello, World!\n");
        goodLocalize.setLocale("es");
        assert.strictEqual(goodLocalize.translate(goodLocalize.strings.helloWorld), "¡Hola, mundo!\n");
        assert.done();
    }
};
