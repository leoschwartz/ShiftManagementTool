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

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserAccessLevel] = useAtom(userAccessLevelAtom);
  const [, setUserId] = useAtom(userIdAtom);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await authenticateUser(email, password);
    if (data) {
      const token = data.token;
      const accessLevel = data.accessLevel;
      let redirectPath =
        accessLevel === 0
          ? "/schedule"
          : accessLevel === 1
          ? "/employeeList"
          : accessLevel === 2
          ? "/addNewUser"
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
    <section className="flex justify-center items-center mt-52">
      <div className="absolute inset-0 bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <div className="p-8 rounded shadow text-white bg-secondary text-center">
        <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={(ev) => onSubmit(ev)}>
          <div id="inputs" className="mb-4">
            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border border-gray-300 rounded px-2 py-1 text-primary"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="border border-gray-300 rounded px-2 py-1 text-primary"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
          </div>
          <button className="bg-forth hover:bg-fifth text-white px-4 py-2 rounded mx-auto">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
