interface UserProject {
  id: string;
  title: string;
  description: string;
  user_id: string;
  date: string;
}

class Projects {
  constructor() {}
  displayProject(id:string) {
    fetch(`http://localhost:5000/users/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        projects.innerHTML = data
          .map((project: any) => {
            const id = project.id;
            return `
          <div class="projo">
              <h1>${project.name}</h1>
              <p>${project.description}</p>
              <p>Due on:  ${project.date}</p>
              <div class="btn">
              <button class=${id} id="complete-btn">Complete</button>
              
              </div>
          </div>
          `;
          })
          .join("");
      });
  }
  checkProjects() {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "");
      this.displayProject(user?.user_id);
    } catch (error) {}
  }
 ;
}

const project = new Projects();

project.checkProjects();
