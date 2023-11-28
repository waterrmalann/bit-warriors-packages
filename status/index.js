/**
 * Sets up a status handling GET endpoint for the Express app.
 * @param {import('express').Express} app - An instance of Express app
 */
export function setupStatus(app) {
    app.get('/status', (_req, res) => {
        res.status(200).json({
            online: true,
            received: Date.now(),
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            // memoryUsage: process.memoryUsage()
        });
    });
}

/**
 * Sets up a status handling GET endpoint for Mongoose connection.
 * @param {import('express').Express} app - An instance of Express app
 * @param {import('mongoose')} mongoose - The Mongoose connection object.
 */
export function setupDatabaseStatus(app, mongoose) {
    const readyStates = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
        99: "uninitialized"
    };

    app.get('/status-db', (_req, res) => {
        res.status(200).json({
            connected: mongoose.connection.readyState === 1,
            status: readyStates[mongoose.connection.readyState],
            databaseName: mongoose.connection.db.databaseName
        });
    })
}