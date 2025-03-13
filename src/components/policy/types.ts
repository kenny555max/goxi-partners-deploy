// types/policy.ts
export interface PolicyDetails {
    policyNo: string;
    product: string;
    insuredName: string;
    address: string;
    phoneNo: string;
    emailAddress: string;
    agent: string;
    periodOfCover: {
        startDate: string;
        endDate: string;
    };
    nextRenewalDate: string;
    sumInsured: number;
    premium: number;
}