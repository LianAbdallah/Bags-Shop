// 
 const API_URL = 'http://localhost:5000/orderUser/user-orders';
const token = localStorage.getItem('token'); // يجب حفظ التوكن بعد تسجيل الدخول

const ordersTableBody = document.querySelector('#ordersTable tbody');
const orderDetailsDiv = document.getElementById('orderDetails');

let currentOrders = [];  // هنا نخزن الطلبات كاملة

// تحميل الطلبات
async function fetchOrders() {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!data.success) return alert("Failed to load orders");

    currentOrders = data.orders;  // خزّن الطلبات كلها
    renderOrders(currentOrders);
  } catch (err) {
    console.error(err);
    alert("Error fetching orders.");
  }
}

// عرض الطلبات في الجدول
function renderOrders(orders) {
  ordersTableBody.innerHTML = '';
  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order._id}</td>
      <td>${order.products.length}</td>
      <td>$${order.totalAmount}</td>
      <td>
        <button onclick="showDetails('${order._id}')">View</button>
      </td>
    `;
    ordersTableBody.appendChild(tr);
  });
}

// عرض التفاصيل مباشرة من currentOrders (بدون fetch جديد)
function showDetails(orderId) {
  const order = currentOrders.find(o => o._id === orderId);
  if (!order) return alert("Order not found");

  document.getElementById('detailOrderId').textContent = order._id;
  document.getElementById('detailPaymentMethod').textContent = order.paymentMethod;
  document.getElementById('detailTotal').textContent = order.totalAmount;

  const productsList = document.getElementById('detailProducts');
  productsList.innerHTML = '';
  order.products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.productId.name} - $${p.productId.price} x ${p.quantity}`;
    productsList.appendChild(li);
  });

  orderDetailsDiv.style.display = 'block';
}

function closeDetails() {
  orderDetailsDiv.style.display = 'none';
}

// تحميل الطلبات عند فتح الصفحة
fetchOrders();

// const API_URL = 'http://localhost:5000/orderUser/user-orders';
// const token = localStorage.getItem('token'); // يجب حفظ التوكن بعد تسجيل الدخول

// const ordersTableBody = document.querySelector('#ordersTable tbody');
// const orderDetailsDiv = document.getElementById('orderDetails');

// // تحميل الطلبات
// async function fetchOrders() {
//   try {
//     const res = await fetch(API_URL, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     if (!data.success) return alert("Failed to load orders");

//     renderOrders(data.data);
//   } catch (err) {
//     console.error(err);
//     alert("Error fetching orders.");
//   }
// }

// // عرض الطلبات في الجدول
// function renderOrders(orders) {
//   ordersTableBody.innerHTML = '';
//   orders.forEach(order => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//       <td>${order._id}</td>
//       <td>${order.products.length}</td>
//       <td>$${order.totalAmount}</td>
//       <td>
//         <button onclick="showDetails('${order._id}')">View</button>
//         <button onclick="deleteOrder('${order._id}')">Delete</button>
//       </td>
//     `;
//     ordersTableBody.appendChild(tr);
//   });
// }

// // عرض التفاصيل
// async function showDetails(orderId) {
//   try {
//     const res = await fetch(`${API_URL}/${orderId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (!data.success) return alert("Failed to load order details");

//     const order = data.data;
//     document.getElementById('detailOrderId').textContent = order._id;
//     document.getElementById('detailPaymentMethod').textContent = order.paymentMethod;
//     document.getElementById('detailTotal').textContent = order.totalAmount;

//     const productsList = document.getElementById('detailProducts');
//     productsList.innerHTML = '';
//     order.products.forEach(p => {
//       const li = document.createElement('li');
//       li.textContent = `${p.productId.name} - $${p.productId.price} x ${p.quantity}`;
//       productsList.appendChild(li);
//     });

//     orderDetailsDiv.style.display = 'block';
//   } catch (err) {
//     console.error(err);
//     alert("Error loading order details");
//   }
// }

// function closeDetails() {
//   orderDetailsDiv.style.display = 'none';
// }


// // تحميل الطلبات عند فتح الصفحة
// fetchOrders();
