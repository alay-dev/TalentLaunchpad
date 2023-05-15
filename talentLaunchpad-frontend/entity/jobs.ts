export type Job = {
    id: number,
    created_at: Date,
    updated_at: Date,
    user_id: number,
    job_type: string,
    job_title: string,
    salary: string,
    skills_required: string,
    description: string,
    apply_link: string,
    location: string,
    company_id: number,
    employee_resume: string,
    experience_required: string,
    qualification_required: string,
    industry: string
}