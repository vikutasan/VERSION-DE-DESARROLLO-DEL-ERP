from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    icon = Column(String, nullable=True)
    vision_enabled = Column(Boolean, default=False)

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

