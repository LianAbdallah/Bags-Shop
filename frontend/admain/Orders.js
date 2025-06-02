const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

const ordersTableBody = document.querySelector('#ordersTable tbody');
const orderDetailsDiv = document.getElementById('orderDetails');
let orders = [];

window.addEventListener("DOMContentLoaded", fetchOrders);

async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:5000/orderAdmin", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success) {
      orders = data.data;
      renderOrders();
    } else {
      alert("فشل في جلب الطلبات");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    alert("حدث خطأ أثناء جلب الطلبات");
  }
}

function renderOrders() {
  ordersTableBody.innerHTML = '';
  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order._id}</td>
      <td>${order.userId?.name || "N/A"}</td>
      <td>${order.userId?.email || "N/A"}</td>
      <td>${order.products.length}</td>
      <td>$${order.totalAmount}</td>
      <td><button onclick="showDetails('${order._id}')">View</button></td>
    `;
    ordersTableBody.appendChild(tr);
  });
}

function showDetails(orderId) {
  const order = orders.find(o => o._id === orderId);
  if (!order) return alert('Order not found.');

  document.getElementById('detailOrderId').textContent = order._id;
  document.getElementById('detailUserName').textContent = order.userId.name;
  document.getElementById('detailUserEmail').textContent = order.userId.email;
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
