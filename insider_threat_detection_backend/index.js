const express = require('express');
const snowflake = require("snowflake-sdk");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const Prediction = require("./models/insiderThreatMode");
const Stats = require("./models/Stats");

const app = express();
app.use(cors());
app.use(express.json());
const port = 1900;
const uri = "mongodb+srv://rkacheri:rohan311299@cluster0.f6mnp1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE
});

connection.connect((err, conn) => {
    if (err) {
        console.log("Cannot Connect Error: " + err.message);
    }
    console.log("Successfully connected to Snowflake.");
    connection_id = conn.getId();
})


// api to get all the data which is predicted to be insider threats from snowflake
app.get('/all-data', (req, res) => {
    connection.execute({
        sqlText: `SELECT * FROM ${process.env.SNOWFLAKE_TABLE} WHERE "predictions" = -1 LIMIT 100`,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Failed to execute statement due to the following error:', err);
                return res.status(500).send('Failed to retrieve data');
            }
            // res.json(rows);
            const insertPromises = rows.map(async (row) => {
                const exists = await Prediction.findOne({ userId: row.USER_ID }); // Adjust field name as necessary
                if (!exists) {
                    const newPrediction = new Prediction({
                        date: new Date(row.date),
                        userId: row.uniq_id, // Adjust field name as necessary
                        user: row.user,
                        role: row.role,
                        prediction: row.predictions,
                    });
                    return newPrediction.save();
                }
            });

            // Wait for all inserts to attempt to complete
            Promise.all(insertPromises)
                .then(() => res.json({ message: 'Data processed and stored successfully.' }))
                .catch(insertErr => {
                    console.error('Failed to insert due to the following error:', insertErr);
                    return res.status(500).send('Failed to store data');
                });
        },
    });
});

// api to send data to the frontend from MongoDB
app.get('/api/predictions', async (req, res) => {
    try {
        const predictions = await Prediction.find(); // Fetch all predictions. Use .find({...}) for specific queries.
        res.json(predictions);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(500).send('Failed to fetch predictions');
    }
});

// api to get the total number of alerts for the statCard component in the frontend, needs to be updated to do it monthly
app.get("/total-number-of-alerts", (req, res) => {
    connection.execute({
        sqlText: `SELECT COUNT(*) FROM ${process.env.SNOWFLAKE_TABLE}`,
        complete: async (err, stmt, rows) => {
            if (err) {
                console.error("Failed to get the total number of alerts: ", err);
                return res.status(500).send("Failed to get the total number of alerts");
            }
            // res.json(rows);
            const totalAlerts = rows[0]['COUNT(*)'];
            try {
                // Update the document with new totalNumberOfAlerts, or create it if it doesn't exist
                // Using findOneAndUpdate with upsert option
                const updatedStats = await Stats.findOneAndUpdate({}, 
                    { totalNumberOfAlerts: totalAlerts }, 
                    { new: true, upsert: true });

                res.json(updatedStats);
            } catch (dbError) {
                console.error("Failed to update MongoDB: ", dbError);
                return res.status(500).send("Failed to update MongoDB");
            }
        }
    })
})

// api to get the number of employees who triggered the alerts for the statCard component in the frontend, needs to be updated to do it monthly
app.get("/total-number-of-employees", (req, res) => {
    connection.execute({
        sqlText:`SELECT COUNT(DISTINCT("user")) FROM ${process.env.SNOWFLAKE_TABLE}`,
        complete: async (err, stmt, rows) => {
            if (err) {
                console.error("Failed to get the total number of users triggering the alert: ", err);
                return res.status(500).send("Failed to get the total number of users triggering the alert");
            }
            const numberOfEmployeesTriggeringAlerts = rows[0]['COUNT(DISTINCT("USER"))'];
            // res.json(rows);
            try {
                // Update the document in MongoDB with the new count, or insert if it doesn't exist
                const updatedStats = await Stats.findOneAndUpdate({}, 
                    { numberOfEmployeesTriggeringAlerts: numberOfEmployeesTriggeringAlerts }, 
                    { new: true, upsert: true, setDefaultsOnInsert: true });

                res.json(updatedStats);
            } catch (dbError) {
                console.error("Failed to update MongoDB: ", dbError);
                return res.status(500).send("Failed to update MongoDB");
            }
        }
    })
})

// api to send data from the stats table on mongodb to the frontend
app.get("/api/stats", async (req, res) => {
    try {
        const stats = await Stats.find();
        res.json(stats);
    } catch (error) {
        console.error("Error fetching stats: ", error);
        res.status(500).send("Failed to fetch stats");
    }
});

// api which updates the assigned to and progress of the prediction from the frontend and stores it in the monogdb database
// app.post('/api/predictions/update', async (req, res) => {
//     const { id, assignedTo } = req.body;
    
//     try {
//         const updatedPrediction = await Prediction.findByIdAndUpdate(
//             id, 
//             { $set: { assignedTo } },
//             { new: true }
//         );
//         if (!updatedPrediction) {
//             return res.status(404).send('Prediction not found');
//         }
//         res.json(updatedPrediction);
//     } catch (error) {
//         console.error('Error updating prediction:', error);
//         res.status(500).send('Failed to update prediction');
//     }
// });

app.post('/api/predictions/update', async (req, res) => {
    const { id, assignedTo, progress } = req.body; // Add progress to the destructured properties
    
    // Create an update object based on what's provided in the request
    let update = {};
    if (assignedTo !== undefined) {
        update.assignedTo = assignedTo;
    }
    if (progress !== undefined) {
        update.progress = progress;
    }
    
    try {
        if (Object.keys(update).length === 0) {
            return res.status(400).send('No update fields provided');
        }
        const updatedPrediction = await Prediction.findByIdAndUpdate(
            id, 
            { $set: update },
            { new: true }
        );
        if (!updatedPrediction) {
            return res.status(404).send('Prediction not found');
        }
        res.json(updatedPrediction);
    } catch (error) {
        console.error('Error updating prediction:', error);
        res.status(500).send('Failed to update prediction');
    }
});

app.get('/api/predictions/:id', async (req, res) => {
    const { id } = req.params;  // Extract the ID from the route parameters

    try {
        const threat = await Prediction.findById(id);  // Use Mongoose's findById method to fetch the threat
        if (!threat) {
            return res.status(404).send({ message: 'Threat not found' });  // Return 404 if no threat is found
        }
        res.json(threat);  // Send the threat data as JSON
    } catch (error) {
        console.error('Error fetching threat by ID:', error);
        res.status(500).send({ message: 'Failed to fetch threat' });  // Send a 500 response on error
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});