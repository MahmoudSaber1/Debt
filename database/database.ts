import * as SQLite from "expo-sqlite";
import { createTables } from "./schema";

class DatabaseManager {
    private db?: any;

    async init() {
        try {
            this.db = await SQLite.openDatabaseAsync("debtManager.db");
            await this.createTables();
            console.log("Database initialized successfully");
        } catch (error) {
            console.error("Database initialization failed:", error);
            throw error;
        }
    }

    async createTables() {
        try {
            await this.db.execAsync(createTables);
            console.log("Tables created successfully");
        } catch (error) {
            console.error("Error creating tables:", error);
            throw error;
        }
    }

    getDb() {
        if (!this.db) {
            throw new Error("Database not initialized. Call init() first.");
        }
        return this.db;
    }
}

export default new DatabaseManager();
