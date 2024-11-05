class CombinationService {
    constructor(pool) {
        this.pool = pool; // Store the database connection pool
    }

    // Retrieve all items from the database
    async getAllItems() {
        const [rows] = await this.pool.query('SELECT * FROM items ORDER BY item');
        return rows;
    }

    // Store new items in the database
    async storeItems(items) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction(); // Start a new transaction

            // Clear existing items from the table
            await connection.query('TRUNCATE TABLE items');

            // Prepare item values for insertion
            const values = items.map(item => [item]);
            await connection.query(
                'INSERT INTO items (item) VALUES ?',
                [values]
            );

            await connection.commit(); // Commit the transaction
        } catch (error) {
            await connection.rollback(); // Rollback transaction on error
            throw error;
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }

    // Store combinations and log the request and response
    async storeCombinationsAndLog(combinations, requestData) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction(); // Start a new transaction

            // Insert the combinations into the database
            const [result] = await connection.query(
                'INSERT INTO combinations (combination) VALUES (?)',
                [JSON.stringify(combinations)]
            );

            // Prepare response data with the inserted combination ID
            const responseData = {
                id: result.insertId,
                combination: combinations
            };

            // Log the request and response data
            await connection.query(
                'INSERT INTO response_log (request_data, response_data) VALUES (?, ?)',
                [JSON.stringify(requestData), JSON.stringify(responseData)]
            );

            await connection.commit(); // Commit the transaction
            return responseData;
        } catch (error) {
            await connection.rollback(); // Rollback transaction on error
            throw error;
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }
}

module.exports = CombinationService;
