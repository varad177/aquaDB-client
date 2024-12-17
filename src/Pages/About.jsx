import React from "react";

const About = () => {
  return (
    <div
      className="h-full w-full flex items-center justify-center px-6 bg-gray-100"    
    >
      <div className="w-[90%] h-[90%] bg-white rounded-lg p-12 shadow">
        <h1 className="text-5xl font-extrabold font-serif text-center text-blue-600  mb-8">
          About AquaDB
        </h1>
        <p className="text-gray-800 text-lg leading-relaxed text-center mb-10">
          Welcome to <span className="font-semibold">AquaDB</span>, a cutting-edge data platform crafted by <span className="font-semibold">Team Astraa</span>. It empowers stakeholders (marine and fisheries researchers) by providing tools to analyze, share, and collaborate on aquatic data efficiently and securely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Key Features Section */}
          <div>
            <h2 className="text-3xl font-semibold text-blue-600 mb-6">
              Key Features
            </h2>
            <ul className="list-disc list-inside space-y-4 text-gray-700 text-lg">
              <li>Effortless management and visualization of aquatic data.</li>
              <li>Interactive modals for in-depth data exploration.</li>
              <li>Supports multiple languages for global accessibility.</li>
              <li>Error-resilient design ensuring seamless operation.</li>
              <li>Fully responsive interface for enhanced accessibility.</li>
            </ul>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6">
            Our Vision
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            AquaDB envisions simplifying data management for marine researchers and enabling collaboration on a global scale. We aim to support decisions that promote the conservation of aquatic ecosystems through an intuitive, reliable platform.
          </p>
        </div>

        {/* Team Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6">
            Developed By
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            Built with dedication by <span className="font-semibold">Team Astraa</span>, a group of innovators committed to creating tools for scientific and environmental progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
