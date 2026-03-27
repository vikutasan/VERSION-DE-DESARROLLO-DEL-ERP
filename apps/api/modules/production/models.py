from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from core.database import Base

class Dough(Base):
    """
    Maestro de Masas (ADN de la panadería).
    Representa una receta base escalable por 'Bastones'.
    """
    __tablename__ = "doughs"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # Ej: 'B', 'P', 'D'
    name = Column(String, nullable=False)                         # Ej: 'Masa para Bolillo'
    description = Column(Text, nullable=True)
    dough_type = Column(String, nullable=False)                   # Ej: 'PRE-FERMENTO', 'DULCE', 'SALADA'
    
    # Parámetros de Reposo
    requires_rest = Column(Boolean, default=False)
    rest_container = Column(String, nullable=True)               # Ej: 'Cubeta', 'Charola'
    rest_warehouse = Column(String, nullable=True)               # Ej: 'Cámara 1', 'Almacén Secos'
    rest_time_min = Column(Integer, nullable=True)
    
    # Rendimientos Teóricos
    theoretical_yield = Column(Float, nullable=True) # Peso total esperado
    expected_waste = Column(Float, default=0.0)

    # Relaciones
    batches = relationship("DoughBatchConfig", back_populates="dough", cascade="all, delete-orphan")
    ingredients = relationship("DoughIngredient", back_populates="dough", cascade="all, delete-orphan", foreign_keys="[DoughIngredient.dough_id]")
    procedure_steps = relationship("DoughProcedureStep", back_populates="dough", order_by="DoughProcedureStep.step_number", cascade="all, delete-orphan")
    product_relations = relationship("DoughProductRelation", back_populates="dough", cascade="all, delete-orphan")
    dough_relations = relationship("DoughRelation", back_populates="dough", cascade="all, delete-orphan", foreign_keys="[DoughRelation.dough_id]")

class DoughRelation(Base):
    """
    Relación Masa-a-Masa (Ej: Masa de Fuerza requerida por Pan Blanco).
    Define cuántos gramos de un prefermento usa esta masa.
    """
    __tablename__ = "dough_relations"

    id = Column(Integer, primary_key=True, index=True)
    dough_id = Column(Integer, ForeignKey("doughs.id"), nullable=False)
    related_dough_id = Column(Integer, ForeignKey("doughs.id"), nullable=False)
    qty_per_baston = Column(Float, nullable=False) # Gramos de prefermento por BASTON de esta masa

    dough = relationship("Dough", foreign_keys=[dough_id], back_populates="dough_relations")
    related_dough = relationship("Dough", foreign_keys=[related_dough_id])

class DoughBatchConfig(Base):
    """
    Configuración de Tandas / MEP (Mise en Place).
    Define los 'costales' o batidos estándar (ej: 4B, 6B, P16).
    """
    __tablename__ = "dough_batch_configs"

    id = Column(Integer, primary_key=True, index=True)
    dough_id = Column(Integer, ForeignKey("doughs.id"))
    name = Column(String, nullable=False)           # Ej: '4B (4 BASTONES)'
    baston_qty = Column(Float, nullable=False)      # Ej: 4.0
    
    dough = relationship("Dough", back_populates="batches")

class DoughIngredient(Base):
    """
    Ingredientes de la masa, escalados por Bastón.
    Incopora tipo de MEP (Polvos/Líquidos).
    """
    __tablename__ = "dough_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    dough_id = Column(Integer, ForeignKey("doughs.id"))
    name = Column(String, nullable=False)
    qty_per_baston = Column(Float, nullable=False)
    unit = Column(String, default="g")              # g, kg, L, BASTON
    mep_type = Column(String, nullable=True)        # POLVOS, LIQUIDOS, PRE-FERMENTO
    
    # Si la unidad es BASTON, podemos vincular a otro pre-fermento (opcional)
    preferment_id = Column(Integer, ForeignKey("doughs.id"), nullable=True)

    dough = relationship("Dough", back_populates="ingredients", foreign_keys=[dough_id])
    preferment = relationship("Dough", foreign_keys=[preferment_id])

class DoughProcedureStep(Base):
    """
    Pasos detallados de la revoltura.
    """
    __tablename__ = "dough_procedure_steps"

    id = Column(Integer, primary_key=True, index=True)
    dough_id = Column(Integer, ForeignKey("doughs.id"))
    step_number = Column(Integer, nullable=False)
    task = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    equipment = Column(String, nullable=True)       # Ej: 'Revolvedora', 'Bascula'
    speed = Column(String, nullable=True)           # Ej: '1', '2', 'Apagado'
    time_minutes = Column(Integer, default=0)

    dough = relationship("Dough", back_populates="procedure_steps")

class DoughProductRelation(Base):
    """
    Relación Masa-Producto.
    Define cuántos gramos de esta masa usa un producto manufacturado.
    """
    __tablename__ = "dough_product_relations"

    id = Column(Integer, primary_key=True, index=True)
    dough_id = Column(Integer, ForeignKey("doughs.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    grams_per_piece = Column(Float, nullable=False)
    pieces_per_baston = Column(Integer, nullable=True) # Cantidad real operativa de piezas por bastón (Ej: 36 bolillos)
    
    dough = relationship("Dough", back_populates="product_relations")
    product = relationship("Product")
