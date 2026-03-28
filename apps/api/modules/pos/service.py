from typing import Optional, List
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
        """Crea o actualiza un ticket, aplicando validaciones y reglas de negocio."""
        # 1. Validar productos y calcular totales
        db_items, total = await self._get_items_and_total(db, ticket.items)

        # 2. Buscar/Crear cabecera de ticket
        db_ticket = await self._upsert_ticket_header(db, ticket, total)

        # 3. Persistir movimientos de artículos
        await self._sync_ticket_items(db, db_ticket.id, db_items)
        
        await db.commit()
        return await self._get_full_ticket(db, db_ticket.id)

    async def _get_items_and_total(self, db: AsyncSession, items: List[schemas.TicketItemCreate]):
        """Valida stock/existencia y calcula el valor total del carrito."""
        total = 0.0
        db_items = []
        for item in items:
            product = await db.get(Product, item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if not product.active:
                raise HTTPException(status_code=400, detail=f"Product {product.name} is inactive")
            
            subtotal = product.price * item.quantity
            total += subtotal
            db_items.append(models.TicketItem(
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
                subtotal=subtotal
            ))
        return db_items, total

    async def _upsert_ticket_header(self, db: AsyncSession, ticket: schemas.TicketCreate, total: float):
        """Encuentra un ticket existente o inicializa uno nuevo."""
        result = await db.execute(select(models.Ticket).where(models.Ticket.account_num == ticket.account_num))
        db_ticket = result.scalars().first()

        if db_ticket:
            return await self._update_ticket_fields(db_ticket, ticket, total)
        
        return await self._initialize_new_ticket(db, ticket, total)

    async def _update_ticket_fields(self, db_ticket: models.Ticket, ticket: schemas.TicketCreate, total: float):
        """Actualiza campos de un ticket existente."""
        db_ticket.total = total
        db_ticket.status = ticket.status
        db_ticket.payment_details = ticket.payment_details
        db_ticket.cash_session_id = ticket.cash_session_id
        
        if ticket.status == "PAID" and ticket.cashed_by_id:
            db_ticket.cashed_by_id = ticket.cashed_by_id
        
        if ticket.captured_by_id:
            db_ticket.captured_by_id = ticket.captured_by_id
            
        return db_ticket

    async def _initialize_new_ticket(self, db: AsyncSession, ticket: schemas.TicketCreate, total: float):
        """Crea una nueva instancia de Ticket validando la sesión de terminal."""
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
        return db_ticket

    async def _sync_ticket_items(self, db: AsyncSession, ticket_id: int, db_items: List[models.TicketItem]):
        """Reemplaza items previos por la nueva ráfaga de artículos."""
        await db.execute(delete(models.TicketItem).where(models.TicketItem.ticket_id == ticket_id))
        for item in db_items:
            item.ticket_id = ticket_id
            db.add(item)

    async def _get_full_ticket(self, db: AsyncSession, ticket_id: int):
        """Recupera un ticket con CARGA ANSIOSA de todas las relaciones para evitar MissingGreenlet."""
        result = await db.execute(
            select(models.Ticket)
            .options(
                selectinload(models.Ticket.items).selectinload(models.TicketItem.product).selectinload(Product.category),
                selectinload(models.Ticket.items).selectinload(models.TicketItem.product).selectinload(Product.technical_sheet),
                selectinload(models.Ticket.session),
                selectinload(models.Ticket.captured_by).selectinload(Employee.profile),
                selectinload(models.Ticket.cashed_by).selectinload(Employee.profile)
            )
            .where(models.Ticket.id == ticket_id)
        )
        ticket_obj = result.scalar_one()
        return self._populate_flat_fields(ticket_obj)

    def _populate_flat_fields(self, ticket_obj: models.Ticket):
        """Puebla campos calculados o nombres planos para el frontend."""
        ticket_obj.terminal_id = ticket_obj.session.terminal_id if ticket_obj.session else "UNKNOWN"
        ticket_obj.captured_by_name = ticket_obj.captured_by.name if ticket_obj.captured_by else "SISTEMA"
        ticket_obj.cashed_by_name = ticket_obj.cashed_by.name if ticket_obj.cashed_by else "SISTEMA/AUTO"
        return ticket_obj

    async def get_open_tickets(self, db: AsyncSession):
        """Obtiene todos los tickets en estado OPEN."""
        result = await db.execute(
            select(models.Ticket)
            .options(
                selectinload(models.Ticket.items).selectinload(models.TicketItem.product).selectinload(Product.category),
                selectinload(models.Ticket.items).selectinload(models.TicketItem.product).selectinload(Product.technical_sheet),
                selectinload(models.Ticket.session),
                selectinload(models.Ticket.captured_by).selectinload(Employee.profile),
                selectinload(models.Ticket.cashed_by).selectinload(Employee.profile)
            )
            .where(models.Ticket.status == "OPEN")
            .order_by(models.Ticket.created_at.desc())
        )
        tickets = result.scalars().all()
        return [self._populate_flat_fields(t) for t in tickets]

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
        """Reserva un ticket vacío o genera uno nuevo con ID correlativo."""
        session = await self.get_active_session(db, terminal_id)
        if not session:
            raise HTTPException(status_code=400, detail="No active session for terminal")

        # 1. Intentar reciclar un ticket vacío
        recycled = await self._find_empty_ticket(db, session.id)
        if recycled:
            return await self._get_full_ticket(db, recycled.id)

        # 2. Generar ticket nuevo con folio automático
        new_ticket = await self._generate_consecutive_ticket(db, session.id)
        return await self._get_full_ticket(db, new_ticket.id)

    async def _find_empty_ticket(self, db: AsyncSession, session_id: int):
        """Busca un ticket abierto sin items ni monto."""
        result = await db.execute(
            select(models.Ticket)
            .options(selectinload(models.Ticket.items))
            .where(models.Ticket.session_id == session_id)
            .where(models.Ticket.status == "OPEN")
            .where(models.Ticket.total == 0.0)
        )
        tickets = result.scalars().all()
        # Verificación manual de items para asegurar limpieza total
        for t in tickets:
            if len(t.items) == 0:
                return t
        return None

    async def _generate_consecutive_ticket(self, db: AsyncSession, session_id: int):
        """Crea un ticket nuevo y le asigna un folio correlativo (V0001, etc)."""
        import uuid
        temp_num = f"TEMP_{uuid.uuid4().hex[:4]}"
        db_ticket = models.Ticket(account_num=temp_num, session_id=session_id, total=0.0, status="OPEN")
        db.add(db_ticket)
        await db.flush()
        
        db_ticket.account_num = f"V{db_ticket.id:04d}"
        await db.commit()
        return db_ticket

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

    async def predict_vision(self, payload: schemas.VisionPredictionRequest):
        import time
        import base64
        import cv2
        import numpy as np
        from pathlib import Path

        start_time = time.time()
        
        # 1. Decodificar imagen de la cámara
        try:
            b64_str = payload.image
            if "," in b64_str:
                b64_str = b64_str.split(",")[1]
            img_data = base64.b64decode(b64_str)
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None:
                raise ValueError("Could not decode image")
        except Exception as e:
            return schemas.VisionPredictionResponse(detections=[], engine="local", latency_ms=(time.time()-start_time)*1000)

        # 2. Inicializar detector ORB (Rápido y local)
        orb = cv2.ORB_create(nfeatures=500)
        kp_frame, des_frame = orb.detectAndCompute(frame, None)
        
        if des_frame is None:
            return schemas.VisionPredictionResponse(detections=[], engine="local", latency_ms=(time.time()-start_time)*1000)

        # 3. Escanear dataset local
        base_dir = Path("apps/api/static/training")
        if not base_dir.exists():
            return schemas.VisionPredictionResponse(detections=[], engine="local", latency_ms=(time.time()-start_time)*1000)

        best_sku = None
        best_score = 0.0
        
        # BFMatcher para comparar características de forma cruda
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

        for sku_path in base_dir.iterdir():
            if not sku_path.is_dir(): continue
            
            sku_name = sku_path.name
            sku_max_matches = 0
            
            # Revisar hasta 3 fotos de entrenamiento por SKU para máxima velocidad
            train_images = list(sku_path.glob("*.jpg"))
            for img_file in train_images[:3]:
                train_img = cv2.imread(str(img_file), cv2.IMREAD_COLOR)
                if train_img is None: continue
                
                kp_train, des_train = orb.detectAndCompute(train_img, None)
                if des_train is None: continue
                
                matches = bf.match(des_frame, des_train)
                # Contamos coincidencias de buena calidad (distancia baja)
                good_matches = len([m for m in matches if m.distance < 45])
                
                if good_matches > sku_max_matches:
                    sku_max_matches = good_matches
            
            # Normalización heurística del score
            score = sku_max_matches / 40.0 # Umbral de 40 puntos para considerarlo sólido
            if score > best_score:
                best_score = score
                best_sku = sku_name

        detections = []
        # Umbral de confianza mínimo para evitar falsos positivos
        if best_sku and best_score > 0.35:
            # Limpiamos el SKU (guiones por espacios) para que coincida con el nombre del producto
            detections.append(schemas.VisionDetection(
                label=best_sku.replace("_", " ").upper(), 
                qty=1, 
                confidence=min(best_score, 1.0)
            ))

        return schemas.VisionPredictionResponse(
            detections=detections,
            engine="local",
            latency_ms=(time.time() - start_time) * 1000
        )

pos_service = POSService()
