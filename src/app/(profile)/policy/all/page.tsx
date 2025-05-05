import PolicyTable from "@/components/policy-table";

export default function ExsitingPolicyPage(){
    return(
        <div>
            <PolicyTable
                policyType={"group"}
                companyLogo="/images/logo.png"
                companyName="Insurance Plus Ltd"
            />
        </div>
    );
}