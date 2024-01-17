import React from "react";

function Homepage() {
  return (
    <section className="relative" id="home">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52"
      >
        <div className="blur-[106px] h-1/3 bg-gradient-to-br from-primary to-secondary opacity-50 "></div>
        <div className="blur-[106px] h-3/4 bg-gradient-to-r from-forth to-fifth opacity-30"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        <div className="relative pt-36 ml-auto">
          <div className="lg:w-2/3 text-center mx-auto">
            <h1 className="text-primary  font-bold text-4xl md:text-5xl xl:text-6xl">
              Renovate shift management system with{" "}
              <span className="text-forth ">innovations.</span>
            </h1>
            <p className="mt-8 text-secondary font-semibold">
              Manage and oversee your employee&apos; work schedules with
              integrated work performance analysis and prediction.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-y-4 gap-x-6">
              <a
                href="#"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-fifth before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
              >
                <span className="relative text-base font-semibold text-primary ">
                  Get started
                </span>
              </a>
              <a
                href="#"
                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-fifth before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
              >
                <span className="relative text-base font-semibold text-primary ">
                  Log in
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Homepage;
