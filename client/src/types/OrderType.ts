import type { ProductType } from "./ProductType";
import html2pdf from 'html2pdf.js'

export type OrderType = {
    id: string;
    status: OrderStatus;
    deliveryAddress: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    products: ProductType[];
};

enum OrderStatus {
    PAYMENT_PENDING = "payment pending",
    PAYMENT_FAILED = "payment failed",
    PAID = "paid",
    IN_SHIPMENT = "in shipment",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
}

export const downloadInvoice = async (order: OrderType) => {
    const orderId = order.id
    const template = document.getElementById('invoice-template')
    if (template) {
        template.style.display = 'block'
        await html2pdf(template, {
        margin: [1, 1],
        filename: `facture-${orderId}.pdf`,
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2, letterRendering: true},
        jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'},
        pagebreak: {mode: ['avoid-all', 'css', 'legacy']}
        })
        template.style.display = 'none'
    }
};