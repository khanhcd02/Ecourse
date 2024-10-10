document.oncontextmenu = function() {
    return false;
};

document.addEventListener('keydown', function(e) {
    // Ctrl + S (Save)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
    }
    // Ctrl + U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
    // Ctrl + Shift + I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
    }
    // F12 (Developer Tools)
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Ctrl + C (Copy)
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
    }
    // Ctrl + P (Print)
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
    }
    // Ctrl + X (Cut)
    if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
    }
    // Ctrl + A (Select all)
    if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
    }
});
