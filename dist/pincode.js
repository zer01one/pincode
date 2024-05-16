; (function (name, definition) {
    if (typeof module !== 'undefined') module.exports = definition();
    else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[name] = definition();
}('Pincode', function () {
    function init(inputs, enters, regexps) {
        (function (inputs, regexps) {
            // console.log('regexps', regexps);
            inputs.forEach((input, index, array) => {
                input.oninput = function (e) {
                    write(e.target, excludeTextByRegExp(e.target.value, regexps[index]));
                    enters?.(size(array), value(array));
                    isFilled(input) && (focusing(array[index + 1]), bluring(input));
                };

                input.onclick = input.onfocus = function (e) {
                    insideFocusEnd(e.target);
                };

                input.onkeyup = function (e) {
                    applyControllers(e.key, e.target, array, index);
                };

                input.onpaste = function (e) {
                    e.preventDefault();
                    getSchemeCharsByInputs(e.clipboardData.getData('text').split(''), array, regexps).forEach((value, index) => write(array[index], value));
                    enters?.(size(array), value(array));
                    updateFocus(array);
                };
            });

            updateFocus(inputs);
        })(Array.from(inputs), fillRegExpScheme(inputs.length, typifyRegExpArg(regexps, inputs.length)));
    }

    function applyControllers(key, input, inputs, index) {
        switch (key) {
            case 'ArrowLeft': return focusing(inputs[index - 1]);
            case 'ArrowRight': return focusing(inputs[index + 1]);
            case 'Backspace': return isEmpty(input, -1) && focusing(inputs[index - 1]);
        }
    }

    function insideFocusEnd(input) {
        input.setSelectionRange(input.value.length, input.value.length);
    }

    function updateFocus(inputs) {
        getClosestNotFilledInputIndex(inputs) !== -1 ? inputs[getClosestNotFilledInputIndex(inputs)]?.focus?.() : inputs.forEach(input => input?.blur?.());
    }

    function focusing(input) {
        return input?.focus?.();
    }

    function bluring(input) {
        return input?.blur?.();
    }

    /**
     * Функция собирает значения из всех инпутов.
     *
     * @param {Object[]} inputs - Массив инпутов
     * @return {string} Сконкаченное значение
     */
    function value(inputs) {
        return inputs.reduce((string, input) => string + input.value, '');
    }

    /**
     * Функция определяет максимальную длину пинкода исходя из настроек инпутов.
     *
     * @param {Object[]} inputs - Массив инпутов
     * @return {number} Длина пинкода
     */
    function size(inputs) {
        return inputs.reduce((length, inputs) => length + defineMaxlength(inputs.dataset.maxlength), 0);
    }

    function defineMaxlength(maxlength) {
        return +window.parseInt(maxlength) || 1;
    }

    function defineValEnding(value, maxlength) {
        return value?.slice?.(-(maxlength)) || '';
    }

    function getSchemeCharsByInputs(chars, inputs, regexps) {
        return inputs.map((input, index) => startSpliceCharsByInput(chars, input, regexps[index]));
    }

    function startSpliceCharsByInput(chars, input, regexp) {
        return new Array(defineMaxlength(input.dataset.maxlength)).fill('').map(i => (i = chars.findIndex(char => regexp.test(char)), isNotMinus1(i) ? chars.splice(i, 1) : ''));
    }

    function write(input, val) {
        input.value = defineValEnding(val, defineMaxlength(input.dataset.maxlength));
    }

    function isNotFilled(input) {
        return input.value.length !== defineMaxlength(input.dataset.maxlength);
    }

    function isFilled(input) {
        return input.value.length === defineMaxlength(input.dataset.maxlength);
    }

    function isEmpty(input, modifier = 0) {
        return (window.parseInt(input?.value?.length) || 0) + modifier <= 0;
    }

    function isNotMinus1(num) {
        return num !== -1;
    }

    function getClosestNotFilledInputIndex(inputs) {
        return inputs.findIndex(isNotFilled);
    }

    function getStandardRegExp() {
        return new RegExp('\\d', 'g');
    }

    function typifyRegExpArg(arg, length) {
        return arg instanceof RegExp ? new Array(length).fill(arg) : (Array.isArray(arg) ? arg : []);
    }

    function fillRegExpScheme(length, arr) {
        return new Array(length).fill(undefined).map((i, index) => (arr[index] instanceof RegExp) ? arr[index] : getStandardRegExp());
    }

    function excludeCharsByRegExp(chars, regexp) {
        return chars.filter(char => regexp.test(char));
    }

    function excludeTextByRegExp(text, regexp) {
        return text.match(regexp)?.join('') || '';
    }

    return {
        init
    }
}));