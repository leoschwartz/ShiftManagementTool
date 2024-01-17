import React from "react";

function Login(props) {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(
      (event.target as HTMLFormElement).email.value,
      (event.target as HTMLFormElement).password.value
    );
    props.setIsLoggedIn(true);
  };
  return (
    <section className="flex justify-center items-center mt-52">
      <div className="absolute inset-0 bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <div className="p-8 rounded shadow text-primary bg-secondary">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
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
                className="border border-gray-300 rounded px-2 py-1"
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
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
          <button className="bg-forth hover:bg-fifth text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
