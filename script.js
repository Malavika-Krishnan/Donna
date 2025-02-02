document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");

    loadProducts(); // Load products on page load

    productForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        const productName = document.getElementById("productName").value;
        const mfgDate = document.getElementById("mfgDate").value;
        const expDate = document.getElementById("expDate").value;

        if (!productName || !mfgDate || !expDate) {
            alert("Please fill all fields.");
            return;
        }

        const product = {
            name: productName,
            manufacturingDate: mfgDate,
            expiryDate: expDate
        };

        saveProduct(product);
        productForm.reset();
    });

    function saveProduct(product) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));

        loadProducts();
    }

    function loadProducts() {
        productList.innerHTML = ""; // Clear the list
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const today = new Date();

        products = products.filter(product => {
            const expDate = new Date(product.expiryDate);
            return expDate >= today;
        });

        localStorage.setItem("products", JSON.stringify(products));

        products.forEach(product => {
            const expDate = new Date(product.expiryDate);
            const timeDiff = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

            const li = document.createElement("li");
            li.innerHTML = `${product.name} - Expires on: ${product.expiryDate}`;

            if (timeDiff <= 2 && timeDiff >= 0) {
                li.classList.add("expiring-soon");
                //Custom Popup
                const popup = document.createElement('div');
                popup.classList.add('custom-popup');
                popup.innerHTML = `
                    <div class="popup-content">
                        <span class="close-button">&times;</span>
                        <p>The product ${product.name} is going to get expired ${timeDiff === 1 ? 'within a span of 1 day!' : timeDiff === 0 ? 'today!' : `in ${timeDiff} days!`}</p>
                    </div>
                `;
                document.body.appendChild(popup);
                const closeButton = popup.querySelector('.close-button');
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(popup);
                });
                popup.addEventListener('click', (event) => {
                    if (event.target === popup) {
                        document.body.removeChild(popup);
                    }
                });

            } else if (timeDiff < 0) {
                li.classList.add("expired");
            }

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                deleteProduct(product);
            });
            li.appendChild(deleteButton);
            productList.appendChild(li);
        });
    }

    function deleteProduct(productToDelete) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products = products.filter(product => JSON.stringify(product) !== JSON.stringify(productToDelete));
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
    }

    setInterval(loadProducts, 60000); // Update every minute
});