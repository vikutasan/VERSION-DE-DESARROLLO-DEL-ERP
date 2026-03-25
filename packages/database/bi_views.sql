-- =============================================
-- R DE RICO - VISTAS PARA DASHBOARDS (POWERBI / TABLEAU)
-- Estas vistas deplanan la base de datos para facilitar el análisis.
-- =============================================

-- 1. KPI de Ventas y Márgenes (Gross Profit)
CREATE OR REPLACE VIEW bi_sales_performance AS
SELECT 
    t."createdAt" AS sale_date,
    t."id" AS transaction_id,
    p."name" AS product_name,
    c."name" AS category,
    ti."quantity" AS quantity_sold,
    ti."price" AS sale_unit_price,
    (ti."quantity" * ti."price") AS total_sales,
    COALESCE(r."baseCost", 0) AS estimated_cost_unit,
    (ti."quantity" * (ti."price" - COALESCE(r."baseCost", 0))) AS gross_profit,
    e."firstName" || ' ' || e."lastName" AS employee_name,
    e."branch" AS branch
FROM "Transaction" t
JOIN "TransactionItem" ti ON t."id" = ti."transactionId"
JOIN "Product" p ON ti."productId" = p."id"
LEFT JOIN "Category" c ON p."categoryId" = c."id"
LEFT JOIN "Recipe" r ON p."id" = r."productId"
LEFT JOIN "Employee" e ON t."employeeId" = e."id";

-- 2. KPI de Eficiencia de Producción (Yield vs Waste)
CREATE OR REPLACE VIEW bi_production_efficiency AS
SELECT 
    pp."date" AS production_date,
    p."name" AS product_name,
    ppi."totalRequired" AS planned_units,
    ppi."actualProduced" AS actual_units,
    ppi."wasteQuantity" AS waste_units,
    CASE 
        WHEN ppi."totalRequired" > 0 THEN (ppi."actualProduced"::FLOAT / ppi."totalRequired"::FLOAT) * 100 
        ELSE 0 
    END AS fulfillment_rate,
    CASE 
        WHEN ppi."actualProduced" > 0 THEN (ppi."wasteQuantity"::FLOAT / ppi."actualProduced"::FLOAT) * 100 
        ELSE 0 
    END AS waste_percentage
FROM "ProductionPlan" pp
JOIN "ProductionPlanItem" ppi ON pp."id" = ppi."productionPlanId"
JOIN "Product" p ON ppi."productId" = p."id";

-- 3. KPI de Cumplimiento de Personal (Compliance)
CREATE OR REPLACE VIEW bi_employee_compliance AS
SELECT 
    al."createdAt" AS activity_date,
    e."firstName" || ' ' || e."lastName" AS employee_name,
    e."role" AS role,
    a."name" AS task_name,
    a."priority" AS task_priority,
    al."status" AS completion_status,
    CASE WHEN al."status" = 'COMPLETED' THEN 1 ELSE 0 END AS is_done
FROM "ActivityLog" al
JOIN "Employee" e ON al."employeeId" = e."id"
JOIN "Activity" a ON al."activityId" = a."id";

-- 4. KPI de Incidencias Operativas
CREATE OR REPLACE VIEW bi_operational_incidents AS
SELECT 
    i."date" AS incident_date,
    e."firstName" || ' ' || e."lastName" AS employee_name,
    i."type" AS incident_type,
    i."severity" AS severity,
    i."isResolved" AS is_resolved
FROM "Incident" i
JOIN "Employee" e ON i."employeeId" = e."id";
