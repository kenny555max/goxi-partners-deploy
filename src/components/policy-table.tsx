'use client';
import React, { useState, useRef } from 'react';
import { Search, Download, Copy, FileText, MoreHorizontal, Eye, Edit, Trash2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { usePolicies } from './usePolicies';

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
    policyType?: 'individual' | 'group';
    companyLogo?: string; // Add prop for company logo
    companyName?: string; // Add prop for company name
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

const PolicyTable = ({
                         policyType = 'individual',
                         companyLogo = '/images/company-logo.png', // Default logo path
                         companyName = 'Insurance Company' // Default company name
                     }: PolicyTableProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const { toast } = useToast();
    const tableRef = useRef<HTMLDivElement>(null);

    // Use our custom hook to fetch policies
    const { policies, loading, error, refetch } = usePolicies(policyType);

    const filteredPolicies = policies?.filter((policy: any) =>
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
    const convertToCSV = (policies: Policy[]) => {
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
        const policyText = filteredPolicies.map((policy: any) =>
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

    // Function to generate PDF using jsPDF (browser-side PDF generation)
    const handlePDFDownload = () => {
        toast({
            title: "Generating PDF",
            description: "Please wait while your PDF is being prepared...",
        });

        // Import jsPDF dynamically to avoid SSR issues
        import('jspdf').then(async ({ default: jsPDF }) => {
            try {
                // Properly import jspdf-autotable
                const autoTable = (await import('jspdf-autotable')).default;

                const doc = new jsPDF();

                // Add company logo (if exists)
                try {
                    // This requires the logo to be accessible as a data URL or public URL
                    doc.addImage(companyLogo, 'PNG', 15, 10, 30, 30);
                } catch (e) {
                    console.warn('Could not add logo to PDF', e);
                    // If logo fails to load, add a text placeholder for the company name
                    doc.setFontSize(20);
                    doc.text(companyName, 15, 25);
                }

                // Add title
                doc.setFontSize(16);
                doc.text('Policy Report', 15, 50);

                // Add timestamp
                doc.setFontSize(10);
                doc.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 58);

                // Create table
                const tableColumn = ['#', 'Policy No', 'Product', 'Insured', 'Period of Cover', 'FOP', 'Premium', 'Sum Insured', 'Status', 'Trans Date'];
                const tableRows = filteredPolicies.map((policy: Policy, index: number) => [
                    index + 1,
                    policy.policyNo,
                    policy.product,
                    policy.insured,
                    policy.periodOfCover,
                    policy.fop,
                    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.premium),
                    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.sumInsured),
                    policy.status,
                    policy.transDate
                ]);

                // Use autoTable correctly
                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 65,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 66, 66] },
                    alternateRowStyles: { fillColor: [240, 240, 240] },
                    margin: { top: 65 }
                });

                // Save PDF
                doc.save('policies.pdf');

                toast({
                    title: "Download Complete",
                    description: "PDF file has been downloaded successfully.",
                });
            } catch (error) {
                console.error('Error generating PDF:', error);
                toast({
                    title: "PDF Generation Failed",
                    description: "Failed to generate PDF. Please try again later.",
                    variant: "destructive",
                });
            }
        }).catch((error) => {
            console.error('Error loading jsPDF:', error);
            toast({
                title: "PDF Generation Failed",
                description: "Could not load PDF generation library. Please try again later.",
                variant: "destructive",
            });
        });
    };

    // Function to handle printing with company logo
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const tableHTML = `
                <html>
                <head>
                    <title>Policy Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .report-header { display: flex; align-items: center; margin-bottom: 20px; }
                        .logo { max-height: 60px; margin-right: 20px; }
                        .company-info { flex-grow: 1; }
                        .company-name { font-size: 22px; font-weight: bold; margin: 0; }
                        .report-title { font-size: 18px; margin: 5px 0; }
                        .report-date { color: #666; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                        th { background-color: #f2f2f2; }
                        .active { color: green; font-weight: bold; }
                        .expired { color: gray; }
                        .pending { color: orange; }
                        .cancelled { color: red; }
                        @media print {
                            .no-print { display: none; }
                            body { margin: 0.5cm; }
                        }
                    </style>
                </head>
                <body>
                    <div class="report-header">
                        <img src="${companyLogo}" alt="${companyName}" class="logo" onerror="this.style.display='none'">
                        <div class="company-info">
                            <h1 class="company-name">${companyName}</h1>
                            <h2 class="report-title">Policy Report</h2>
                            <p class="report-date">Generated on ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="no-print">
                        <button onclick="window.print()">Print Report</button>
                        <button onclick="window.close()">Close</button>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
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
                            ${filteredPolicies.map((policy: any, index: number) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${policy.policyNo}</td>
                                    <td>${policy.product}</td>
                                    <td>${policy.insured}</td>
                                    <td>${policy.periodOfCover}</td>
                                    <td>${policy.fop}</td>
                                    <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.premium)}</td>
                                    <td>${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.sumInsured)}</td>
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

            // Wait for content and images to load before printing
            printWindow.onload = function() {
                // Auto-print is now handled by button in the print window
                // This gives time for the logo to load
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
                    <div className="flex flex-wrap gap-2">
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
                    {loading ? (
                        <div className="text-center py-6 text-gray-500">Loading policies...</div>
                    ) : error ? (
                        <div className="text-center py-6 text-red-500">{error}</div>
                    ) : (
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedPolicies.length > 0 ? (
                                    paginatedPolicies.map((policy: any, index: number) => (
                                        <TableRow key={policy.id}>
                                            <TableCell className="text-center font-medium">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                            <TableCell>{policy.policyNo}</TableCell>
                                            <TableCell>{policy.product}</TableCell>
                                            <TableCell>{policy.insured}</TableCell>
                                            <TableCell>{policy.periodOfCover}</TableCell>
                                            <TableCell>{policy.fop}</TableCell>
                                            <TableCell>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.premium)}</TableCell>
                                            <TableCell>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.sumInsured)}</TableCell>
                                            <TableCell><StatusBadge status={policy.status} /></TableCell>
                                            <TableCell>{policy.transDate}</TableCell>
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
                    )}
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