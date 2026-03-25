from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.database import Base


class SecurityProfile(Base):
    """
    Define un perfil de acceso al sistema con permisos granulares.
    """
    __tablename__ = "security_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    # Almacena permisos como dict: {"pos": "full", "inventory": "read", ...}
    permissions = Column(JSON, nullable=False, default={})
    is_system = Column(Boolean, default=False)  # Para perfiles base no eliminables

    employees = relationship("Employee", back_populates="profile")


class Employee(Base):
    """
    Representa un empleado del sistema con acceso al POS.
    Cada empleado tiene un PIN único para autenticarse como cajero.
    """
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    employee_code = Column(String, unique=True, nullable=False, index=True)  # PIN de acceso
    role = Column(String, nullable=False, default="CAJERO")  # Legacy: CAJERO, SUPERVISOR, ADMIN
    is_active = Column(Boolean, default=True)
    
    profile_id = Column(Integer, ForeignKey("security_profiles.id"), nullable=True)
    profile = relationship("SecurityProfile", back_populates="employees")
