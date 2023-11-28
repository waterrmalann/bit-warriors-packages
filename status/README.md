# @bit-warriors/status

A simple utility module to expose an endpoint to return the health status of an Express.js application, or a Mongoose database connection.

## Usage

```javascript
import express from 'express';
import mongoose from 'mongoose';
import { setupStatus, setupDatabaseStatus } from '@bit-warriors/status';

const app = express();
// Mongoose connection setup...
// Other middleware and configurations...

// Setup status endpoint for the Express app
setupStatus(app);
// Setup status endpoint for Mongoose database connection
setupDatabaseStatus(app, mongoose);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Endpoints

### Express App Status Endpoint

- **GET /status** - Retrieves the health status of the Express app.
  - Returns:
    ```json
    {
      "online": true,
      "received": "<timestamp>",
      "environment": "<environment>",
      "uptime": "<uptimeInSeconds>"
    }
    ```

### Mongoose Database Status Endpoint

- **GET /status-db** - Retrieves the health status of the Mongoose database connection.
  - Returns:
    ```json
    {
      "connected": "true|false",
      "status": "<connectionStatus>",
      "databaseName": "<dbName>"
    }
    ```
    - `connected`: Indicates if the database is connected.
    - `status`: The current status of the database connection (`connected`, `disconnected`, `connecting`, `disconnecting`, `uninitialized`).
    - `databaseName`: The name of the connected database.