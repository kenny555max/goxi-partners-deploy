import React, { useState } from 'react';
import { FaFileExcel, FaUpload, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const GroupMembersUpload: React.FC = () => {
    const [policyNo, setPolicyNo] = useState('');
    const [endorsementNo, setEndorsementNo] = useState('');
    const [fileName, setFileName] = useState('No file chosen');
    const [fileData, setFileData] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccess(null);

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                setError('Please select a valid Excel file (.xlsx or .xls)');
                setFileName('No file chosen');
                setFileData(null);
                return;
            }

            setFileName(file.name);
            setFileData(file);
        } else {
            setFileName('No file chosen');
            setFileData(null);
        }
    };

    // Convert Excel file to array of objects
    const convertExcelToArray = async (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    resolve(jsonData);
                } catch (error) {
                    console.log(error);
                    reject(new Error('Failed to parse Excel file. Please check the file format.'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Error reading the file.'));
            };

            reader.readAsBinaryString(file);
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!policyNo.trim()) {
            setError('Policy number is required');
            return;
        }

        if (!fileData) {
            setError('Please select an Excel file');
            return;
        }

        try {
            setLoading(true);

            // Convert Excel to array
            const membersArray = await convertExcelToArray(fileData);

            if (!membersArray.length) {
                throw new Error('The Excel file appears to be empty');
            }

            // Create form data
            const formData = new FormData();
            formData.append('policyNo', policyNo);

            if (endorsementNo.trim()) {
                formData.append('endorsementNo', endorsementNo);
            }

            // Add the members array as JSON string
            formData.append('membersData', JSON.stringify(membersArray));

            // Upload to our Next.js API route, which will forward to external API
            const response = await fetch('/api/upload-members', {
                method: "POST",
                //headers: {
                //    'Content-Type': 'multipart/form-data',
                //},
                body: formData
            });

            const data = await response.json();

            if (!response.ok){
                throw Error(data?.error);
            }

            setSuccess('Members uploaded successfully!');
            console.log('Upload response:', data);

             setPolicyNo('');
             setEndorsementNo('');
             setFileName('No file chosen');
             setFileData(null);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred during upload');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Upload Group Members</h1>

                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Success message */}
                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <p className="text-green-700">{success}</p>
                            </div>
                        )}

                        <div>
                            <input
                                type="text"
                                placeholder="Enter PolicyNo"
                                value={policyNo}
                                onChange={(e) => setPolicyNo(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green transition"
                                required
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

                            {fileName !== 'No file chosen' && (
                                <div className="mt-3 flex items-center text-custom-green">
                                    <FaFileExcel className="mr-2" />
                                    <span className="text-sm">Excel file selected</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="bg-custom-green hover:bg-green-800 text-white py-2 px-6 rounded-md transition-colors flex items-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload className="mr-2" />
                                        Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
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