import BaseComponent from "./base-component"
import {Project, ProjectStatus} from "../models/project"
import {autoBind} from "../decorators/autobind"
import {DragTarget} from "../models/drag-drop"
import {projectState} from "../state/project-state"
import {ProjectItem} from "./project-item"

// Project list
export class ProjectList extends BaseComponent<HTMLDivElement, HTMLElement> implements DragTarget {

    assignedProjects: Project[] = [];

    constructor(private type: "active" | "finished") {

        super("project-list", "app", false, `${type}-projects`)

        // interacting with project state
        projectState.addListener((projects: Project[]) => {

            const relevantProject = projects.filter(prj => {

                if(this.type === "active") {
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProject;

            this.renderProjects()
        })

        this.configure()
        this.renderContent();

    }

    // abstract method coming from base component class (must be declared)
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler)
        this.element.addEventListener("drop", this.dropHandler)
        this.element.addEventListener("dragleave", this.dragLeaveHandler)
    }

    // render content of the structure(the header and list) of the active and finsihed products
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }

    @autoBind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable")
        }
    };

    @autoBind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished)
    };

    @autoBind
    dragLeaveHandler(_event: DragEvent) {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable")
    };

    private renderProjects() {

        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

        // clears all previous;y added states
        listEl.innerHTML = ""
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
        }
    }

}