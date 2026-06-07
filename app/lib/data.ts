import { formatCurrency } from "./utils";
import {
  mockAllCustomers,
  mockFilteredCustomersTable,
  mockFilteredInvoices,
  mockInvoiceById,
  mockLatestInvoices,
  mockRevenues,
} from "./mock.data";
import { db } from "@/app/db";
import { invoices, customers } from "@/app/db/schema";
import { eq, asc, desc, or, ilike, count } from "drizzle-orm";

export async function fetchRevenue() {
  try {
    return mockRevenues;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    // const data = mockLatestInvoices;

    const partialLatestInvoices = db
      .select({
        id: invoices.id,
        name: customers.name,
        email: customers.email,
        amount: invoices.amount,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customer_id, customers.id));

    const data = await partialLatestInvoices
      .orderBy(desc(invoices.date))
      .limit(5);

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice?.amount as number),
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    const numberOfInvoices = 206;
    const numberOfCustomers = 124;
    const totalPaidInvoices = "$12,342";
    const totalPendingInvoices = "$3,283";

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const partialFilteredInvoicesTable = db
      .select({
        id: invoices.id,
        customer_id: invoices.customer_id,
        name: customers.name,
        email: customers.email,
        amount: invoices.amount,
        date: invoices.date,
        status: invoices.status,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customer_id, customers.id));

    const filteredInvoicesTable = await partialFilteredInvoicesTable
      .where(
        or(
          ilike(customers.name, `%${query}%`),
          ilike(customers.email, `%${query}%`),
        ),
      )
      .offset(offset)
      .limit(ITEMS_PER_PAGE);

    return filteredInvoicesTable;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    // const totalPages = 21;

    const data = await db
      .select({
        count: count(invoices.id),
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customer_id, customers.id))
      .where(
        or(
          ilike(customers.name, `%${query}%`),
          ilike(customers.email, `%${query}%`),
        ),
      );

    const totalPages = Math.ceil(data[0].count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = mockInvoiceById;

    const invoice = data[0];
    return { ...invoice, amount: invoice.amount / 100 };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const allCustomers = mockAllCustomers;

    return allCustomers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const data = mockFilteredCustomersTable;

    const filteredCustomers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending as number),
      total_paid: formatCurrency(customer.total_paid as number),
    }));

    return filteredCustomers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const totalPages = 12;
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}
