interface PropsChildren {
    children: React.ReactNode;
}

interface WidgetProps {
    title: string;
    count: string;
    totale?: string;
    style?: string;
    countStyle?: string;
    icon?: React.ReactNode;
}

interface Person {
    id?: number;
    name: string;
    totalAmount: number;
    remainingAmount?: number;
    description?: string;
    status?: string;
}
interface Payment {
    id?: number;
    personId: number;
    amount: number;
    paymentDate?: string;
    notes?: string;
}

interface PaymentProps {
    id: number;
    amount: number;
    date: string;
}
interface PersonProps {
    id: number;
    name: string;
    totalAmount: number;
    remainingAmount: number;
    payments: PaymentProps[];
}
interface DebtCardProps {
    data: PersonProps;
}
