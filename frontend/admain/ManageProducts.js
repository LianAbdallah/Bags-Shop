const productTableBody = document.getElementById('productTableBody');

const addProductModal = document.getElementById('addProductModal');
const openAddProductModalBtn = document.getElementById('openAddProductModal');
const closeAddProductModalBtn = document.getElementById('closeAddProductModal');

const editProductModal = document.getElementById('editProductModal');
const closeEditProductModalBtn = document.getElementById('closeEditProductModal');

const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

let productIdToDelete = null;
let currentCategoryFilter = 'all';

openAddProductModalBtn.onclick = () => {
  addProductModal.style.display = 'block';
};

closeAddProductModalBtn.onclick = () => {
  addProductModal.style.display = 'none';
};

closeEditProductModalBtn.onclick = () => {
  editProductModal.style.display = 'none';
};

cancelDeleteBtn.onclick = () => {
  confirmDeleteModal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == addProductModal) addProductModal.style.display = "none";
  if (event.target == editProductModal) editProductModal.style.display = "none";
  if (event.target == confirmDeleteModal) confirmDeleteModal.style.display = "none";
};

async function fetchProducts() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/productAdmin', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      let products = data.products;
      if (currentCategoryFilter !== 'all') {
        products = products.filter(p => p.category === currentCategoryFilter);
      }
      displayProducts(products);
    } else {
      alert('Failed to load products');
    }
  } catch (error) {
    alert('Error loading products: ' + error.message);
  }
}

function displayProducts(products) {
  productTableBody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category || '-'}</td>
      <td>${product.price}</td>
      <td>${product.description}</td>
      <td><img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover;"></td>
      <td>
        <button onclick="openEditModal('${product._id}')">Edit</button>
        <button onclick="openDeleteModal('${product._id}')">Delete</button>
      </td>
    `;
    productTableBody.appendChild(tr);
  });
}

function filterProducts(category, button) {
  currentCategoryFilter = category;
  document.querySelectorAll('.category-tabs button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  fetchProducts();
}

const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', async e => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('price', document.getElementById('productPrice').value);
  formData.append('category', document.getElementById('productCategory').value);
  formData.append('description', document.getElementById('productDescription').value);

  const imageFile = document.getElementById('productImageFile').files[0];
  if (imageFile) formData.append('image', imageFile);

  try {
    const res = await fetch('http://localhost:5000/productAdmin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert('Product added successfully');
      addProductForm.reset();
      addProductModal.style.display = 'none';
      fetchProducts();
    } else {
      alert('Failed to add product: ' + data.message);
    }
  } catch (error) {
    alert('Error adding product: ' + error.message);
  }
});

async function openEditModal(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/productAdmin/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!data.success) {
      alert('Product not found');
      return;
    }
    const product = data.product;

    document.getElementById('editProductId').value = product._id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category || 'women';
    document.getElementById('editProductDescription').value = product.description;

    editProductModal.style.display = 'block';
  } catch (error) {
    alert('Error fetching product: ' + error.message);
  }
}

const editProductForm = document.getElementById('editProductForm');
editProductForm.addEventListener('submit', async e => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const id = document.getElementById('editProductId').value;

  const formData = new FormData();
  formData.append('name', document.getElementById('editProductName').value);
  formData.append('price', document.getElementById('editProductPrice').value);
  formData.append('category', document.getElementById('editProductCategory').value);
  formData.append('description', document.getElementById('editProductDescription').value);

  const imageFile = document.getElementById('editProductImageFile').files[0];
  if (imageFile) formData.append('image', imageFile);

  try {
    const res = await fetch(`http://localhost:5000/productAdmin/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert('Product updated successfully');
      editProductForm.reset();
      editProductModal.style.display = 'none';
      fetchProducts();
    } else {
      alert('Failed to update product: ' + data.message);
    }
  } catch (error) {
    alert('Error updating product: ' + error.message);
  }
});

function openDeleteModal(id) {
  productIdToDelete = id;
  confirmDeleteModal.style.display = 'block';
}

confirmDeleteBtn.onclick = async () => {
  if (!productIdToDelete) return;
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:5000/productAdmin/${productIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      alert('Product deleted successfully');
      fetchProducts();
    } else {
      alert('Failed to delete product');
    }
  } catch (error) {
    alert('Error deleting product: ' + error.message);
  }

  confirmDeleteModal.style.display = 'none';
  productIdToDelete = null;
};

fetchProducts();

// const API_URL = 'http://localhost:5000/productAdmin';
// const token = localStorage.getItem('token'); // ✅ جلب التوكن من التخزين

// // تحقق أولي من وجود التوكن
// if (!token) {
//   alert("Access denied: Token not found. Please login again.");
//   window.location.href = '/login.html'; // أو أي صفحة تسجيل دخول
// }

// // جميع العناصر كما هي...
// const addProductModal = document.getElementById('addProductModal');
// const openAddProductModalBtn = document.getElementById('openAddProductModal');
// const closeAddProductModalBtn = document.getElementById('closeAddProductModal');
// const addProductForm = document.getElementById('addProductForm');
// const editProductModal = document.getElementById('editProductModal');
// const closeEditProductModalBtn = document.getElementById('closeEditProductModal');
// const editProductForm = document.getElementById('editProductForm');
// const confirmDeleteModal = document.getElementById('confirmDeleteModal');
// const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
// const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
// const productTableBody = document.getElementById('productTableBody');

// let products = [];
// let currentEditProductId = null;
// let currentDeleteProductId = null;

// // فتح مودال الإضافة
// openAddProductModalBtn.addEventListener('click', () => {
//   addProductModal.style.display = 'block';
// });

// // إغلاق المودالات
// closeAddProductModalBtn.addEventListener('click', () => {
//   addProductModal.style.display = 'none';
//   addProductForm.reset();
// });
// closeEditProductModalBtn.addEventListener('click', () => {
//   editProductModal.style.display = 'none';
//   editProductForm.reset();
// });
// cancelDeleteBtn.addEventListener('click', () => {
//   confirmDeleteModal.style.display = 'none';
// });

// // إضافة منتج جديد
// addProductForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const newProduct = {
//     name: document.getElementById('productName').value.trim(),
//     price: parseFloat(document.getElementById('productPrice').value),
//     category: document.getElementById('productCategory').value,
//     description: document.getElementById('productDescription').value.trim(),
//     image: document.getElementById('productImage').value.trim(),
//   };

//   try {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`, // ✅ توكن
//       },
//       body: JSON.stringify(newProduct),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       products.push(data.product);
//       renderProducts(products);
//       addProductModal.style.display = 'none';
//       addProductForm.reset();
//       alert('Product added successfully!');
//     } else {
//       alert(data.message || 'Failed to add product');
//     }
//   } catch (error) {
//     alert('Error: ' + error.message);
//   }
// });

// // جلب المنتجات
// async function fetchProducts() {
//   try {
//     const response = await fetch(API_URL, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`, // ✅ توكن
//       },
//     });

//     const data = await response.json();

//     if (response.ok) {
//       products = data.products;
//       renderProducts(products);
//     } else {
//       alert(data.message || 'Failed to fetch products');
//     }
//   } catch (error) {
//     alert('Error: ' + error.message);
//   }
// }

// // عرض المنتجات
// function renderProducts(productsList) {
//   productTableBody.innerHTML = '';
//   productsList.forEach((product) => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//       <td>${product.name}</td>
//       <td>${product.category}</td>
//       <td>$${product.price.toFixed(2)}</td>
//       <td>${product.description}</td>
//       <td><img src="${product.image}" alt="${product.name}" style="width: 50px;"/></td>
//       <td>
//         <button class="edit-btn" data-id="${product._id}">Edit</button>
//         <button class="delete-btn" data-id="${product._id}">Delete</button>
//       </td>
//     `;
//     productTableBody.appendChild(tr);
//   });

//   document.querySelectorAll('.edit-btn').forEach(btn => {
//     btn.addEventListener('click', openEditModal);
//   });

//   document.querySelectorAll('.delete-btn').forEach(btn => {
//     btn.addEventListener('click', openDeleteModal);
//   });
// }

// // فتح مودال التعديل
// function openEditModal(e) {
//   const id = e.target.dataset.id;
//   currentEditProductId = id;
//   const product = products.find(p => p._id === id);
//   if (!product) return alert('Product not found');

//   document.getElementById('editProductName').value = product.name;
//   document.getElementById('editProductPrice').value = product.price;
//   document.getElementById('editProductCategory').value = product.category;
//   document.getElementById('editProductDescription').value = product.description;
//   document.getElementById('editProductImage').value = product.image;

//   editProductModal.style.display = 'block';
// }

// // تعديل منتج
// editProductForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const updatedProduct = {
//     name: document.getElementById('editProductName').value.trim(),
//     price: parseFloat(document.getElementById('editProductPrice').value),
//     category: document.getElementById('editProductCategory').value,
//     description: document.getElementById('editProductDescription').value.trim(),
//     image: document.getElementById('editProductImage').value.trim(),
//   };

//   try {
//     const response = await fetch(`${API_URL}/${currentEditProductId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`, // ✅ توكن
//       },
//       body: JSON.stringify(updatedProduct),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       const index = products.findIndex(p => p._id === currentEditProductId);
//       if (index !== -1) {
//         products[index] = data.product;
//         renderProducts(products);
//       }
//       editProductModal.style.display = 'none';
//       editProductForm.reset();
//       alert('Product updated successfully!');
//     } else {
//       alert(data.message || 'Failed to update product');
//     }
//   } catch (error) {
//     alert('Error: ' + error.message);
//   }
// });

// // فتح مودال الحذف
// function openDeleteModal(e) {
//   currentDeleteProductId = e.target.dataset.id;
//   confirmDeleteModal.style.display = 'block';
// }

// // حذف المنتج
// confirmDeleteBtn.addEventListener('click', async () => {
//   try {
//     const response = await fetch(`${API_URL}/${currentDeleteProductId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`, // ✅ توكن
//       },
//     });

//     const data = await response.json();

//     if (response.ok) {
//       products = products.filter(p => p._id !== currentDeleteProductId);
//       renderProducts(products);
//       confirmDeleteModal.style.display = 'none';
//       alert('Product deleted successfully!');
//     } else {
//       alert(data.message || 'Failed to delete product');
//     }
//   } catch (error) {
//     alert('Error: ' + error.message);
//   }
// });

// // فلترة حسب الفئة
// function filterProducts(category, btn) {
//   document.querySelectorAll('.category-tabs button').forEach(button => {
//     button.classList.remove('active');
//   });
//   btn.classList.add('active');

//   if (category === 'all') {
//     renderProducts(products);
//   } else {
//     const filtered = products.filter(p => p.category === category);
//     renderProducts(filtered);
//   }
// }

// // تحميل المنتجات عند بدء الصفحة
// window.onload = () => {
//   fetchProducts();

//   window.addEventListener('click', (e) => {
//     if (e.target === addProductModal) {
//       addProductModal.style.display = 'none';
//       addProductForm.reset();
//     }
//     if (e.target === editProductModal) {
//       editProductModal.style.display = 'none';
//       editProductForm.reset();
//     }
//     if (e.target === confirmDeleteModal) {
//       confirmDeleteModal.style.display = 'none';
//     }
//   });
// };

