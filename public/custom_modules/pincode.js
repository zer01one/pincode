; (function (name, definition) {
    if (typeof module !== 'undefined') module.exports = definition();
    else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[name] = definition();
}('Pincode', function () {
    function init(inputs, enters) {
        inputs.forEach((input, index, a) => {
            input.oninput = function (e) { oninput(e, Array.from(a), index, enters); };

            input.onclick = input.onfocus = function (e) { focusEnd(e.target); };

            input.onkeyup = function (e) { onkeyup(e.target, e.code, Array.from(a), index); };
        });
    }

    function onkeyup(input, code, inputs, index) {
        switch (code) {
            case 'ArrowLeft': return inputs[index - 1]?.focus?.();
            case 'ArrowRight': return inputs[index + 1]?.focus?.();
            case 'Backspace': {
                if (!input.value.length) return inputs[index - 1]?.focus?.();
                break;
            }
        }
    }

    function oninput(e, inputs, index, enters) {
        e.target.value = e.target.value.slice(-(e.target.dataset.maxlength || 1));

        enters?.(size(inputs), value(inputs));

        if (e.target.value.length) inputs[index + 1] ? inputs[index + 1]?.focus?.() : e.target.blur();
    }

    function focusEnd(input) {
        input.setSelectionRange(input.value.length, input.value.length);
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
        return inputs.reduce((length, inputs) => length + (+window.parseInt(inputs.dataset.maxlength) || 1), 0);
    }

    return {
        init
    }
}));