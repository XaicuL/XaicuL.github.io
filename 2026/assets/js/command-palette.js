function openCommandPalette() {
    document.getElementById('cmdPalette').classList.add('show');
    document.getElementById('cmdInput').focus();
}

function closeCommandPalette(event) {
    if (event && event.target !== document.getElementById('cmdPalette')) return;
    document.getElementById('cmdPalette').classList.remove('show');
    document.getElementById('cmdInput').value = '';
    filterCommands();
}

function filterCommands() {
    const query = document.getElementById('cmdInput').value.toLowerCase();
    document.querySelectorAll('.cmd-item').forEach(item => {
        const label = item.querySelector('.cmd-item-label').textContent.toLowerCase();
        item.style.display = label.includes(query) ? 'flex' : 'none';
    });
}
