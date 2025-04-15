const { execSync } = require('child_process');

const scripts = [
    'createReads.cjs',
    'createReadsERC20.cjs',
    'createWrites.cjs',
    'createWritesBApps.cjs',
    'createWritesERC20.cjs'
];

console.log('Starting to run all scripts...\n');

for (const script of scripts) {
    console.log(`Running ${script}...`);
    console.log('----------------------------------------');
    try {
        execSync(`node ${__dirname}/${script}`, { stdio: 'inherit' });
        console.log(`✅ ${script} completed successfully\n`);
    } catch (error) {
        console.error(`❌ Error running ${script}`);
        process.exit(1);
    }
}

console.log('All scripts completed successfully! 🎉'); 