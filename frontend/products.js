// 
// عناصر المودال
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const closeBtn = document.querySelector(".close");
const addToCartBtn = document.getElementById("addToCartBtn"); // مهم

let selectedProduct = null;

// جلب المنتجات عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/productUser", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const products = await res.json();

    const womenContainer = document.getElementById("women-container");
    const menContainer = document.getElementById("men-container");
    const kidsContainer = document.getElementById("kids-container");

    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.price} JD</p>
        <button class="view-details">View Details</button>
      `;

      const category = product.category.toLowerCase();
      if (category === "women") womenContainer.appendChild(card);
      else if (category === "men") menContainer.appendChild(card);
      else if (category === "kids") kidsContainer.appendChild(card);

      // عند الضغط على "عرض التفاصيل"
      card.querySelector(".view-details").addEventListener("click", () => {
        modalImage.src = product.image;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `${product.price} JD`;
        modalDescription.textContent = product.description || "No description available.";
        modal.style.display = "block";
        selectedProduct = product;
      });
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
});

// زر إضافة للسلة
addToCartBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // منع الانتقال الفوري

  if (!selectedProduct) {
    alert("يرجى اختيار منتج أولاً");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("يرجى تسجيل الدخول أولاً");
    window.location.href = "/login.html";
    return;
  }

  let userId;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Decoded Token Payload:", payload);
    userId = payload.userId || payload.id || payload._id ;
  } catch (err) {
    alert("توكن غير صالح");
    return;
  }

  // بيانات المنتج
  const quantity = 1;
  const totalAmount = selectedProduct.price * quantity;
  const products = [{ productId: selectedProduct._id, quantity }];
  const paymentMethod = "cash";

  // ✅ اطبع للتأكد
 console.log({
  userId,
  products,
  paymentMethod,
  totalAmount
 });

  try {
    const response = await fetch("http://localhost:5000/cartUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        products,
        paymentMethod,
        totalAmount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "فشل في إضافة المنتج للسلة");
    }

    // ✅ النجاح: الانتقال إلى صفحة السلة
    window.location.href = "cart.html";
  } catch (error) {
    console.error("❌ فشل في الإضافة للسلة:", error);
    alert("فشل في إضافة المنتج للسلة: " + error.message);
  }
});


// إغلاق المودال
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// إغلاق المودال عند الضغط خارج النافذة
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
