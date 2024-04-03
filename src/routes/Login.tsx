import React from "react";
import { useNavigate } from "react-router";
import { authenticateUser } from "../api/authenticateUser";
import { useAtom } from "jotai";
import {
  userTokenAtom,
  userAccessLevelAtom,
  userIdAtom,
  homeRedirectAtom,
} from "../globalAtom";
import { Spinner } from "flowbite-react";
import Theme2 from "../components/theme/Theme2";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserAccessLevel] = useAtom(userAccessLevelAtom);
  const [, setUserId] = useAtom(userIdAtom);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = await authenticateUser(email, password);
    setIsLoading(false);
    if (data) {
      const token = data.token;
      const accessLevel = data.accessLevel;
      let redirectPath =
        accessLevel === 0
          ? "/schedule"
          : accessLevel === 1
          ? "/employeeList"
          : accessLevel === 2
          ? "/accountManager"
          : "/unauthorize";
      setUserToken(token);
      setUserAccessLevel(accessLevel);
      setUserId(data.userId);
      navigate(redirectPath);
    } else {
      alert("Wrong username or password");
    }
    setEmail("");
    setPassword("");
  };
  return (
    <section className="flex justify-center items-center min-h-screen relative">
      <Theme2 />
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Log in to your account 🔐
        </h1>
        <div
          id="alert-additional-content-1"
          className="p-4 mb-4 text-third border border-rose-300 rounded-lg bg-rose-50"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="flex-shrink-0 w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-medium">
              Login credentials for demo accounts
            </h3>
          </div>
          <div className="mt-2 mb-4 text-sm">
            This application is created as a closed system for an artificial
            company. You can use the following credentials to log in to the
            system:
            <ul className="mt-1.5 list-disc list-inside">
              <li>
                <strong>Admin account:</strong>
                <ul>
                  <li>Gmail: newuser@gmail.com</li>
                  <li>Password: 123456</li>
                </ul>
              </li>
              <li>
                <strong>Manager account:</strong>
                <ul>
                  <li>Gmail: testmanager@gmail.com </li>
                  <li>Password: 123456</li>
                </ul>
              </li>
              <li>
                <strong>Employee account:</strong>
                <ul>
                  <li>Gmail: testemp9@gmail.com </li>
                  <li>Password: 123456</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <form onSubmit={(ev) => onSubmit(ev)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 text-primary border rounded-lg focus:outline-none focus:border-primary"
              id="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 text-primary border rounded-lg focus:outline-none focus:border-primary"
              id="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>

          <div className="mt-6">
            {isLoading ? (
              <Spinner aria-label="Loading" color="pink" />
            ) : (
              <button className="w-full py-2 px-4 text-center rounded-lg bg-fifth text-white hover:bg-forth focus:outline-none">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
