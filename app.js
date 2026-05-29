// Mock dataset mimicking an API response
const productsDataset = [
    { id: 1, name: "Pro Wireless Headphones", category: "Electronics", price: 299 },
    { id: 2, name: "Ergonomic Mechanical Keyboard", category: "Electronics", price: 149 },
    { id: 3, name: "Smart Fitness Watch", category: "Fitness", price: 199 },
    { id: 4, name: "4K UltraHD Monitor", category: "Electronics", price: 449 },
    { id: 5, name: "Resistance Bands Set", category: "Fitness", price: 29 },
    { id: 6, name: "Waterproof Running Jacket", category: "Apparel", price: 89 },
    { id: 7, name: "Leather Travel Backpack", category: "Apparel", price: 120 },
    { id: 8, name: "High-Performance Gaming Laptop", category: "Electronics", price: 1199 },
    { id: 9, name: "Smart Phone", category: "Electronics", price: 500 }
];

// App State Management object
const state = {
    filters: {
        searchQuery: "",
        category: "all",
        maxPrice: 1200
    },
    viewMode: "grid"
};

// DOM Cache Elements
const productFeed = document.getElementById("product-feed");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const priceRange = document.getElementById("price-range");
const priceValTxt = document.getElementById("price-val");
const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");

const metricCount = document.getElementById("metric-count");
const metricAvg = document.getElementById("metric-avg");
const metricMax = document.getElementById("metric-max");

// Performance optimization: Debouncing Search
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Data Mutation and Filter logic
function filterData() {
    return productsDataset.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(state.filters.searchQuery.toLowerCase());
        const matchesCategory = state.filters.category === "all" || product.category === state.filters.category;
        const matchesPrice = product.price <= state.filters.maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
}

// Analytics and Metrics calculation logic
function calculateMetrics(filteredData) {
    const count = filteredData.length;
    if (count === 0) {
        metricCount.textContent = 0;
        metricAvg.textContent = "$0.00";
        metricMax.textContent = "$0.00";
        return;
    }
    
    const total = filteredData.reduce((acc, curr) => acc + curr.price, 0);
    const highest = filteredData.reduce((max, curr) => curr.price > max ? curr.price : max, 0);
    
    metricCount.textContent = count;
    metricAvg.textContent = `$${(total / count).toFixed(2)}`;
    metricMax.textContent = `$${highest.toFixed(2)}`;
}

// Render Logic UI update
function renderUI() {
    const filteredProducts = filterData();
    calculateMetrics(filteredProducts);
    
    // Manage View Layout Classes
    productFeed.className = state.viewMode === "grid" ? "product-grid" : "product-list";
    
    if (filteredProducts.length === 0) {
        productFeed.innerHTML = `<p style="padding:20px; color:#718096;">No products match your filter criteria.</p>`;
        return;
    }

    productFeed.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div>
                <h4>${product.name}</h4>
                <span class="category-badge">${product.category}</span>
            </div>
            <div class="product-meta">
                <span class="price-tag">$${product.price}</span>
            </div>
        </article>
    `).join("");
}

// User Action Events & Listeners
const processSearchInput = debounce((e) => {
    state.filters.searchQuery = e.target.value;
    renderUI();
});

searchInput.addEventListener("input", processSearchInput);

categorySelect.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderUI();
});

priceRange.addEventListener("input", (e) => {
    state.filters.maxPrice = Number(e.target.value);
    priceValTxt.textContent = e.target.value;
    renderUI();
});

gridBtn.addEventListener("click", () => {
    state.viewMode = "grid";
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    renderUI();
});

listBtn.addEventListener("click", () => {
    state.viewMode = "list";
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
    renderUI();
});

// Primary Initialization
renderUI();