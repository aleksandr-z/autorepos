import {issueTypes} from "../params/issue";

export interface IIssueDto {
    project_id: number;
    state: string; // todo: добавить enum
    type: issueTypes;
    title: string;
    description: string;
}