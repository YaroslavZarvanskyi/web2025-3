const { program } = require('commander');
const fs = require('fs');

program
    .requiredOption('-i, --input <type>', 'Path to input file')
    .option('-o, --output <type>', 'Path to output file')
    .option('-d, --display', 'Display result in console');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
    console.error('Please, specify input file');
    process.exit(1);
}

try {
    const data = fs.readFileSync(options.input, 'utf8');
    const jsonData = JSON.parse(data);

    const result = {};

    jsonData.forEach(item => {
        if (item.category === 'Доходи, усього' || item.category === 'Витрати, усього') {
            result[item.category] = item.value;
        }
    });

    const output = Object.entries(result)
        .map(([category, value]) => `${category}:${value}`)
        .join('\n');

    if (options.output) {
        fs.writeFileSync(options.output, output);
    }

    if (options.display) {
        console.log(output);
    }

    if (!options.output && !options.display) {
        // Нічого не виводимо
    }

} catch (error) {
    if (error.code === 'ENOENT') {
        console.error('Cannot find input file');
    } else {
        console.error('An error occurred:', error);
    }
    process.exit(1);
}