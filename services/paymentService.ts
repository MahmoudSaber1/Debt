import DatabaseManager from "../database/database";
import { PersonService } from "./personService";

export class PaymentService {
    // الحصول على جميع المدفوعات لشخص معين
    static async getPaymentsByPersonId(personId: number) {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.getAllAsync("SELECT * FROM payments WHERE person_id = ? ORDER BY payment_date DESC", [personId]);
            return result;
        } catch (error) {
            console.error("Error fetching payments:", error);
            throw error;
        }
    }

    // إضافة دفعة جديدة
    static async addPayment(payment: Payment) {
        const db = DatabaseManager.getDb();
        try {
            return await db.withTransactionAsync(async () => {
                // إضافة الدفعة
                const paymentResult = await db.runAsync(
                    `
                    INSERT INTO payments (person_id, amount, payment_date, notes)
                    VALUES (?, ?, ?, ?)
                    `,
                    [payment.personId, payment.amount, payment.paymentDate || new Date().toISOString(), payment.notes || null]
                );

                // تحديث المبلغ المتبقي
                await db.runAsync(
                    `
                    UPDATE people 
                    SET remaining_amount = remaining_amount - ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    `,
                    [payment.amount, payment.personId]
                );

                // تحديث الحالة
                await PersonService.updatePersonStatus(payment.personId);

                return paymentResult.lastInsertRowId;
            });
        } catch (error) {
            console.error("Error adding payment:", error);
            throw error;
        }
    }

    // حذف دفعة
    static async deletePayment(paymentId: number) {
        const db = DatabaseManager.getDb();
        try {
            return await db.withTransactionAsync(async () => {
                // الحصول على معلومات الدفعة
                const payment = await db.getFirstAsync("SELECT * FROM payments WHERE id = ?", [paymentId]);

                if (!payment) {
                    throw new Error("Payment not found");
                }

                // حذف الدفعة
                await db.runAsync("DELETE FROM payments WHERE id = ?", [paymentId]);

                // إعادة المبلغ للشخص
                await db.runAsync(
                    `
                    UPDATE people 
                    SET remaining_amount = remaining_amount + ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    `,
                    [payment.amount, payment.person_id]
                );

                // تحديث الحالة
                await PersonService.updatePersonStatus(payment.person_id);
            });
        } catch (error) {
            console.error("Error deleting payment:", error);
            throw error;
        }
    }

    // الحصول على آخر المدفوعات
    static async getRecentPayments(limit = 10) {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.getAllAsync(
                `
                    SELECT p.*, pe.name as person_name
                    FROM payments p
                    JOIN people pe ON p.person_id = pe.id
                    ORDER BY p.payment_date DESC
                    LIMIT ?
                `,
                [limit]
            );
            return result;
        } catch (error) {
            console.error("Error fetching recent payments:", error);
            throw error;
        }
    }

    // إجمالي المدفوعات في فترة معينة
    static async getPaymentsInDateRange(startDate: string, endDate: string) {
        const db = DatabaseManager.getDb();
        try {
            const result = await db.getAllAsync(
                `
                    SELECT p.*, pe.name as person_name
                    FROM payments p
                    JOIN people pe ON p.person_id = pe.id
                    WHERE DATE(p.payment_date) BETWEEN ? AND ?
                    ORDER BY p.payment_date DESC
                `,
                [startDate, endDate]
            );
            return result;
        } catch (error) {
            console.error("Error fetching payments in date range:", error);
            throw error;
        }
    }
}
