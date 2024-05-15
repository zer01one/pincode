window.onload = () => {
    Pincode.init(document.querySelectorAll('.pin-input'), (maxlength, value) => {
        console.log('Pin code filled', maxlength, value);

        $('#status-value strong').text(value);
        $('#status-ready')[value.length === maxlength ? 'show' : 'hide']();
    });
}