export type Resume = {
    id: number,
    created_at: Date,
    updated_at: Date,
    user_id: number,
    description: string,
    skills: string,
    resume_link: string,
    educations: Education[],
    projects: Project[],
    work_experience: WorkExperience[]
}

export type Education = {
    id: number,
    created_at: Date,
    updated_at: Date,
    resume_id: number,
    degree: string,
    institute: string,
    start_date: Date,
    end_date: Date,
    description: string
}

export type Project = {
    id: number,
    created_at: Date,
    updated_at: Date,
    resume_id: number,
    project_name: string,
    start_date: Date,
    end_date: Date,
    description: string
}

export type WorkExperience = {
    id: number,
    created_at: Date,
    updated_at: Date,
    resume_id: number,
    job_title: string,
    company: string,
    start_date: Date,
    end_date: Date,
    description: string
}