// PartnerProgramForm.tsx
import React from 'react';

const PartnerProgramForm: React.FC = () => {
    return (
        <div className="flex items-center justify-center bg-white p-4 pb-8">
            <div className="w-full max-w-5xl flex flex-col md:flex-row">
                {/* Left section with heading */}
                <div className="md:w-1/2 flex flex-col justify-center p-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Schedule a call
            </span>
                        <br />
                        <span className="text-gray-800">to learn more</span>
                    </h1>
                    <p className="text-gray-700 mb-4">
                        about joining{" "}
                        <span className="font-semibold">
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                GOXI
              </span>{" "}
                            Partner Program
            </span>
                    </p>
                </div>

                {/* Right section with form */}
                <div className="md:w-1/2">
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <form className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full p-3 border border-gray-300 rounded-[8px] shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full p-3 border border-gray-300 rounded-[8px] shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Work Email Address"
                                    className="w-full p-3 border border-gray-300 rounded-[8px] shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div className="pt-2 w-[200px] m-auto">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-6 rounded-[8px] shadow-lg font-medium text-lg bg-gradient-to-r from-red-600 to-orange-500 text-white transition-transform transform hover:scale-105"
                                >
                                    Schedule A Call
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerProgramForm;