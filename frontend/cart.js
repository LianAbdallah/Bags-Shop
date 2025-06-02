const apiUrl = "http://localhost:5000/cartUser"; // رابط API السلة
const ORDER_API_URL  = "http://localhost:5000/orderUser";

const token = localStorage.getItem("token"); // جلب التوكن من localStorage

if (!token) {
  alert("يرجى تسجيل الدخول أولاً");
  window.location.href = "/login.html";
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

let currentCartId = null; // سيتم تخزين cartId هنا بعد تحميل السلة

// تحميل بيانات السلة
async function fetchCart() {
  try {
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) throw new Error("فشل في تحميل السلة");
    const result = await response.json();

    if (!result.success || !result.data) {
      console.log("السلة فارغة أو غير موجودة");
      displayEmptyCart();
      return;
    }

    const cart = result.data;
    currentCartId = cart._id; // حفظ cartId لاستخدامه لاحقًا
    displayCart(cart);
  } catch (error) {
    console.error("Error loading cart:", error);
    displayEmptyCart();
  }
}

// عرض السلة في الصفحة
function displayCart(cart) {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (!cart.products || cart.products.length === 0) {
    displayEmptyCart();
    return;
  }

  cart.products.forEach(item => {
    const product = item.productId; // هذا هو الكائن المعبأ
    const quantity = item.quantity;

    const productElem = document.createElement("div");
    productElem.className = "cart-item";
    productElem.innerHTML = `
      <h4>${product.name}</h4>
      <p>السعر: $${product.price}</p>
      <p>
        الكمية: <input type="number" min="1" value="${quantity}"
        data-productid="${product._id}" class="quantity-input">
      </p>
      <button data-productid="${product._id}" class="remove-btn">حذف</button>
    `;
    cartContainer.appendChild(productElem);
  });

  const totalElem = document.createElement("h3");
  totalElem.textContent = `المجموع الكلي: $${cart.totalAmount.toFixed(2)}`;
  cartContainer.appendChild(totalElem);

  attachEventListeners();
}

// عرض رسالة سلة فارغة
function displayEmptyCart() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "<p>السلة فارغة</p>";
}

// تحديث الكمية
async function updateQuantity(productId, quantity) {
  try {
    const response = await fetch(`${apiUrl}/update`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        productId,
        quantity
      }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || "فشل في تحديث الكمية");
    fetchCart();
  } catch (error) {
    alert("حدث خطأ أثناء تحديث الكمية: " + error.message);
  }
}

// حذف منتج من السلة
async function removeFromCart(productId) {
  if (!currentCartId) {
    alert("لا يمكن حذف المنتج: السلة غير معروفة");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${currentCartId}/${productId}`, {
      method: "DELETE",
      headers
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "فشل في حذف المنتج");
    fetchCart();
  } catch (error) {
    alert("حدث خطأ أثناء حذف المنتج: " + error.message);
  }
}

// ربط الأحداث بعناصر الصفحة
function attachEventListeners() {
  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", e => {
      const newQty = parseInt(e.target.value);
      const productId = e.target.getAttribute("data-productid");
      if (newQty > 0) {
        updateQuantity(productId, newQty);
      } else {
        e.target.value = 1;
      }
    });
  });

  document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", e => {
      const productId = e.target.getAttribute("data-productid");
      if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        removeFromCart(productId);
      }
    });
  });
}

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", fetchCart);

// عناصر المودال
const modal = document.getElementById("confirmationModal");
const checkoutButton = document.getElementById("checkoutButton");
const closeModalBtn = document.getElementById("closeModal");
const confirmPurchaseBtn = document.getElementById("confirmPurchase");
const confirmationMessage = document.getElementById("confirmationMessage");

// فتح المودال
checkoutButton.addEventListener("click", () => {
  modal.style.display = "block";
});

// إغلاق المودال
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

confirmPurchaseBtn.addEventListener("click", async () => {
  if (!currentCartId) {
    alert("لا توجد سلة حالياً!");
    return;
  }

  const paymentMethod = document.getElementById("paymentMethod")?.value || "cash";

  try {
    // تأكيد الشراء عبر POST على /cartUser/confirm
    const response = await fetch(`${ORDER_API_URL }/orders/from-cart`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cartId: currentCartId, paymentMethod }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "فشل تأكيد الشراء");
    }

    // بعد التأكيد، جلب الطلبات الخاصة بالمستخدم من /orderUser (مع Authorization)
    const ordersResponse = await fetch(`${ORDER_API_URL}/user-orders`, {
      method: "GET",
      headers,  // نرسل هيدر التوكن عشان الميدلوير userAuth يشتغل
    });

    const ordersData = await ordersResponse.json();

    if (!ordersResponse.ok || !ordersData.success) {
      throw new Error("فشل في جلب الطلبات بعد الشراء");
    }

    // تخزين الطلبات في localStorage لاستخدامها في صفحة order.html
    localStorage.setItem("latestOrders", JSON.stringify(ordersData.orders));

    // إخفاء المودال والانتقال لصفحة الطلبات
    modal.style.display = "none";
    window.location.href = "order.html";

  } catch (error) {
    alert("حدث خطأ أثناء تأكيد الشراء: " + error.message);
  }
});

