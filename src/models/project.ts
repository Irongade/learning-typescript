// Project types.
export enum ProjectStatus {
    Active,
    Finished
}

// how Project object should look like.
export class Project {
    constructor(public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus) {

    }
}