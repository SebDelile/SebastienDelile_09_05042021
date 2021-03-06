// /** @module containers/Login */
import { ROUTES_PATH } from "../constants/routes.js";
export let PREVIOUS_LOCATION = "";

// we use a class so as to test its methods in e2e tests
export default class Login {
  /**
   * Class Login - Manages the login feature
   * @class Login
   * @param {Object} document - the document (HTML page)
   * @param {object} localStorage - windows.localStorage, used to store user's login info
   * @param {function} onNavigate - the function which is called to navigate to another page
   * @param {string} PREVIOUS_LOCATION - empty string, then the pathway to go on go-back navigation
   * @param {object} firestore - instance of the firestore class
   */
  constructor({ document, localStorage, onNavigate, PREVIOUS_LOCATION, firestore }) {
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION;
    this.firestore = firestore;
    const formEmployee = this.document.querySelector(`form[data-testid="form-employee"]`);
    formEmployee.addEventListener("submit", this.handleSubmitEmployee);
    const formAdmin = this.document.querySelector(`form[data-testid="form-admin"]`);
    formAdmin.addEventListener("submit", this.handleSubmitAdmin);
  }

  /**
   * handle the click on the login as employee,
   * build the user object and put it in localStorage
   * call the firebase to check the exsitence of user
   * if doesn't exist, ask the creation of user
   * set Bills page as PREVIOUS_LOCATION
   * navigate to Bills page
   * @function
   * @memberof Login
   */
  handleSubmitEmployee = (e) => {
    const user = {
      type: "Employee",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="employee-password-input"]`).value,
      status: "connected",
    };
    this.localStorage.setItem("user", JSON.stringify(user));
    const userExists = this.checkIfUserExists(user);
    if (!userExists) this.createUser(user);
    e.preventDefault();
    this.onNavigate(ROUTES_PATH["Bills"]);
    this.PREVIOUS_LOCATION = ROUTES_PATH["Bills"];
    PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
    this.document.body.style.backgroundColor = "#fff";
  };

  /**
   * handle the click on the login as admin,
   * build the user object and put it in localStorage
   * call the firebase to check the exsitence of user
   * if doesn't exist, ask the creation of user
   * set Dashboard page as PREVIOUS_LOCATION
   * navigate to Dashboard page
   * @function
   * @memberof Login
   */
  handleSubmitAdmin = (e) => {
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
      status: "connected",
    };
    this.localStorage.setItem("user", JSON.stringify(user));
    const userExists = this.checkIfUserExists(user);
    if (!userExists) this.createUser(user);
    e.preventDefault();
    this.onNavigate(ROUTES_PATH["Dashboard"]);
    this.PREVIOUS_LOCATION = ROUTES_PATH["Dashboard"];
    PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
    document.body.style.backgroundColor = "#fff";
  };

  /**
   * check if the user exists in the firebase,
   * log in the console if the user exists
   * @function
   * @async
   * @memberof Login
   * @param {object} user - the user's info
   * @return {boolean} - true if user exists, false otherwise
   */
  // not need to cover this function by tests
  checkIfUserExists = (user) => {
    if (this.firestore) {
      this.firestore
        .user(user.email)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log(`User with ${user.email} exists`);
            return true;
          } else {
            return false;
          }
        })
        .catch((error) => error);
    } else {
      return null;
    }
  };

  /**
   * ask the creation of user in the firebase,
   * log in the console the creation confirmation
   * @function
   * @async
   * @memberof Login
   * @param {object} user - the user's info
   */
  // not need to cover this function by tests
  createUser = (user) => {
    if (this.firestore) {
      this.firestore
        .users()
        .doc(user.email)
        .set({
          type: user.type,
          name: user.email.split("@")[0],
        })
        .then(() => console.log(`User with ${user.email} is created`))
        .catch((error) => error);
    } else {
      return null;
    }
  };
}
