'use client';
import React, { useState, useRef } from 'react';
import { Search, Download, Copy, FileText, Filter, MoreHorizontal, Eye, Edit, Trash2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

// Define the Policy interface
interface Policy {
    id: string;
    policyNo: string;
    product: string;
    insured: string;
    periodOfCover: string;
    fop: string; // Frequency of Payment
    premium: number;
    sumInsured: number;
    status: 'active' | 'expired' | 'pending' | 'cancelled';
    transDate: string;
}

interface PolicyTableProps {
    policies: any[];
}

const StatusBadge = ({ status }: { status: Policy['status'] }) => {
    const statusStyles = {
        active: 'bg-green-100 text-green-800',
        expired: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const PolicyTable = ({ policies }: PolicyTableProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const { toast } = useToast();
    const tableRef = useRef<HTMLDivElement>(null);

    const filteredPolicies = policies.filter(policy =>
        policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.insured.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedPolicies = filteredPolicies.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredPolicies.length / pageSize);

    // Helper function to convert policies to CSV format
    const convertToCSV = (policies: any[]) => {
        const headers = ['Policy No', 'Product', 'Insured', 'Period of Cover', 'FOP', 'Premium', 'Sum Insured', 'Status', 'Trans Date'];
        const csvRows = [
            headers.join(','),
            ...policies.map(policy => [
                policy.policyNo,
                policy.product,
                policy.insured,
                policy.periodOfCover,
                policy.fop,
                policy.premium,
                policy.sumInsured,
                policy.status,
                policy.transDate
            ].join(','))
        ];
        return csvRows.join('\n');
    };

    // Function to download data as CSV
    const handleCSVDownload = () => {
        const csvContent = convertToCSV(filteredPolicies);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'policies.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Download Complete",
            description: "CSV file has been downloaded successfully.",
        });
    };

    // Function to download data as Excel
    const handleExcelDownload = () => {
        // For Excel, we'll use the same CSV format but change the extension
        // In a real application, you might want to use a library like exceljs or xlsx
        const csvContent = convertToCSV(filteredPolicies);
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'policies.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Download Complete",
            description: "Excel file has been downloaded successfully.",
        });
    };

    // Function to copy data to clipboard
    const handleCopy = () => {
        const policyText = filteredPolicies.map(policy =>
            `${policy.policyNo} | ${policy.product} | ${policy.insured} | ${policy.periodOfCover} | ${policy.fop} | $${policy.premium} | $${policy.sumInsured} | ${policy.status} | ${policy.transDate}`
        ).join('\n');

        navigator.clipboard.writeText(policyText).then(() => {
            toast({
                title: "Copied to Clipboard",
                description: "Policy data has been copied to clipboard.",
            });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({
                title: "Copy Failed",
                description: "Failed to copy data to clipboard.",
                variant: "destructive",
            });
        });
    };

    // Function to generate and download PDF
    const handlePDFDownload = () => {
        // In a real application, you'd use a library like jsPDF or pdfmake
        // This is a simplified mock implementation
        toast({
            title: "Generating PDF",
            description: "Your PDF is being prepared for download.",
        });

        // Simulate PDF generation delay
        setTimeout(() => {
            toast({
                title: "Download Complete",
                description: "PDF file has been downloaded successfully.",
            });
        }, 1500);
    };

    // Function to handle printing
    const handlePrint = () => {
        // Open a new window with just the table content for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const tableHTML = `
                <html>
                <head>
                    <title>Policy Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { margin-bottom: 20px; }
                        .active { color: green; font-weight: bold; }
                        .expired { color: gray; }
                        .pending { color: orange; }
                        .cancelled { color: red; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>My Policies</h1>
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Policy No</th>
                                <th>Product</th>
                                <th>Insured</th>
                                <th>Period of Cover</th>
                                <th>FOP</th>
                                <th>Premium</th>
                                <th>Sum Insured</th>
                                <th>Status</th>
                                <th>Trans Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredPolicies.map(policy => `
                                <tr>
                                    <td>${policy.policyNo}</td>
                                    <td>${policy.product}</td>
                                    <td>${policy.insured}</td>
                                    <td>${policy.periodOfCover}</td>
                                    <td>${policy.fop}</td>
                                    <td>$${policy.premium.toLocaleString()}</td>
                                    <td>$${policy.sumInsured.toLocaleString()}</td>
                                    <td class="${policy.status}">${policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}</td>
                                    <td>${policy.transDate}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;
            printWindow.document.open();
            printWindow.document.write(tableHTML);
            printWindow.document.close();

            // Wait for content to load before printing
            printWindow.onload = function() {
                printWindow.print();
                // printWindow.close();
            };
        } else {
            toast({
                title: "Print Failed",
                description: "Unable to open print window. Please check your browser settings.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">My Policies</h2>
                <p className="text-gray-600 mb-6">Find below all the insurance policies you have registered with us</p>

                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 mb-6">
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 bg-white"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 bg-white"
                            onClick={handleCSVDownload}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 bg-white"
                            onClick={handleExcelDownload}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Excel
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 bg-white"
                            onClick={handlePDFDownload}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 bg-white"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search policies..."
                            className="pl-10 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-lg" ref={tableRef}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead>Policy No</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Insured</TableHead>
                                <TableHead>Period of Cover</TableHead>
                                <TableHead>FOP</TableHead>
                                <TableHead>Premium</TableHead>
                                <TableHead>Sum Insured</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Trans Date</TableHead>
                                <TableHead className="w-12">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPolicies.length > 0 ? (
                                paginatedPolicies.map((policy, index) => (
                                    <TableRow key={policy.id}>
                                        <TableCell className="text-center font-medium">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell>{policy.policyNo}</TableCell>
                                        <TableCell>{policy.product}</TableCell>
                                        <TableCell>{policy.insured}</TableCell>
                                        <TableCell>{policy.periodOfCover}</TableCell>
                                        <TableCell>{policy.fop}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(policy.premium)}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(policy.sumInsured)}</TableCell>
                                        <TableCell><StatusBadge status={policy.status} /></TableCell>
                                        <TableCell>{policy.transDate}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center py-6 text-gray-500">
                                        No data available in table
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {filteredPolicies.length > 0 && (
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                        <div>
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredPolicies.length)} of {filteredPolicies.length} entries
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolicyTable;