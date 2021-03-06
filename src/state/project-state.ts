import {Project, ProjectStatus} from "../models/project"

// project state management

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn)
    }
}


export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super()
    }

    static getInstance() {
        if(this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance
    }

    addProject(title:string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)

        this.projects.push(newProject);

       this.updateListener()
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const movedProject = this.projects.find(project => {
            return project.id === projectId;
        })

        if(movedProject && movedProject.status !== newStatus) {
            movedProject.status = newStatus;
            this.updateListener()
        }

    }

    private updateListener() {
        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();