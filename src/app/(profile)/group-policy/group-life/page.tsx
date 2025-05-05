import PolicyTable from "@/components/policy-table";

export default function GroupLifePage(){
    return(
        <div>
            <PolicyTable
                policyType={"group"}
                companyLogo="/assets/logo.png"
                companyName="GOXI Ltd"
            />
        </div>
    );
}