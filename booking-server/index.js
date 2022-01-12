const {Spanner} = require('@google-cloud/spanner');
const express = require('express');
const cors = require('cors')({origin: true});

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors);
app.use(express.urlencoded({
    extended: true
}));


const projectId = 'my-project-1529779460443';
const instanceId = 'booking-db';
const databaseId = 'booking';

// Creates a client
const spanner = new Spanner({
  projectId: projectId,
});

// Gets a reference to a Cloud Spanner instance and database
const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

app.post('/booking', (req, res) => {
    database.runTransaction(async (err, transaction) => {
    if (err) {
        console.error(err);
        return;
    }

        const body = req.body;

        //getting next value
        const query = {
            sql: "SELECT next_value FROM sequences WHERE name='booking'",
        };
        let nextValue;
        try {
        const [rows] = await database.run(query);
        rows.forEach(row => {
            const json = row.toJSON();
            nextValue = json.next_value;
        });
        } catch (err) {
            console.error('ERROR Getting seq value:', err);
            res.json({status:400});
        } 

        //insert on booking
        try {
            await transaction.runUpdate({
                sql: 'INSERT booking (bookingId, bookDate, ShardId, flightId) VALUES (@bookingId, @bookDate, @ShardId, @flightId)',
                params: {
                    bookingId: nextValue,
                    bookDate: body.bookDate,
                    ShardId: (nextValue*body.flightId)%3,
                    flightId: body.flightId
                },
            });
        } catch (err) {
            console.error('ERROR adding new booking register:', err);
            await transaction.rollback();
            res.json({status:400});
        }

        //insert on bookingDetail
        try {
            await transaction.runUpdate({
                sql: 'INSERT bookingdetails (bookingId, passId) VALUES (@bookingId, @passId)',
                params: {
                    bookingId: nextValue,
                    passId: body.passId
                },
            });
            nextValue++;
        } catch (err) {
            console.error('ERROR adding new bookingDetails register:', err);
            await transaction.rollback();
            res.json({status:400});
        }
        
        //update sequence
        try {
            await transaction.runUpdate({
              sql: `UPDATE sequences SET next_value = @nextValue
                WHERE name='booking'`,
                params: {
                    nextValue: nextValue
                },
            });

            await transaction.commit();
            res.json({status:200});
          } catch (err) {
            console.error('ERROR setting next value:', err);
            await transaction.rollback();
            res.json({status:400});
          }

    });
});

app.post('/passenger', (req, res) => {
    database.runTransaction(async (err, transaction) => {
    if (err) {
        console.error(err);
        return;
    }

        const body = req.body;

        //getting next value
        const query = {
            sql: "SELECT next_value FROM sequences WHERE name='passenger'",
        };
        let nextValue;
        try {
        const [rows] = await database.run(query);
        rows.forEach(row => {
            const json = row.toJSON();
            nextValue = json.next_value;
        });
        } catch (err) {
            console.error('ERROR Getting seq value:', err);
            await transaction.rollback();
            res.json({status:400});
        } 

        //insert on passenger
        try {
            await transaction.runUpdate({
                sql: 'INSERT passenger (passId, passName, passMail, passDob) VALUES (@passId, @passName, @passMail, @passDob)',
                params: {
                    passId: nextValue,
                    passName: body.passName,
                    passMail: body.passMail,
                    passDob: body.passDob
                },
            });
            nextValue++;
        } catch (err) {
            console.error('ERROR adding new passenger register:', err);
            await transaction.rollback();
            res.json({status:400});
        }
        
        //update sequence
        try {
            await transaction.runUpdate({
              sql: `UPDATE sequences SET next_value = @nextValue
                WHERE name='passenger'`,
                params: {
                    nextValue: nextValue
                },
            });

            await transaction.commit();
            res.json({status:200});
          } catch (err) {
            console.error('ERROR setting next value:', err);
            await transaction.rollback();
            res.json({status:400});
          }

    });
});

app.post('/flight', (req, res) => {
    database.runTransaction(async (err, transaction) => {
    if (err) {
        console.error(err);
        return;
    }

        const body = req.body;

        //getting next value
        const query = {
            sql: "SELECT next_value FROM sequences WHERE name='flight'",
        };
        let nextValue;
        try {
        const [rows] = await database.run(query);
        rows.forEach(row => {
            const json = row.toJSON();
            nextValue = json.next_value;
        });
        } catch (err) {
            console.error('ERROR Getting seq value:', err);
            await transaction.rollback();
            res.json({status:400});
        } 

        //insert on flight
        try {
            await transaction.runUpdate({
                sql: 'INSERT flight (flightId, flightSource, flightDest, flightDate, flightSeat, ticketCost) VALUES (@flightId, @flightSource, @flightDest, @flightDate, @flightSeat,@ticketCost)',
                params: {
                    flightId: nextValue,
                    flightSource: body.flightSource,
                    flightDest: body.flightDest,
                    flightDate: body.flightDate,
                    flightSeat: body.flightSeat,
                    ticketCost: body.ticketCost
                },
            });
            nextValue++;
        } catch (err) {
            console.error('ERROR adding new flight register:', err);
            await transaction.rollback();
            res.json({status:400});
        }
        
        //update sequence
        try {
            await transaction.runUpdate({
              sql: `UPDATE sequences SET next_value = @nextValue
                WHERE name='flight'`,
                params: {
                    nextValue: nextValue
                },
            });

            await transaction.commit();
            res.json({status:200});
          } catch (err) {
            console.error('ERROR setting next value:', err);
            await transaction.rollback();
            res.json({status:400});
          }

    });
});

app.put('/flight/:id', (req, res) => {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }
        const body = req.body;

        //update  flight
        try {
            await transaction.runUpdate({
                sql: `UPDATE flight SET flightSource = @flightSource , flightDest = @flightDest , flightSeat = @flightSeat , ticketCost = @ticketCost
                WHERE flightId= @flightId`, 
                params: {
                    flightSource: body.flightSource,
                    flightDest: body.flightDest,
                    flightSeat: body.flightSeat,
                    ticketCost: body.ticketCost,
                    flightId: parseInt(req.params.id)
                },
            });
            await transaction.commit();
            res.json({status:200});
        } catch (err) {
            console.error('ERROR updating flight register:', err);
            await transaction.rollback();
            res.json({status:400});
        }
    });
});

app.delete('/flight/:id', (req, res) => {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }

        //delete flight
        try {
            await transaction.runUpdate({
                sql: `DELETE FROM flight 
                WHERE flightId= @flightId`, 
                params: {
                    flightId: parseInt(req.params.id)
                },
            });
            await transaction.commit();
            res.json({status:200});
        } catch (err) {
            console.error('ERROR deleting flight register:', err);
            await transaction.rollback();
            res.json({status:400});
        }
    });
});

app.get('/flight/:id', (req, res) => {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }

        try {
            let data;
            const [rows] = await database.run({
                sql: `SELECT * FROM flight 
                WHERE flightId= @flightId`, 
                params: {
                    flightId: parseInt(req.params.id)
                },
            });
            rows.forEach(row => {
                data = row.toJSON();
            });
            res.json({
                status:200,
                data: data
            })
        } catch (err) {
            console.error('ERROR Getting seq value:', err);
            res.json({status:400});
        } 

    });
});

app.get('/flight/', (req, res) => {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }

        let flights = [];

        const query = {
            sql: "SELECT * FROM flight limit 100",
        };

        try {
        const [rows] = await database.run(query);

        const flights = rows.reduce((flights,row) =>{
            const flight = row.toJSON();
            return [...flights,flight]
        },[]);

        res.json({
            status:200,
            flights: flights
        });

        } catch (err) {
            console.error('ERROR Getting seq value:', err);
            await transaction.rollback();
            res.json({status:400});
        } 

    });
});

app.get('/flight/:id/reserved', (req, res) => {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }

        try {
            let isReserverd = false;
            const [rows] = await database.run({
                sql: `SELECT * FROM booking 
                WHERE flightId = @flightId`, 
                params: {
                    flightId: parseInt(req.params.id)
                },
            });

            if(rows && rows.length>0){
                
                isReserverd = true;
            }
            res.json({
                status:200,
                reserved: isReserverd
            })
        } catch (err) {
            console.error('ERROR Getting seq value:', err);
            res.json({status:400});
        } 

    });
});



app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 
