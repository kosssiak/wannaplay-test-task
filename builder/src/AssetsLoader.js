const fs = require('fs');

const MEMES = {
    'png': 'data:image/png;base64,',
    'jpg': 'data:image/jpg;base64,'
}

module.exports = class AssetsLoader {
    constructor() {
        this.path = process.cwd() + '/src';
        this.target = process.cwd() + '/assets';
        this.assets = {};
        this.init();
    }

    init() {
        this.cleanTarget();
        this.createTarget();
        this.readImg(this.path + '/img');
        this.createJSON();
    }

    cleanTarget() {
        fs.rmSync(this.target, { recursive: true, force: true });
    }

    createTarget() {
        try {
            if (!fs.existsSync(this.target)) {
                fs.mkdirSync(this.target);
            } else {
            }
        } catch (err) {
            console.error(err);
        }
    }

    readImg(imgPath, prefix) {
        let json = {};
        const files = fs.readdirSync(imgPath);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const splitString = file.split('.');
            const ext = file.split('.').pop();
            const name = splitString[0];
            let data;

            if (fs.lstatSync(imgPath + '/' + file).isDirectory() && file !== '.DS_Store') {
                this.readImg(imgPath + '/' + file, file);
                continue;
            }

            switch (ext) {
                case 'png':
                case 'jpg':
                    data = MEMES[ext] + fs.readFileSync(imgPath + `/${file}`, { encoding: 'base64' });
                    const key = prefix ? `${prefix}/${name}` : name;
                    json[key] = data;
                    break;
            }
        }

        this.assets = { ...this.assets, ...json };
    }

    createJSON() {
        fs.writeFileSync(this.target + '/file.json', JSON.stringify(this.assets), 'utf8');
    }
}