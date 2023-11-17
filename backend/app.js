const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
// import  {inputs}  from './inputs.js';
const {getInputs} = require('./inputs.js');
const app = express();
app.use(cors());
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/run-command',async (req, res) => {
    const index = req.query.index;

    // Security Check: Validate and Sanitize the input
    if (!index) {
        return res.status(400).send('No index provided');
    }
    // Get Input
    const inputs = await getInputs();
    const input = inputs[Number(index)]; 

    // Save input to file
    fs.writeFileSync('./helloworld/inputs/nn_mnist.in', input);
    // console.log(input);

    exec("cd ./helloworld && leo run main", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error: ${error.message}`);
        }

        const str = "Leo ✅ Compiled 'main.leo' into Aleo instructions ⛓ Constraints • 'nn_mnist.aleo/main' - 975,700 constraints (called 1 time) ➡️ Output • [ 0i32, 2757159i32, 0i32, 0i32, 0i32, 0i32, 0i32, 0i32, 389267i32, 0i32 ] Leo ✅ Finished 'nn_mnist.aleo/main' (in \"/Users/bilginkocak/leo-examples/aleo-project/backend/helloworld/build\")";

        // Regular expression to match the array pattern
        const regex = /\[\s*((\d+)i32,?\s*)+\]/;

        // Find the array in the string
        const match = stdout.toString().match(regex);
        let result;

        if (match) {
            // Extract the array string
            const arrayStr = match[0];

            // Remove the brackets and 'i32', then split the string into an array
            const arrayData = arrayStr.match(/\d+/g).map(item => parseInt(item, 10));
            result = arrayData.filter((v, i) => i % 2 === 0)
            console.log(result);
        } else {
            console.error('Array not found in the string.');
        }

        res.send({
            stdout: stdout,
            result: result,
            stderr: stderr
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
