function showForm(formId) {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById(formId).classList.remove("hidden");
}

document
  .getElementById("login-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email === "" || password === "") {
      showErrorMessageSign("Please fill in both fields.");
      return;
    }

    // إرسال الطلب إلى الـ API للتحقق من بيانات المستخدم
    fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        if (data.token) {
          // حفظ التوكن
          localStorage.setItem("token", data.token);

          // استخراج بيانات المستخدم من التوكن
          try {
            const decoded = jwt_decode(data.token);
            console.log("Decoded Token:", decoded);

            // حفظ userId في localStorage
            if (decoded._id) {
              localStorage.setItem("userId", decoded._id);
            } else if (decoded.id) {
              localStorage.setItem("userId", decoded.id);
            } else if (decoded.userId) {
              localStorage.setItem("userId", decoded.userId);
            } else {
              console.warn("User ID not found in token payload.");
            }

            // التوجيه بناءً على الدور
            if (decoded.role === "admin" || decoded.isAdmin === true) {
              window.location.href = "../admain/ManageProducts.html";
            } else {
              window.location.href = "../Homepage.html";
            }
          } catch (err) {
            console.error("Error decoding token:", err);
            showErrorMessageSign("Invalid token format.");
          }
        } else {
          showErrorMessageSign(data.message || "Incorrect email or password.");
        }
      })
      .catch((error) => {
        showErrorMessageSign("An error occurred while logging in.");
        console.error(error);
      });
  });

function showErrorMessageSign(message) {
  const errorMessageDiv = document.getElementById("error-message-sign");
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("hidden");

  setTimeout(() => {
    errorMessageDiv.classList.add("hidden");
  }, 3000);
}

function showErrorMessageReg(message) {
  const errorMessageDiv = document.getElementById("error-message-reg");
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("hidden");

  setTimeout(() => {
    errorMessageDiv.classList.add("hidden");
  }, 3000);
}

document
  .getElementById("signup-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const userName = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("phone-number").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!fullName || !userName || !email || !password || !confirmPassword) {
      showErrorMessageReg("Please fill in all required fields!");
      return;
    }

    if (password !== confirmPassword) {
      showErrorMessageReg("Password and Confirm Password do not match!");
      return;
    }

    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, userName, email, phone, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          showErrorMessageSign("Account created successfully! please login again");
          showForm("login-form");
        } else {
          showErrorMessageReg(data.message || "There was an error during registration.");
        }
      })
      .catch((error) => {
        showErrorMessageReg("An error occurred while creating the account.");
        console.error(error);
      });
  });

// التحقق من وجود التوكن عند تحميل الصفحة مع فك التوكن وعرضه بأمان
const token = localStorage.getItem("token");
if (token) {
  try {
    const decoded = jwt_decode(token);
    console.log("Stored token decoded:", decoded);
  } catch (error) {
    console.error("Invalid token in localStorage:", error);
  }
} else {
  console.log("No token found in localStorage");
}


