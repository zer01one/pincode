// TODO: regexp
// TODO: autofocus
// TODO: copypast

; (function (name, definition) {
    if (typeof module !== 'undefined') module.exports = definition();
    else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[name] = definition();
}('Pincode', function () {
    function init(inputs, enters) {
        Array.from(inputs).forEach((input, index, array) => {
            input.oninput = function (e) {
                write(e.target, e.target.value);
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
                getSchemeCharsByInputs(e.clipboardData.getData('text').split(''), array).forEach((value, index) => write(array[index], value));
                enters?.(size(array), value(array));
                updateFocus(array);
            };
        });
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

    function getSchemeCharsByInputs(chars, inputs) {
        return inputs.map(input => startSpliceCharsByInput(chars, input));
    }

    function startSpliceCharsByInput(chars, input) {
        return chars.splice(0, defineMaxlength(input.dataset.maxlength))
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

    function getClosestNotFilledInputIndex(inputs) {
        return inputs.findIndex(isNotFilled);
    }

    return {
        init
    }
}));