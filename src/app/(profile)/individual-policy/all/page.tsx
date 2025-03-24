import PolicyTable from "@/components/policy-table";

export default function ExsitingPolicyPage(){
    const samplePolicies = [
        {
            id: '1',
            policyNo: 'PL-2025-0001',
            product: 'Home Insurance',
            insured: 'John Smith',
            periodOfCover: '01/01/2025 - 01/01/2026',
            fop: 'Monthly',
            premium: 1250.00,
            sumInsured: 350000.00,
            status: 'active',
            transDate: '12/15/2024'
        },
        {
            id: '2',
            policyNo: 'PL-2025-0002',
            product: 'Auto Insurance',
            insured: 'Sarah Johnson',
            periodOfCover: '02/15/2025 - 02/15/2026',
            fop: 'Annual',
            premium: 850.00,
            sumInsured: 25000.00,
            status: 'active',
            transDate: '01/25/2025'
        },
        {
            id: '3',
            policyNo: 'PL-2025-0003',
            product: 'Life Insurance',
            insured: 'Michael Brown',
            periodOfCover: '03/10/2025 - 03/10/2026',
            fop: 'Quarterly',
            premium: 3500.00,
            sumInsured: 500000.00,
            status: 'pending',
            transDate: '02/28/2025'
        },
        {
            id: '4',
            policyNo: 'PL-2024-0128',
            product: 'Travel Insurance',
            insured: 'Emma Wilson',
            periodOfCover: '11/05/2024 - 11/25/2024',
            fop: 'One-time',
            premium: 120.00,
            sumInsured: 10000.00,
            status: 'expired',
            transDate: '10/30/2024'
        },
        {
            id: '5',
            policyNo: 'PL-2025-0004',
            product: 'Health Insurance',
            insured: 'David Garcia',
            periodOfCover: '01/01/2025 - 01/01/2026',
            fop: 'Monthly',
            premium: 450.00,
            sumInsured: 100000.00,
            status: 'active',
            transDate: '12/12/2024'
        },
        {
            id: '6',
            policyNo: 'PL-2024-0156',
            product: 'Business Insurance',
            insured: 'Martinez LLC',
            periodOfCover: '12/01/2024 - 12/01/2025',
            fop: 'Annual',
            premium: 5200.00,
            sumInsured: 1000000.00,
            status: 'cancelled',
            transDate: '11/15/2024'
        },
        {
            id: '7',
            policyNo: 'PL-2025-0005',
            product: 'Renters Insurance',
            insured: 'Jennifer Lee',
            periodOfCover: '01/15/2025 - 01/15/2026',
            fop: 'Monthly',
            premium: 75.00,
            sumInsured: 15000.00,
            status: 'active',
            transDate: '01/10/2025'
        },
        {
            id: '8',
            policyNo: 'PL-2025-0006',
            product: 'Motorcycle Insurance',
            insured: 'Robert Taylor',
            periodOfCover: '02/01/2025 - 02/01/2026',
            fop: 'Quarterly',
            premium: 320.00,
            sumInsured: 8000.00,
            status: 'active',
            transDate: '01/20/2025'
        },
        {
            id: '9',
            policyNo: 'PL-2025-0007',
            product: 'Pet Insurance',
            insured: 'Lisa Rodriguez',
            periodOfCover: '01/05/2025 - 01/05/2026',
            fop: 'Monthly',
            premium: 45.00,
            sumInsured: 5000.00,
            status: 'pending',
            transDate: '12/20/2024'
        },
        {
            id: '10',
            policyNo: 'PL-2025-0008',
            product: 'Flood Insurance',
            insured: 'Thomas White',
            periodOfCover: '03/01/2025 - 03/01/2026',
            fop: 'Annual',
            premium: 720.00,
            sumInsured: 250000.00,
            status: 'active',
            transDate: '02/15/2025'
        }
    ];

    return(
        <div>
            <PolicyTable policies={samplePolicies} />
        </div>
    );
}