from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    icon = Column(String, nullable=True)
    position = Column(Integer, nullable=True)
    vision_enabled = Column(Boolean, default=False)
    is_system = Column(Boolean, default=False)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    barcode = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, index=True, nullable=False)
    price = Column(Float, nullable=False)
    cost = Column(Float, default=0.0)
    stock = Column(Float, default=0.0)
    warehouse = Column(String, default="Bóveda Central")
    image_url = Column(String, nullable=True)
    position = Column(Integer, nullable=True)
    nature = Column(String, default="MANUFACTURADO")  # MANUFACTURADO, PREPARADO, REVENTA
    category_id = Column(Integer, ForeignKey("categories.id"))
    active = Column(Boolean, default=True)

    category = relationship("Category", back_populates="products")
    technical_sheet = relationship("ProductTechnicalSheet", back_populates="product", uselist=False)

class ProductTechnicalSheet(Base):
    """
    Ficha Técnica del producto (Definida en Catalog para evitar circularidad).
    """
    __tablename__ = "product_technical_sheets"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    
    # Masas vinculadas (Referencias por ID para evitar circularidad profunda en modelos)
    primary_mass_id = Column(Integer, ForeignKey("doughs.id"), nullable=True)
    primary_mass_grams = Column(Float, nullable=True)
    
    secondary_mass_id = Column(Integer, ForeignKey("doughs.id"), nullable=True)
    secondary_mass_grams = Column(Float, nullable=True)
    
    tertiary_mass_id = Column(Integer, ForeignKey("doughs.id"), nullable=True)
    tertiary_mass_grams = Column(Float, nullable=True)
    
    weight_per_piece = Column(Float, nullable=True) # Peso total final sugerido
    baking_temp_top = Column(Float, nullable=True)
    baking_temp_bottom = Column(Float, nullable=True)
    baking_time_min = Column(Integer, nullable=True)
    steam_seconds = Column(Integer, nullable=True)
    scoring_type = Column(String, nullable=True)
    
    forming_procedure = Column(Text, nullable=True)
    bom_extra = Column(JSON, nullable=True)

    preparation_time_min = Column(Integer, nullable=True)
    recipe_procedure = Column(Text, nullable=True)
    modifiers = Column(JSON, nullable=True)

    provider = Column(String, nullable=True)
    original_barcode = Column(String, nullable=True)
    unit_measure = Column(String, nullable=True)
    min_stock = Column(Integer, nullable=True)
    max_stock = Column(Integer, nullable=True)

    product = relationship("Product", back_populates="technical_sheet")

