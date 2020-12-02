const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.static(__dirname + '/css'));

const getExpenses = (q) => {
    const total = 2020;

    return new Promise((resolve, reject) => {
        fs.readFile('expenses.txt', 'utf8', (err, data) => {
            if (err) throw err;

            const expenses = data.split('\n').map(e => Number(e));

            for (const x in expenses) {
                const a = expenses[x];
                let b;
                let c;

                for (const y in expenses) {
                    b = expenses[y];

                    if (q === 2 && a + b === total) {
                        break;
                    }

                    if (q === 3) {
                        for (const z in expenses) {
                            c = expenses[z];

                            if (a + b + c === total) break;
                        }

                        if (a + b + c === total) break;
                    }
                }

                if (a + b === total && q === 2) {
                    resolve({ a, b });

                    break;
                }

                if (a + b + c === total && q === 3) {
                    resolve({ a, b, c });

                    break;
                }
            }
        });
    });
}

app.get('/', (req, res) => {
    getExpenses(2)
        .then((data) => {
            const { a, b } = data;

            return {
                a,
                b,
                answer: a * b
            }
        })
        .then((answerOne) => {
            getExpenses(3)
                .then((data) => {
                    const { a, b, c } = data;
                    const answerTwo = {
                        a,
                        b,
                        c,
                        answer: a * b * c
                    }

                    return { answerOne, answerTwo };
                })
                .then((data) => res.render('index', data))
        })
        .catch(function (error) {
            res.status(500, {
                error
            });
        });;
});

app.listen(port, () => {
    console.log(`Elves Listening at http://localhost:${port}`)
});
