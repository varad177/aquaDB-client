import React from "react";

const Profile = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <nav>
            <ol className="flex items-center text-sm">
              <li>
                <a className="text-blue-500" href="/dashboard">
                  Dashboard
                </a>{" "}
                /
              </li>
              <li className="ml-2 text-gray-500">Settings</li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between gap-6 -mt-4">
          {/* Personal Information Section */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-md border border-gray-200">
  <h2 className="text-xl font-semibold mb-8">Personal Information</h2>
  <div className="space-y-8">
    {/* Full Name and Phone Number */}
    <div className="flex gap-8">
      {/* Full Name */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-user text-gray-400"></i>
          </span>
          <input
            type="text"
            className="mt-1 block w-full h-12 pl-10 bg-gray-50 border border-gray-300 rounded-md p-2 text-gray-700"
            defaultValue="David Jhon"
          />
        </div>
      </div>
      {/* Phone Number */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-phone text-gray-400"></i>
          </span>
          <input
            type="text"
            className="mt-1 block w-full h-12 pl-10 bg-gray-50 border border-gray-300 rounded-md p-2 text-gray-700"
            defaultValue="+990 3343 7865"
          />
        </div>
      </div>
    </div>

    {/* Email Address */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <i className="fas fa-envelope text-gray-400"></i>
        </span>
        <input
          type="email"
          className="mt-1 block w-full h-12 pl-10 bg-gray-50 border border-gray-300 rounded-md p-2 text-gray-700"
          defaultValue="devidjond45@gmail.com"
        />
      </div>
    </div>

    {/* Username */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <i className="fas fa-user-tag text-gray-400"></i>
        </span>
        <input
          type="text"
          className="mt-1 block w-full h-12 pl-10 bg-gray-50 border border-gray-300 rounded-md p-2 text-gray-700"
          defaultValue="devidjhon24"
        />
      </div>
    </div>

    {/* BIO */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">BIO</label>
      <textarea
        rows="5"
        className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-gray-700"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet."
      />
    </div>
  </div>
  <div className="mt-8 flex justify-end">
    <button className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium mr-4">Cancel</button>
    <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">Save</button>
  </div>
</div>
          {/* Your Photo Section */}
          <div className="flex-1 h-fit max-w-sm bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Your Photo</h2>
            <div className="flex items-center mb-3">
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="text-blue-500 cursor-pointer">Edit your photo</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-red-500 text-sm">Delete</button>
                  <button className="text-blue-500 text-sm">Update</button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center border border-dashed border-blue-400 rounded-md p-6 bg-blue-50">
              <div className="text-blue-600 text-2xl mb-2">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <label
                htmlFor="fileUpload"
                className="block text-center text-blue-600 font-medium cursor-pointer"
              >
                Click to upload
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <p className="text-sm text-gray-500 mt-2">SVG, PNG, JPG, or GIF (max, 800 x 800px)</p>
              <input id="fileUpload" type="file" className="hidden" />
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium mr-2">Cancel</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
