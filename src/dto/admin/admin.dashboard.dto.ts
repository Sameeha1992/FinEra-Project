export interface VendorStatusOverviewDto{
    approved:number,
    pending:number,
    rejected:number,
}


export interface AdminDashbaordSummaryDto{
    totalUsers:number;
    totalVendors:number;
    verifiedVendors:number;
    nonVerifiedVendors:number;
    rejectedVendors:number
    totalLoanApplications:number;
    approvedLoans:number;
    totalRevenue:number;
}

export interface AdminDashboardDto{
    summary:AdminDashbaordSummaryDto;
    vendorStatusOverview:VendorStatusOverviewDto;
}