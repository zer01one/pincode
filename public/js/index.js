window.onload = () => {

    Pincode.init(document.querySelectorAll('.pin-input'), (code) => {
        console.log('Pin code filled', code);
    });
}