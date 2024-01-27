import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../globalAtom";
function Error404() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  return (
    <section className="relative" id="home">
      {/* Background design */}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        <div className="relative pt-36 ml-auto">
          <div className="lg:w-2/3 text-center mx-auto">
            <h1 className="text-forth  font-bold text-4xl md:text-5xl xl:text-6xl">
              404
            </h1>
            <p className="mt-8 text-secondary font-semibold">
              Look like you&apos;re lost, let&apos;s get you back home
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-y-4 gap-x-6">
              {isLoggedIn ? (
                <Link
                  to="/schedule"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-fifth before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                >
                  <span className="relative text-base font-semibold text-primary ">
                    Go back to your dashboard
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-fifth before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                >
                  <span className="relative text-base font-semibold text-primary ">
                    Log in
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Error404;
