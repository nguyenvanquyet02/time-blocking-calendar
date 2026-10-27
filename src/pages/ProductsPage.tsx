import { memo, useCallback, useState } from "react";

type Product = {
    id: number;
    name: string;
    price: number;
};

const PRODUCTS: Product[] = [
    { id: 1, name: "Keyboard", price: 500_000 },
    { id: 2, name: "Mouse", price: 200_000 },
    { id: 3, name: "Monitor", price: 3_000_000 },
];

function Header({ onOpenCart }: { onOpenCart: () => void }) {
    console.log("Header render");

    return <button onClick={onOpenCart}>Open cart</button>;
}

function Sidebar() {
    console.log("Sidebar render");

    return <aside>Categories</aside>;
}

const HeaderMemo = memo(Header)
const SidebarMemo = memo(Sidebar)

function ProductItem({
    product,
    onAddToCart,
}: {
    product: Product;
    onAddToCart: (id: number) => void;
}) {
    console.log("ProductItem render:", product.name);

    return (
        <article>
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()} VND</p>
            <button onClick={() => onAddToCart(product.id)}>
                Add to cart
            </button>
        </article>
    );
}
const ProductItemMemo = memo(ProductItem)


function ProductList({
    products,
    onAddToCart,
}: {
    products: Product[];
    onAddToCart: (id: number) => void;
}) {
    console.log("ProductList render");
    return (
        <section>
            {products.map((product) => (
                <ProductItemMemo
                    key={product.id}
                    product={product}
                    onAddToCart={() => onAddToCart(product.id)}
                />
            ))}
        </section>
    );
}

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [cartOpen, setCartOpen] = useState(false);

    const filteredProducts = PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
    );

    console.log("ProductsPage render");

    const handleOpenCart = useCallback(() => setCartOpen(true), [])
    const handleAddToCart = useCallback((id) => console.log("Add product:", id), [])

    return (
        <div>
            <HeaderMemo onOpenCart={handleOpenCart} />
            <SidebarMemo />

            <main>
                <input
                    placeholder="Search products..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <ProductList
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                />
            </main>

            {cartOpen && <p>Cart is open</p>}
        </div>
    );
}