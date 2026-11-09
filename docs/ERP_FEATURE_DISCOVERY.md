# ERP feature discovery (what the website may claim)

The website only advertises capabilities found in the ERP source code and covered by its automated tests (282 backend tests at the time of writing). Each is classified:
**Fully implemented** · **Partially implemented** (shown with a "Limited scope" badge) · **Planned** (never advertised) · **Not verified** (never advertised).

| Area | Classification | Notes |
| --- | --- | --- |
| Chart of accounts, journal entries (draft/approve/post/reverse), trial balance, income statement, balance sheet, cash flow | Fully implemented | |
| Customer and supplier statements, ageing, payment and receipt vouchers with allocation | Fully implemented | |
| Bank reconciliation, cost centers, VAT/tax reports, multi-currency vouchers | Fully implemented | |
| Budgeting | **Partially implemented** | Budget-versus-actual reports; entry tools are limited |
| Sales: quotations, orders, invoices, credit notes, collections, public customer ordering page | Fully implemented | |
| Purchasing: purchase orders, goods receipt, supplier invoices, payments | Fully implemented | |
| Inventory: items, warehouses, transfers, valuation and stock reports | Fully implemented | |
| HR: employees, attendance, leave, loans, payroll (incl. part-month run), end-of-service, privacy of sensitive data | Fully implemented | Phases H1–H9 |
| Reporting center and dashboards ("300+ reports") | Fully implemented | The count comes from the reports registry in the ERP |
| Multi-company with data isolation, branches and branch-level permissions | Fully implemented | |
| Audit trail, integrity monitor, daily backup | Fully implemented | |
| "Assistant" | **Partially implemented** | A rule-based HR assistant answering from company data. It is **not** a generative AI model and the site says so |
| Generative AI, forecasting, predictive analytics | **Planned / not present** | Never advertised |
| Third-party integrations, mobile apps, e-invoicing connectors, payment gateways | **Not verified** | Never advertised |

Anything not in this table must be verified in code before it is added to `src/content/modules.ts`.
Re-run this check before each content change: the source of truth is the ERP repository, not marketing wording.
