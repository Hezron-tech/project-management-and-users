// import { getUsers } from './../../backend/src/Controllers/users';
const project_name = document.getElementById(
  "project-name"
) as HTMLInputElement;
const project_description = document.getElementById(
  "project-description"
) as HTMLInputElement;
const project_date = document.getElementById(
  "project-date"
) as HTMLInputElement;
const add_project = document.getElementById("add-project") as HTMLButtonElement;
const project_email = document.getElementById(
  "employee-email"
) as HTMLInputElement;

interface User {
  username: string;
  email: string;
  password: string;
}

interface Project {
  name: string;
  description: string;
  date: string;
  user_id: string;
}

const projects = document.querySelector(".all") as HTMLDivElement;

class Admin {
  static getAdmin() {
    return new Admin();
  }
  constructor() {}

  display() {
    fetch("http://localhost:5000/users/all")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        projects.innerHTML = data
          .map((project: any) => {
            const id = project.id;

            return `
          <div class="pr">
              <h1>${project.name}</h1>
              <p>${project.description}</p>
              <p>Due on:  ${project.date}</p>
              <div class="btn">
              <button class=${id} id="delete-btn">Delete</button>
              <button>Update</button>
              </div>
          </div>
          `;
          })
          .join("");

        const del = document.querySelectorAll("#delete-btn")!;
        del.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            // e.preventDefault()
            const id = btn.className;

            this.deleteproject(id);
          });
        });
      });
  }

  public getUser = async () => {
    try {
      await fetch("http://localhost:5000/users/getUsers")
        .then((res) => res.json())
        .then((data) => {
          for (let singleData of data) {
            console.log(singleData.email);
            const employee_email = document.getElementById(
              "employee-email"
            ) as HTMLSelectElement;
            const option = document.createElement("option");
            option.value = singleData.user_id;
            option.innerText = singleData.email;
            employee_email.appendChild(option);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  project(name: string, description: string, date: string, user_id: string) {
    const prom = new Promise<{ error?: string; message?: string }>(
      (resolve, reject) => {
        fetch("http://localhost:5000/users/create/", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            name: name,
            description: description,
            date: date,
            user_id: user_id,
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

    prom.then((data) => this.display()).catch((err) => console.log(err));
  }

  // ****************************************************************************//
  deleteproject(id: string) {
    const prom = new Promise<{ error?: string; message?: string }>(
      (resolve, reject) => {
        fetch(`http://localhost:5000/users/${id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "DELETE",
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
      .then((data) => {})
      .catch((err) => {
        throw err;
      });

      this.display()
  }

  
}

add_project.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("helooo");

  const name = project_name.value;
  const description = project_description.value;
  const date = project_date.value;
  const user_id = project_email.value;
  project_name.value = "";
  project_description.value = "";
  project_date.value = "";
  project_email.value = "";

  if (name === "" || description === "" || date === "" || user_id === "") {
    project_name.style.border = "2px solid red";
    project_description.style.border = "2px solid red";
    project_date.style.border = "2px solid red";
    project_email.style.border = "2px solid red";
    //   validate.innerText = "Cannot Submit Empty Fields";
    //   validate.style.color = "Red";
    //   validate.style.textAlign = "center";

    let timer = setTimeout(() => {
      project_name.style.border = "none";
      project_description.style.border = "none";
      project_date.style.border = "none";
      project_email.style.border = "none";
      // validate.innerText = "";
      // validate.innerText = "";
    }, 2000);
  } else {
    Admin.getAdmin().project(name, description, date, user_id);
  }
});

Admin.getAdmin().display();

const getUser = new Admin();
getUser.getUser();
