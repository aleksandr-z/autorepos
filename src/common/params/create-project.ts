export interface ICreateRepositoryParams {
    name: string;
    default_branch?: string;
    namespace_id?: number;
    approvals_before_merge?: number;
}