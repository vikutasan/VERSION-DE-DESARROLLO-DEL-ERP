from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.database import Base

class MassManager(Base):
    """
    Gestor de Masas Base. Proveedor Interno.
    Controla los parámetros físicos y de rendimiento de una tanda de masa.
    """
    __tablename__ = "mass_manager"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    
    # Rendimiento
    total_yield_grams = Column(Float, nullable=False)  # Rendimiento total de la tanda en gramos
    loss_percentage = Column(Float, default=0.0)       # Porcentaje de merma esperada
    
    # Parámetros físicos / químicos de amase
    tfm_celsius = Column(Float, nullable=True)         # Temperatura Final de Masa (TFM)
    autolysis_time_min = Column(Integer, nullable=True) # Tiempo de autólisis
    kneading_time_low_min = Column(Integer, nullable=True)
    kneading_time_high_min = Column(Integer, nullable=True)
    
    # Fermentación/Reposo
    bulk_fermentation_time_min = Column(Integer, nullable=True)
    bulk_fermentation_temp_celsius = Column(Float, nullable=True)
    folds_count = Column(Integer, default=0)           # Número de pliegues (Stretch & Folds)

class ProductTechnicalSheet(Base):
    """
    Ficha Técnica de Producción.
    Vinculada 1:1 a un Producto, con campos dinámicos según su Naturaleza.
    """
    __tablename__ = "product_technical_sheets"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True)
    
    # -----------------------------------------------------
    # CUALIDADES PARA: MANUFACTURADO (Panadería Artesanal)
    # -----------------------------------------------------
    primary_mass_id = Column(Integer, ForeignKey("mass_manager.id"), nullable=True)
    secondary_mass_id = Column(Integer, ForeignKey("mass_manager.id"), nullable=True)
    tertiary_mass_id = Column(Integer, ForeignKey("mass_manager.id"), nullable=True)
    weight_per_piece = Column(Float, nullable=True)     # Gramos por pieza de masa primaria
    
    # Parámetros de Horneo
    baking_temp_top = Column(Float, nullable=True)      # Temp Bóveda
    baking_temp_bottom = Column(Float, nullable=True)   # Temp Piso
    baking_time_min = Column(Integer, nullable=True)
    steam_seconds = Column(Integer, nullable=True)      # Segundos de inyección de vapor
    scoring_type = Column(String, nullable=True)        # Tipo de Greñado / Corte
    
    # Procedimiento y BOM
    forming_procedure = Column(String, nullable=True)   # Procedimiento de formado (Texto enriquecido)
    bom_extra = Column(JSON, nullable=True)             # Rellenos, barnices, etc [{"name": "Mermelada", "grams": 20}]

    # -----------------------------------------------------
    # CUALIDADES PARA: PREPARADO AL MOMENTO (Cafetería/Pizzería)
    # -----------------------------------------------------
    preparation_time_min = Column(Integer, nullable=True)
    recipe_procedure = Column(String, nullable=True)
    modifiers = Column(JSON, nullable=True)             # Opciones de customización (Ej: Tipo de leche, Extras)

    # -----------------------------------------------------
    # CUALIDADES PARA: REVENTA (Souvenirs/Lácteos)
    # -----------------------------------------------------
    provider = Column(String, nullable=True)
    original_barcode = Column(String, nullable=True)
    unit_measure = Column(String, nullable=True)        # Pieza, Paquete, Lt
    min_stock = Column(Integer, nullable=True)
    max_stock = Column(Integer, nullable=True)

    # Relaciones
    product = relationship("Product", back_populates="technical_sheet")
    primary_mass = relationship("MassManager", foreign_keys=[primary_mass_id])
    secondary_mass = relationship("MassManager", foreign_keys=[secondary_mass_id])
    tertiary_mass = relationship("MassManager", foreign_keys=[tertiary_mass_id])
