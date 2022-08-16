const signUpButton = document.getElementById("signUp") as HTMLButtonElement;
const signInButton = document.getElementById("signIn") as HTMLButtonElement;
const container = document.getElementById("container") as HTMLButtonElement;
const username = document.getElementById("username") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const validate = document.getElementById("validation") as HTMLInputElement;
const registerbtn = document.getElementById("register") as HTMLButtonElement;
const loginbtn = document.getElementById("loginbutton") as HTMLButtonElement;
const loginemail= document.getElementById("loginemail") as HTMLInputElement
const loginpassword= document.getElementById("loginpassword") as HTMLInputElement

window.onload = function () {
  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });
};

class Users {
  static getUser() {
    return new Users();
  }

  constructor() {}

  register(username: string, email: string, password: string) {
    const prom = new Promise<{ error?: string; message?: string }>(
      (resolve, reject) => {
        fetch("http://localhost:5000/users/register", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            username:username,
            email: email,
            password: password,
          }),
        })
          .then((res) => {
            resolve(res.json());
          })
          .catch((err) => {
            reject(err);
          });
      }
    );

    prom
      .then((data) => {
        console.log(data);
        if (data.error) {
          validate.innerText = "Invalid Credentials";
        } else {
          validate.innerText = "Registration Successful!";
        }
      })
      .catch((err) => {
        throw err;
      });
  }


  //login
  loginUser(email: string, password: string) {
    fetch("http://localhost:5000/users/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        
        
        data.token ? localStorage.setItem("token", data.token) : "";
        data.user ? localStorage.setItem("user", JSON.stringify(data.user)) : "";
        if (data.error) {
           alert("Invalid Credentials")
        } else {
          alert("login succesfully")
             this.redirect();
        }
  
        if(data.user){
          if (data.user.Role === "Admin") {
            location.href = "admin.html";
          } else {
            location.href = "user.html";
          }

          
        }
      })
      .catch(console.log)
  
  }
  redirect() {
    const token = localStorage.getItem("token") as string;
    new Promise<{ username: string; Role: string }>((resolve, reject) => {
      fetch("http://localhost:5000/users/checkuser", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        method: "GET",
      })
        .then((res) => resolve(res.json()))
        .catch((err) => reject(err));
    }).then((data) => {
     
      console.log(data.username);
      if (data.Role ==="user") {
        location.href ="user.html";
      } else {
        location.href ="admin.html";
        console.log(data.username);
      }
    });
  }
}

registerbtn.addEventListener("click", () => {
  console.log("heloo");

  const nameinput = username.value;
  const emailinput = email.value;
  const passwordInput = password.value;
  username.value = "";
  email.value = "";
  password.value = "";

  if (nameinput === "" || emailinput == "" || passwordInput == "") {
    username.style.border = "2px solid red";
    email.style.border = "2px solid red";
    password.style.border = "2px solid red";
    validate.innerText = "Cannot Submit Empty Fields";
    validate.style.color = "Red";
    validate.style.textAlign = "center";
    let timer = setTimeout(() => {
      username.style.border = "none";
      email.style.border = "none";
      password.style.border = "none";
      validate.innerText = "";
      validate.innerText = "";
    }, 2000);
  } else {
    Users.getUser().register(nameinput, emailinput, passwordInput);
  }
});

loginbtn.addEventListener("click", (e) => {
  e.preventDefault()


  // console.log(Users.getUser().redirect());
  
  const emailinput = loginemail.value;
  const pass = loginpassword.value;

  if (emailinput === "" || pass === "") {
    console.log("Please fill in all Fields");
  } else {
    Users.getUser().loginUser(emailinput, pass);
  }
});







