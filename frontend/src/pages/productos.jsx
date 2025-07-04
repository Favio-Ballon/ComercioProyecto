import { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiX } from "react-icons/fi";
import { Header } from "../components/header";
import axios from "axios";
import { ProductoService } from "../services/ProductoService";

const Productos = () => {
  const [notification, setNotification] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones Pro",
      price: 299.99,
      category: "Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      rating: 4.5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategorias();
  }, []);

  useEffect(() => {
    getProductos();
  }, [categories]);

  const getCategorias = async () => {
    try {
      axios
        .get("http://localhost:8000/comercio/categorias/")
        .then((response) => {
          const fetchedCategories = response.data;
          setCategories(fetchedCategories);
          console.log("Fetched categories:", fetchedCategories);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getProductos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/comercio/productos/"
      );
      const fetchedProducts = response.data.map((product) => ({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        description: product.descripcion,
        stock: product.stock,
        category: product.categoria.nombre,
        image: product.imagen,
      }));
      setProducts(fetchedProducts);
      console.log("Fetched products:", fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAdd = async (productId) => {
    try {
      const result = await new ProductoService().handleAddToCart(productId);
      if (!result) {
        setNotification("No se pudo añadir el producto al carrito.");
        setTimeout(() => setNotification(""), 2500);
        return;
      } else {
        setNotification("Producto añadido al carrito exitosamente.");
        setTimeout(() => setNotification(""), 2500);
      }

      console.log(result);
    } catch (error) {
      console.error("Error al añadir producto al carrito:", error);
      setNotification("Ocurrió un error al añadir el producto.");
      setTimeout(() => setNotification(""), 2500);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 mt-15">
            {/* Sidebar */}
            <div
              className={`md:w-64 bg-card p-6 rounded-lg shadow-sm ${
                isSidebarOpen ? "fixed inset-0 z-50 md:relative" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold">Filtro</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden text-accent hover:text-primary"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-heading mb-3">Categorias</h3>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.nombre)}
                        value={category.nombre}
                        onChange={() => handleCategoryToggle(category.nombre)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>{category.nombre}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h3 className="font-heading mb-3">Rango de Precio</h3>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-accent">
                    <span>{priceRange.min} Bs</span>
                    <span>{priceRange.max} Bs</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading mb-3">Filtrar por</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-sm border-input bg-card p-2"
                  >
                    <option value="default">Por defecto</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-sm border border-input focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-accent text-lg">No products found</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105"
                    >
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-scale-down"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-lg mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-m font-bold">
                            {product.price} Bs
                          </span>
                          <button
                            onClick={() => handleAdd(product.id)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-opacity-90 transition-colors"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <FiShoppingCart className="inline-block mr-2" />
                            Agregar al carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all animate-fade-in">
          {notification}
        </div>
      )}
    </>
  );
};

export default Productos;
