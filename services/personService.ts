import DatabaseManager from "../database/database";

export class PersonService {
    // الحصول على جميع الأشخاص
    static async getAllPeople() {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.getAllAsync(`
                SELECT p.*, 
                    COUNT(py.id) as payments_count,
                    COALESCE(SUM(py.amount), 0) as total_paid
                FROM people p
                LEFT JOIN payments py ON p.id = py.person_id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            `);
            // تحويل البيانات إلى الشكل المطلوب
            const formattedResult = result.map((person: any) => ({
                id: person.id,
                name: person.name,
                totalAmount: person.total_amount,
                remainingAmount: person.remaining_amount,
                status: person.status,
            }));
            return formattedResult;
        } catch (error) {
            console.error("Error fetching people:", error);
            throw error;
        }
    }

    // الحصول على شخص بالـ ID
    static async getPersonById(id: number) {
        const db = DatabaseManager.getDb();
        try {
            // get the person
            const result = await db.getFirstAsync(
                `
                SELECT p.*, 
                    COUNT(py.id) as payments_count,
                    COALESCE(SUM(py.amount), 0) as total_paid
                FROM people p
                LEFT JOIN payments py ON p.id = py.person_id
                WHERE p.id = ?
                GROUP BY p.id
            `,
                [id]
            );
            const formattedResult = {
                id: result.id,
                name: result.name,
                totalAmount: result.total_amount,
                remainingAmount: result.remaining_amount,
                status: result.status,
            };
            return formattedResult;
        } catch (error) {
            console.error("Error fetching person:", error);
            throw error;
        }
    }

    // إضافة شخص جديد
    static async addPerson(person: Person) {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.runAsync(
                `
                    INSERT INTO people (name, total_amount, remaining_amount, description, status)
                    VALUES (?, ?, ?, ?, ?)
                `,
                [person.name, person.totalAmount, person.remainingAmount || person.totalAmount, person.description || null, person.status || "active"]
            );
            return result.lastInsertRowId;
        } catch (error) {
            console.error("Error adding person:", error);
            throw error;
        }
    }

    // تحديث بيانات شخص
    static async updatePerson(id: number, person: Person) {
        const db = DatabaseManager.getDb();
        try {
            await db.runAsync(
                `
                    UPDATE people 
                    SET name = ?, total_amount = ?, remaining_amount = ?, 
                        description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `,
                [person.name, person.totalAmount, person.remainingAmount, person.description, person.status, id]
            );
        } catch (error) {
            console.error("Error updating person:", error);
            throw error;
        }
    }

    // حذف شخص
    static async deletePerson(id: number) {
        const db = DatabaseManager.getDb();
        try {
            await db.runAsync("DELETE FROM people WHERE id = ?", [id]);
        } catch (error) {
            console.error("Error deleting person:", error);
            throw error;
        }
    }

    // البحث عن أشخاص
    static async searchPeople(searchTerm: string) {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.getAllAsync(
                `
                    SELECT p.*, 
                        COUNT(py.id) as payments_count,
                        COALESCE(SUM(py.amount), 0) as total_paid
                    FROM people p
                    LEFT JOIN payments py ON p.id = py.person_id
                    WHERE p.name LIKE ?
                    GROUP BY p.id
                    ORDER BY p.name
                `,
                [`%${searchTerm}%`]
            );
            return result;
        } catch (error) {
            console.error("Error searching people:", error);
            throw error;
        }
    }

    // الحصول على الإحصائيات العامة
    static async getStatistics() {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.getFirstAsync(`
                SELECT 
                COUNT(*) as total_people,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
                COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
                COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
                COALESCE(SUM(total_amount), 0) as total_debt,
                COALESCE(SUM(remaining_amount), 0) as total_remaining,
                COALESCE(SUM(total_amount - remaining_amount), 0) as total_paid
                FROM people
            `);
            const formattedResult = {
                totalPeople: result.total_people,
                activeCount: result.active_count,
                paidCount: result.paid_count,
                overdueCount: result.overdue_count,
                totalDebt: result.total_debt,
                totalRemaining: result.total_remaining,
                totalPaid: result.total_paid,
            };
            return formattedResult;
        } catch (error) {
            console.error("Error fetching statistics:", error);
            throw error;
        }
    }

    // تحديث حالة الشخص تلقائياً حسب المبلغ المتبقي
    static async updatePersonStatus(personId: number) {
        const db = DatabaseManager.getDb();
        try {
            await db.runAsync(
                `
                    UPDATE people 
                    SET status = CASE 
                        WHEN remaining_amount <= 0 THEN 'paid'
                        WHEN remaining_amount > 0 THEN 'active'
                    ELSE status 
                    END,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `,
                [personId]
            );
        } catch (error) {
            console.error("Error updating person status:", error);
            throw error;
        }
    }
}
