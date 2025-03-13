import React, { useState } from 'react';
import { FaFileExcel, FaUpload, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// You can use your existing Input components
interface InputProps {
    id: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupMembersUpload: React.FC = () => {
    const [policyNo, setPolicyNo] = useState('');
    const [endorsementNo, setEndorsementNo] = useState('');
    const [fileName, setFileName] = useState('No file chosen');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('No file chosen');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Upload Group Members</h1>

                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <div className="space-y-6">
                        {/* Use your existing input component or this placeholder */}
                        <div>
                            <input
                                type="text"
                                placeholder="Enter PolicyNo"
                                value={policyNo}
                                onChange={(e) => setPolicyNo(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green transition"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Enter EndorsementNo"
                                value={endorsementNo}
                                onChange={(e) => setEndorsementNo(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green transition"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">Select Excel File</label>
                            <div className="flex flex-wrap items-center gap-2">
                                <label htmlFor="fileUpload" className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-50 py-2 px-4 rounded border border-gray-300 transition-colors">
                                    <span>Choose file</span>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <span className="text-gray-600">{fileName}</span>
                            </div>

                            {/* Optional: Add a preview of the Excel icon if a file is selected */}
                            {fileName !== 'No file chosen' && (
                                <div className="mt-3 flex items-center text-custom-green">
                                    <FaFileExcel className="mr-2" />
                                    <span className="text-sm">Excel file selected</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Optional: Add upload button with your brand color */}
                    <div className="mt-8 flex justify-end">
                        <button className="bg-custom-green hover:bg-green-800 text-white py-2 px-6 rounded-md transition-colors flex items-center">
                            <FaUpload className="mr-2" />
                            Upload
                        </button>
                    </div>
                </div>

                <div className="flex mt-6 space-x-2">
                    <button className="bg-white border border-gray-300 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <FaAngleLeft />
                    </button>
                    <button className="bg-white border border-gray-300 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupMembersUpload;