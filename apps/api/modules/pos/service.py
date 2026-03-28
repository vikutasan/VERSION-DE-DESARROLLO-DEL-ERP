from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from fastapi import HTTPException
from . import models, schemas
from modules.catalog.models import Product
from modules.security.models import Employee, SecurityProfile

class POSService:
    async def create_session(self, db: AsyncSession, session: schemas.TerminalSessionCreate):
        db_session = models.TerminalSession(**session.model_dump())
        db.add(db_session)
        await db.commit()
        await db.refresh(db_session)
        return db_session

    async def get_active_session(self, db: AsyncSession, terminal_id: str):
        result = await db.execute(
            select(models.TerminalSession)
            .where(models.TerminalSession.terminal_id == terminal_id)
            .where(models.TerminalSession.is_active == True)
        )
        return result.scalars().first()

    async def create_ticket(self, db: AsyncSession, ticket: schemas.TicketCreate):
        # 1. Calcular Totales y Validar Productos
        total = 0.0
        db_items = []
        for item in ticket.items:
            product = await db.get(Product, item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if not product.active:
                raise HTTPException(status_code=400, detail=f"Product {product.name} is inactive")
            
            subtotal = product.price * item.quantity
            total += subtotal
            
            db_item = models.TicketItem(
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
                subtotal=subtotal
            )
            db_items.append(db_item)

        # 2. Buscar ticket existente por account_num
        result = await db.execute(
            select(models.Ticket).where(models.Ticket.account_num == ticket.account_num)
        )
        db_ticket = result.scalars().first()

        if db_ticket:
            # El ticket ya existe - actualizamos directamente
            db_ticket.total = total
            db_ticket.status = ticket.status
            db_ticket.payment_details = ticket.payment_details
            db_ticket.cash_session_id = ticket.cash_session_id
            
            # Si se está cobrando ahora, registrar quién lo hizo
            if ticket.status == "PAID" and ticket.cashed_by_id:
                db_ticket.cashed_by_id = ticket.cashed_by_id
            
            # Registrar quién lo captura.
            if ticket.captured_by_id:
                db_ticket.captured_by_id = ticket.captured_by_id
            
            # Eliminamos items anteriores para reemplazarlos
            await db.execute(
                delete(models.TicketItem).where(models.TicketItem.ticket_id == db_ticket.id)
            )
        else:
            # Ticket nuevo - registrar quién lo captura
            session = await db.get(models.TerminalSession, ticket.session_id)
            if not session or not session.is_active:
                raise HTTPException(status_code=400, detail="Terminal session invalid or inactive")
            
            db_ticket = models.Ticket(
                account_num=ticket.account_num,
                session_id=ticket.session_id,
                total=total,
                status=ticket.status or "OPEN",
                payment_details=ticket.payment_details,
                cash_session_id=ticket.cash_session_id,
                captured_by_id=ticket.captured_by_id
            )
            db.add(db_ticket)
            await db.flush()
        
        for db_item in db_items:
            db_item.ticket_id = db_ticket.id
            db.add(db_item)
            
        await db.commit()
        
        # Respuesta final con relaciones cargadas SIN lazy loading
        result = await db.execute(
            select(models.Ticket)
            .options(
                selectinload(models.Ticket.items).selectinload(models.TicketItem.product).selectinload(Product.category),
                selectinload(models.Ticket.session),
                selectinload(models.Ticket.captured_by).selectinload(Employee.profile),
                selectinload(models.Ticket.cashed_by).selectinload(Employee.profile)
            )
            .where(models.Ticket.id == db_ticket.id)
        )
        ticket_obj = result.scalar_one()
        ticket_obj.terminal_id = ticket_obj.session.terminal_id
        
        # Poblar nombres planos para el frontend
        ticket_obj.captured_by_name = ticket_obj.captured_by.name if ticket_obj.captured_by else "SISTEMA"
        ticket_obj.cashed_by_name = ticket_obj.cashed_by.name if ticket_obj.cashed_by else "SISTEMA/AUTO"
        
        return ticket_obj

    async def get_open_tickets(self, db: AsyncSession):
        result = await db.execute(
            select(models.Ticket)
            .options(
                selectinload(models.Ticket.items)
                .selectinload(models.TicketItem.product)
                .selectinload(Product.category),
                selectinload(models.Ticket.session),
                selectinload(models.Ticket.captured_by).selectinload(Employee.profile),
                selectinload(models.Ticket.cashed_by).selectinload(Employee.profile)
            )
            .where(models.Ticket.status == "OPEN")
            .order_by(models.Ticket.created_at.desc())
        )
        tickets = result.scalars().all()
        for t in tickets:
            try:
                t.terminal_id = t.session.terminal_id if t.session else "UNKNOWN"
                t.captured_by_name = t.captured_by.name if t.captured_by else "SISTEMA"
                t.cashed_by_name = t.cashed_by.name if t.cashed_by else "SISTEMA/AUTO"
            except Exception as e:
                print(f"ERROR lazy-load get_open_tickets on {t.account_num}: {e}")
                t.terminal_id = t.terminal_id if hasattr(t, 'terminal_id') else "UNKNOWN"
                t.captured_by_name = t.captured_by_name if hasattr(t, 'captured_by_name') else "SISTEMA"
                t.cashed_by_name = t.cashed_by_name if hasattr(t, 'cashed_by_name') else "SISTEMA/AUTO"
        return tickets

    async def get_tickets(self, db: AsyncSession, terminal_id: str = None, status: str = None, search: str = None, limit: int = 100):
        query = select(models.Ticket).options(
            selectinload(models.Ticket.items).selectinload(models.TicketItem.product),
            selectinload(models.Ticket.session),
            selectinload(models.Ticket.captured_by),
            selectinload(models.Ticket.cashed_by)
        )
        
        if terminal_id:
            query = query.join(models.TerminalSession).where(models.TerminalSession.terminal_id == terminal_id)
        if status:
            query = query.where(models.Ticket.status == status)
        if search:
            query = query.where(models.Ticket.account_num.ilike(f"%{search}%"))
            
        query = query.order_by(models.Ticket.created_at.desc()).limit(limit)
        
        result = await db.execute(query)
        tickets = result.scalars().all()
        
        response_data = []
        for t in tickets:
            try:
                # Construcción manual del diccionario para evitar LazyLoad en la serialización de FastAPI
                ticket_dict = {
                    "id": t.id,
                    "account_num": t.account_num,
                    "total": t.total,
                    "status": t.status,
                    "created_at": t.created_at,
                    "session_id": t.session_id,
                    "cash_session_id": t.cash_session_id,
                    "captured_by_id": t.captured_by_id,
                    "cashed_by_id": t.cashed_by_id,
                    "terminal_id": t.session.terminal_id if t.session else "UNKNOWN",
                    "captured_by_name": t.captured_by.name if t.captured_by else "SISTEMA",
                    "cashed_by_name": t.cashed_by.name if t.cashed_by else "SISTEMA/AUTO",
                    "items": [
                        {
                            "id": item.id,
                            "product_id": item.product_id,
                            "quantity": item.quantity,
                            "unit_price": item.unit_price,
                            "subtotal": item.subtotal,
                            "product": {
                                "id": item.product.id,
                                "sku": item.product.sku,
                                "name": item.product.name,
                                "price": item.product.price,
                                "category_id": item.product.category_id
                            } if item.product else None
                        }
                        for item in t.items
                    ]
                }
                response_data.append(ticket_dict)
            except Exception as e:
                print(f"CRITICAL: Error serializing ticket {t.account_num}: {e}")
                continue # Omitir ticket corrupto para no tumbar toda la lista
                
        return response_data

    async def reserve_ticket(self, db: AsyncSession, terminal_id: str):
        import uuid
        session = await self.get_active_session(db, terminal_id)
        if not session:
            raise HTTPException(status_code=400, detail="No active session for terminal")

        # 1. Buscar ticket reservado, vacío y abierto
        result = await db.execute(
            select(models.Ticket)
            .options(
                selectinload(models.Ticket.session),
                selectinload(models.Ticket.captured_by).selectinload(Employee.profile),
                selectinload(models.Ticket.cashed_by).selectinload(Employee.profile)
            )
            .where(models.Ticket.session_id == session.id)
            .where(models.Ticket.status == "OPEN")
            .where(models.Ticket.total == 0.0)
        )
        tickets = result.scalars().all()
        for t in tickets:
            if len(t.items) == 0:
                t.captured_by_id = None
                t.cashed_by_id = None
                t.payment_details = None
                t.terminal_id = session.terminal_id
                await db.commit()
                return t

        # 2. Reclamar nuevo ID consecutivo
        temp_num = f"TEMP_{uuid.uuid4().hex[:4]}"
        db_ticket = models.Ticket(
            account_num=temp_num,
            session_id=session.id,
            total=0.0,
            status="OPEN"
        )
        db.add(db_ticket)
        await db.flush()
        
        db_ticket.account_num = f"V{db_ticket.id:04d}"
        ticket_id = db_ticket.id
        await db.commit()
        
        # Recuperar completo para la serialización Pydantic
        result = await db.execute(
            select(models.Ticket)
            .options(
                selectinload(models.Ticket.session),
                selectinload(models.Ticket.captured_by).selectinload(Employee.profile),
                selectinload(models.Ticket.cashed_by).selectinload(Employee.profile)
            )
            .where(models.Ticket.id == ticket_id)
        )
        ticket_obj = result.scalar_one()
        ticket_obj.terminal_id = session.terminal_id
        return ticket_obj

    async def upload_training_images(self, payload: schemas.VisionTrainingUpload):
        import os
        import base64
        import time
        from pathlib import Path
        
        base_dir = Path("apps/api/static/training")
        base_dir.mkdir(parents=True, exist_ok=True)
        
        safe_sku = "".join(c for c in payload.sku if c.isalnum() or c in ("-", "_")).rstrip()
        sku_dir = base_dir / safe_sku
        sku_dir.mkdir(parents=True, exist_ok=True)
        
        saved_files = []
        for i, b64_str in enumerate(payload.images):
            try:
                if "," in b64_str:
                    b64_str = b64_str.split(",")[1]
                
                img_data = base64.b64decode(b64_str)
                filename = f"train_{int(time.time())}_{i}.jpg"
                file_path = sku_dir / filename
                
                with open(file_path, "wb") as f:
                    f.write(img_data)
                
                saved_files.append(str(file_path))
            except Exception as e:
                print(f"Error guardando imagen {i} para SKU {payload.sku}: {e}")
            
        return {"sku": payload.sku, "count": len(saved_files), "path": str(sku_dir)}

pos_service = POSService()
