const fs = require('fs');

function buildFile() {
    const removeString = '<script defer="defer" src="main.js"></script>';
    const js = fs.readFileSync(process.cwd() + '/dist/main.js', { encoding: 'utf8' });
    const html = fs.readFileSync(process.cwd() + '/dist/index.html', { encoding: 'utf8' });
    let buildString = html.substring(0, html.indexOf(removeString));
    buildString = buildString + `<script type="text/javascript">${js}</script></body></html>`;

    if (!fs.existsSync(process.cwd() + '/builds')) {
        fs.mkdirSync(process.cwd() + '/builds');
    }

    fs.writeFileSync(process.cwd() + '/builds/index.html', buildString);
}

buildFile();