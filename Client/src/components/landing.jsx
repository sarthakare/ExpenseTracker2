import "../assets/styles/landing_bar_animations.css";
import "../assets/styles/landing_pie_animations.css";
import "../assets/styles/landing_graph_animations.css";
import logo from "../assets/images/icon-0.png";

const Landing = () => {
  return (
    <div className="h-full w-full text-gray-800 grid grid-cols-1 sm:grid-cols-3 overflow-x-hidden">
      <nav className="bg-[linear-gradient(180deg,#6051c0,#85439b)] p-4 sm:p-6 sm:col-span-3">
        <div className="container mx-auto flex justify-center items-center sm:justify-between flex-wrap">
          <div className="flex items-center">
            <img
              className="max-w-[40px] max-h-[40px] sm:max-w-[50px] sm:max-h-[50px]"
              src={logo}
              alt=""
            />
            <h1 className="text-white text-2xl sm:text-3xl font-bold ml-3 sm:ml-5">
              TrackEx
            </h1>
          </div>
          <ul className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-0">
            <li>
              <a href="#features" className="text-white hover:text-black">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="text-white hover:text-black">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="text-white hover:text-black">
                Contact
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="bg-transparent text-white py-1 px-3 sm:py-2 sm:px-4 rounded hover:bg-white hover:text-black transition duration-300"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <header className="bg-gray-100 py-12 sm:py-20 text-center sm:col-span-3 px-4">
        <h1 className="text-3xl sm:text-5xl font-bold">TrackEx</h1>
        <p className="text-lg sm:text-xl mt-2 sm:mt-4">
          Where project expenses meet smart management.
        </p>
        <button className="text-white px-4 sm:px-5 py-2 rounded-full mt-5 bg-[linear-gradient(135deg,#6051c0,#85439b)] hover:bg-[linear-gradient(135deg,#85439b,#6051c0)]">
          <a href="/register">Get Started</a>
        </button>
      </header>

      <section id="features" className="py-12 sm:py-16 sm:col-span-3 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-white bg-[linear-gradient(135deg,#6051c0,#85439b)] p-6 sm:p-8 rounded-lg shadow-lg hover:bg-[linear-gradient(135deg,#85439b,#6051c0)]">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Smart Expense Tracking
              </h3>
              <figure>
                <div className="bar-container">
                  <div className="bar bar1">
                    <div className="bar-label">25%</div>
                  </div>
                  <div className="bar bar2">
                    <div className="bar-label">35%</div>
                  </div>
                  <div className="bar bar3">
                    <div className="bar-label">45%</div>
                  </div>
                  <div className="bar bar4">
                    <div className="bar-label">55%</div>
                  </div>
                  <div className="bar bar5">
                    <div className="bar-label">70%</div>
                  </div>
                </div>
              </figure>
              <p>
                Track every project’s expenses effortlessly and get real-time
                insights.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Category-wise Breakdown
              </h3>
              <figure>
                <svg viewBox="0 0 63.6619772368 63.6619772368">
                  <circle
                    className="pie1"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                  <circle
                    className="pie2"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                  <circle
                    className="pie3"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                  <circle
                    className="pie4"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                  <circle
                    className="pie5"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                  <circle
                    className="pie6"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                  <circle
                    className="pie7"
                    cx="31.8309886184"
                    cy="31.8309886184"
                    r="15.9154943092"
                  />
                </svg>
              </figure>
              <p>
                Get detailed reports with category-wise expense tracking for
                better clarity.
              </p>
            </div>
            <div className="text-white bg-[linear-gradient(135deg,#6051c0,#85439b)] p-6 sm:p-8 rounded-lg shadow-lg hover:bg-[linear-gradient(135deg,#85439b,#6051c0)]">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                Member-wise Insights
              </h3>
              <figure>
                <div className="chart-container">
                  <div className="y-axis"></div>
                  <div className="x-axis"></div>
                  <svg className="line-graph" viewBox="0 0 100 100">
                    <polyline
                      className="line line1"
                      points="0,110 20,50 40,60 60,40 80,30 100,20"
                    />
                    <polyline
                      className="line line2"
                      points="0,110 20,70 40,70 60,30 80,25 100,15"
                    />
                    <polyline
                      className="line line3"
                      points="0,110 20,90 40,75 60,50 80,50 100,40"
                    />
                    <polyline
                      className="line line4"
                      points="0,110 20,85 40,80 60,55 80,40 100,25"
                    />
                  </svg>
                </div>
              </figure>
              <p>
                Analyze expenses by individual members assigned to the project.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="py-12 sm:py-16 bg-gray-100 sm:col-span-3 px-4"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
            About TrackEx
          </h2>
          <p>
            TrackEx is designed to simplify expense tracking for projects of all
            sizes. With our platform, admins can manage project expenses
            efficiently, while members can submit expenses with ease. Get
            insights, generate reports, and manage project budgets like never
            before.
          </p>
        </div>
      </section>

      <section id="contact" className="py-12 sm:py-16 sm:col-span-3 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
            Contact Us
          </h2>
          <p>
            If you have any questions, feel free to reach out to us at{" "}
            <a
              href="mailto:support@trackex.com"
              className="text-blue-500 underline"
            >
              support@trackex.com
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="bg-[linear-gradient(180deg,#6051c0,#85439b)] text-white py-8 sm:py-10 text-center sm:col-span-3">
        <p>&copy; 2024 TrackEx. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
