// types.ts

export interface UploadPlanDataRequest {
    file: File;
}

export interface UploadAdvisorDataRequest {
    file: File;
}

export interface CreateAdminPartnerRequest {
    name: string;
    external_id: string;
}

export interface CreateAdminPartnerResponse {
    id: string;
    license_validity: string;
    external_id: string;
}

export interface GetAdminPartnerResponse {
    id: string;
    license_validity: string;
    name: string;
    tier: string;
    external_id: string;
}

export interface CreateAdminDataPartnerRequest {
    name: string;
    external_id: string;
}

export interface GetAdminDataPartnerResponse {
    id: string;
    name: string;
    external_id: string;
}

export interface CreateAdminPlanRequest {
    name: string;
    external_id: string;
    partner_id: string;
    data_partner_id: string;
}

export interface GetAdminPlanResponse {
    id: string;
    name: string;
    external_id: string;
    partner_id: string;
    data_partner_id: string;
}

export interface CreateNewPlanRequest {
    plan_name: string;
    plan_details: string;
    plan_file: File;
}

export interface GetAdvisorPlanResponse {
    id: string;
    name: string;
    partner: GetAdminPartnerResponse;
    data_partner: GetAdminDataPartnerResponse;
    advisors: string[];
    external_id?: string;
}

export interface GetAdvisorPlanPartnerResponse {
    id: string;
    name: string;
    external_id: string;
}
