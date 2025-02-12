document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");

    loadProducts(); 

    productForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

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
        productList.innerHTML = ""; 
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
                if (timeDiff === 1) {
                    alert(`Reminder: ${product.name} will expire in ${timeDiff} day!`);
                } else if (timeDiff === 0) {
                    alert(`Reminder: ${product.name} will expire today!`);
                } else {
                    alert(`Reminder: ${product.name} will expire in ${timeDiff} days!`);
                }
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
