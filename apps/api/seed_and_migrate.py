import asyncio
from core.database import engine, AsyncSessionLocal
from modules.security.models import SecurityProfile, Employee
from sqlalchemy import select, update

async def seed_and_migrate():
    print("Iniciando siembra y migración...")
    
    async with AsyncSessionLocal() as session:
        # 1. Crear perfiles base con permisos iniciales
        perfiles_data = [
            {
                "name": "ADMIN", 
                "description": "Acceso total al sistema", 
                "permissions": {
                    "overview": "full",
                    "pos_retail": "full", 
                    "inventory": "full", 
                    "warehouse": "full",
                    "vision_train": "full",
                    "production": "full",
                    "financials": "full",
                    "invoicing": "full",
                    "purchasing": "full",
                    "procurement": "full",
                    "logistics": "full",
                    "pos_tables": "full",
                    "waiter": "full",
                    "driver": "full",
                    "seguridad_acceso": "full",
                    "auditoria": "full"
                }, 
                "is_system": True
            },
            {
                "name": "MANAGER", 
                "description": "Gestión operativa", 
                "permissions": {
                    "overview": "full",
                    "pos_retail": "full", 
                    "inventory": "full", 
                    "warehouse": "full",
                    "vision_train": "full",
                    "production": "full",
                    "financials": "read",
                    "invoicing": "full",
                    "purchasing": "full",
                    "logistics": "full",
                    "seguridad_acceso": "read"
                }, 
                "is_system": True
            },
            {
                "name": "CAJERO", 
                "description": "Operación de ventas", 
                "permissions": {
                    "overview": "full",
                    "pos_retail": "full",
                    "invoicing": "limited"
                }, 
                "is_system": True
            },
        ]
        
        profile_map = {}
        for p_data in perfiles_data:
            res = await session.execute(select(SecurityProfile).where(SecurityProfile.name == p_data["name"]))
            perfil = res.scalar_one_or_none()
            if not perfil:
                perfil = SecurityProfile(**p_data)
                session.add(perfil)
                await session.flush()
            profile_map[p_data["name"]] = perfil.id
            
        await session.commit()
        print(f"Perfiles base listos: {list(profile_map.keys())}")
        
        # 2. Migrar empleados
        res = await session.execute(select(Employee))
        empleados = res.scalars().all()
        
        count = 0
        for emp in empleados:
            # Si ya tiene perfil_id, omitir
            if emp.profile_id:
                continue
            
            # Mapear rol legado a nuevo perfil
            legacy_role = emp.role.upper()
            if legacy_role in profile_map:
                emp.profile_id = profile_map[legacy_role]
                count += 1
            else:
                # Default a CAJERO si el rol no coincide
                emp.profile_id = profile_map["CAJERO"]
                count += 1
                
        await session.commit()
        print(f"Migración completada: {count} empleados actualizados.")

if __name__ == "__main__":
    asyncio.run(seed_and_migrate())
