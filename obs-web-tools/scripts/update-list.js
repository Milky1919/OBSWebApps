const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '../apps');
const outputFile = path.join(__dirname, '../global-manifest.json');

function getDirectories(source) {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

function updateList() {
    if (!fs.existsSync(appsDir)) {
        console.error('Apps directory not found:', appsDir);
        process.exit(1);
    }

    const appDirs = getDirectories(appsDir);
    const manifest = [];

    appDirs.forEach(dir => {
        const metaPath = path.join(appsDir, dir, 'meta.json');
        if (fs.existsSync(metaPath)) {
            try {
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                // Validate required fields if necessary
                if (meta.id && meta.name) {
                    // Ensure path is relative to root if not specified or fix up
                    if (!meta.path) {
                        meta.path = `./apps/${dir}/index.html`;
                    }
                    manifest.push(meta);
                    console.log(`Added app: ${meta.name} (${dir})`);
                } else {
                    console.warn(`Skipping ${dir}: Missing id or name in meta.json`);
                }
            } catch (e) {
                console.error(`Error reading meta.json in ${dir}:`, e.message);
            }
        } else {
            console.log(`Skipping ${dir}: No meta.json found`);
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
    console.log(`\nSuccessfully generated global-manifest.json with ${manifest.length} apps.`);
}

updateList();
